#! node
const fs = require("fs");
const path = require("path");
const log = require("../src/log.js");
const type = require("../src/type.js");
const cProcess = require("child_process");
const readTemMainTemp = require("../src/readTemMainTemp.js");

const cwd = process.cwd();
const arv = process.argv;
const webpackConf = require(`${cwd}/ctools.conf/webpack.conf.js`);
const repertoryDirName = webpackConf.repertoryPath || "tem-biz";
const baseMap = webpackConf.alias || {};


if (arv.includes("updatePackageJson")) {
  getPackage();
  log("succ:").use("bs")(`update package success!`).use("s").end();
}

if (arv.includes("getDemo")) {
  cProcess.execSync(`git clone https://github.com/DeyaoCai/vue-dev-tool.git`);
  log("succ:").use("bs")(`clone https://github.com/DeyaoCai/vue-dev-tool.git success!`).use("s").end();
}

// 拉取代码
if (arv.includes("getCodes")) {
  const packagePath = [];
  // 参数里面带不带 分支名
  const branchReg = /^--branch-/;
  const branchArv = arv.find(item => branchReg.test(item));
  // 进入代码存放目录
  process.chdir(`${cwd}/${repertoryDirName}`);
  // 获取所有的代码仓库列表 // 所有代码都会拉下来；
  // 但是设置了disabled 属性的将不会写入别名
  const repertoryList = webpackConf.repertoryList.filter(item => !item.disabled);

  repertoryList.forEach(item => {
    const repertory = item.repertory;
    const userBranch = item.branch;
    log(repertory).use("t").end();
    const branch = userBranch || (branchArv && branchArv.replace(branchReg, ""));
    const branchRegExp = branch ? new RegExp(branch) : null;

    const dirName = repertory.replace(/(.+)\/([^\/]+)\.git$/, `$2`);
    const outPutPath = `${cwd}/${repertoryDirName}/${dirName}`;
    packagePath.push(outPutPath);
    try {
      cProcess.execSync(`git clone ${repertory}`);
      log("succ:").use("bs")(`clone '${repertory}' success!`).use("s").end();
    } catch (e) {}

    if (branchRegExp) {
      try {
        process.chdir(outPutPath);
        const result = cProcess.execSync(`git branch -r`, {encoding: 'utf8'});

        console.log(!branchRegExp.test(result))
        if (!branchRegExp.test(result)) {
          // 检出 master 分支
          console.log('// 检出 master 分支')
          try {cProcess.execSync(`git checkout master`);} catch (e) {}
          // 检出预设置分支
          try {cProcess.execSync(`git branch ${branch}`);} catch (e) {}
        }
        // 切换到预设值分支
        cProcess.execSync(`git checkout ${branch}`);
      } catch (e) {
      }
      process.chdir(`${cwd}/${repertoryDirName}`);
    }
  });
  log("succ:").use("bs")(`clone repertory complete!`).use("s").end();
  getPackage(packagePath);
}

function getPackage(list = []) {
  const baseConf = webpackConf.packageJson;
  const webpackConfAlias = {};

  const confList = list.map(item => require(`${item}/package.json`));
  // 根目录下的 package 主要是用于 安装依赖
  confList.forEach((conf, index) => {
    ["dependencies", "devDependencies"].forEach(item => {
      const prop = conf[item];
      prop && Object.keys(prop).forEach(key =>
        (baseConf[item][key] = prop[key])
      );
    });
  });
  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(baseConf));
  log("succ:").use("bs")(`write 'package.json' success!`).use("s").end();

  // 主要用于别名
  confList.forEach((conf, index) => {
    setWebPackConfAlias(webpackConfAlias, list[index], conf);
  });
  fs.writeFileSync(`${cwd}/ctools.conf/webpack.conf.json`, JSON.stringify({
    resolve: {extensions: ['.js', '.vue', '.json'], alias: webpackConfAlias}
  }));
  log("succ:").use("bs")(`write 'webpack.conf.json' success!`).use("s").end();
  // 主要用于 index.html // 可以没有
  try {
    const templateConfsPath = webpackConf.getTemplateConfs;
    let templateConfs = require(`${cwd}/ctools.conf/templateFns/${templateConfsPath}`)(confList, readTemMainTemp.smallHump);
    if (!type.isArray(templateConfs)) {
      templateConfs = [templateConfs];
    }
    templateConfs.forEach(conf => {
      const fullPath = `${cwd}${conf.outPutPath}`;
      fs.writeFileSync(fullPath, conf.content);
      log("succ:").use("bs")(`write '${fullPath}' success!`).use("s").end();
    });
  } catch (e) {}
}

function setWebPackConfAlias(conf, fullPath, packageJson) {
  const name = packageJson.name;
  const map = baseMap[name] || {};
  if (/wxm/.test(name) || /(app-|-app`)/g.test(name)) {
    const srcName = /wxm/.test(name) ? name : name.replace(/(app-|-app`)/g, "");
    conf[`@${srcName}`] = `${fullPath}${map.src || ""}`;
    conf[`${name}`] = `${fullPath}`;
  } else {
    const srcName = packageJson.name;
    conf[`@${srcName}`] = `${fullPath}${fs.readdirSync(fullPath).includes("src") ? `/src` : ``}`;
    conf[`${name}`] = path.join(fullPath, (packageJson.main || "").replace(/index\.js/, ""));
  }
}


