#! node
const fs = require("fs");
const path = require("path");
const log = require("../src/log.js");
const type = require("../src/type.js");
const cProcess = require("child_process");
const readTemMainTemp = require("../src/readTemMainTemp.js");

const cwd = process.cwd();
const arv = process.argv;
let webpackConf;
try {
  webpackConf = require(`${cwd}/ctools.conf/webpack.conf.js`);
} catch(e) {
  webpackConf = {};
}
const repertoryDirName = webpackConf.repertoryPath || "tem-biz";
const baseMap = webpackConf.alias || {};

const dir = require(path.join(__dirname, "../src/dir.js"));

if (arv.includes("getDemo")) {
  cProcess.execSync(`git clone https://github.com/DeyaoCai/vue-dev-tool.git`);
  log("succ:").use("bs")(`clone https://github.com/DeyaoCai/vue-dev-tool.git success!`).use("s").end();

  try{
    const sectionsPath = path.join(cwd, "./vue-dev-tool/sections");
    try {dir.mk(sectionsPath);}catch (e) {
      log.be("fail:").e(`mkDir ${sectionsPath}!`).end();
    }
    try {process.chdir(sectionsPath);} catch (e) {
      log.be("fail:").e(`cd ${sectionsPath}!`).end();
    }
    try {cProcess.execSync(`git clone https://github.com/DeyaoCai/ctools.git`);}
    catch (e) {log("succ:").use("bs")(`git clone https://github.com/DeyaoCai/ctools.git success!`).use("s").end();}
    try {process.chdir(`${cwd}`);}catch(e){}
  }catch (e) {
    log.be("fail").e("get getDemo fail!").end();
  }
}
if (arv.includes("updatePackageJson")) {
  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(webpackConf.packageJson));
  log("succ:").use("bs")(`update package success!`).use("s").end();
}

if (arv.includes("getDependence")) {
  try{
    try {process.chdir(`${path.join(cwd, webpackConf.repertoryPath)}`);} catch (e) {}
    try {
      cProcess.execSync(`${/tem/.test(webpackConf.repertoryPath) ? "" : "c"}npm i`);
    } catch (e) {log("succ:").use("bs")(`get dependence success!`).use("s").end();}
    try {process.chdir(`${cwd}`);}catch(e){}
  }catch (e) {
    log.be("fail").e("get dependence fail!").end();
  }
}

// 拉取代码
if (arv.includes("getCodes")) {
  const packagePath = [];
  // 参数里面带不带 分支名
  const branchReg = /^--branch-/;
  const branchArv = arv.find(item => branchReg.test(item));

  dir.mk(`${cwd}/${repertoryDirName}`);
  // 进入代码存放目录
  process.chdir(`${cwd}/${repertoryDirName}`);
  // 获取所有的代码仓库列表 // 所有代码都会拉下来；
  // 但是设置了disabled 属性的将不会写入别名
  const repertoryList = webpackConf.repertoryList.filter(item => !item.disabled);
  const mainRepertory = webpackConf.mainRepertory;
  if (!mainRepertory) {
    log("tips").use("bt")("you 'd better set an main repertory if this work space need some dependence!").use("t").end();
  } else if (!webpackConf.repertoryList.some(item => item.repertory.includes(mainRepertory))) {
    log("warn").use("bw")("you set an main repertory but none of these repertories is  the one!").use("w").end();
  }
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

        if (!branchRegExp.test(result)) {
          // 检出 master 分支
          log('// 检出 master 分支').use("t").end();
          try {cProcess.execSync(`git checkout master`);} catch (e) {}
          // 检出预设置分支
          try {cProcess.execSync(`git branch ${branch}`);} catch (e) {}
        }
        try{
          // 切换到预设值分支
          cProcess.execSync(`git checkout ${branch}`);
        } catch (e) {}
      } catch (e) {}
      process.chdir(`${cwd}/${repertoryDirName}`);
    }
  });
  log("succ:").use("bs")(`clone repertory complete!`).use("s").end();
  getPackage(packagePath);
}

function getPackage(list = []) {
  const baseConf = webpackConf.packageJson;
  const {mainRepertory} = webpackConf;
  const webpackConfAlias = {};
  const mainRepertoryReg = new RegExp(`[\\/]${mainRepertory}$`);
  const confList = list.map(item => {
    try {
      const package = require(`${item}/package.json`);
      try {
        if (mainRepertoryReg.test(item)) {
          const fullPath = path.join(item, "../package.json");
          fs.writeFileSync(fullPath, JSON.stringify(package));
          dir.mk(path.join(item, "static"));
          log.bs(`succ:`).s(`write ${fullPath} succ!`).end();
        }
      }catch (e) {}
      return package;
    } catch (e) {
      log("fail:").use("bw")(`try get '${item}/package.json' fail. it may be caused by empty repertory!`).use("w").end();
    }
  }).filter(item => item);

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
      const fullPath = `${cwd}/${webpackConf.repertoryPath}/${conf.outPutPath}`;
      dir.mk(fullPath.replace(/[\\\/][^\\\/]+[\.][^\\\/]+$/, ""));
      fs.writeFileSync(fullPath, conf.content);
      log("succ:").use("bs")(`write '${fullPath}' success!`).use("s").end();
    });
  } catch (e) {}
  try {
    if (webpackConf.mainRepertory) {
      const copyFilesByDirFromMainRepertory = webpackConf.copyFilesByDirFromMainRepertory;
      const targetRootPath = path.join(cwd, webpackConf.repertoryPath);
      const oriRootPath = path.join(targetRootPath, webpackConf.mainRepertory);
      copyFilesByDirFromMainRepertory && copyFilesByDirFromMainRepertory.forEach(item => {
        const midTargetRootPath = path.join(targetRootPath, item.target);
        const midOriRootPath = path.join(oriRootPath, item.ori);
        dir.mk(midTargetRootPath);
        fs.readdirSync(midOriRootPath).forEach(key => {
          fs.copyFileSync(
            path.join(midOriRootPath, key),
            path.join(midTargetRootPath, key)
          )
        })
        log.bs("succ:").s(`copy file '${oriRootPath}' to '${targetRootPath}' success!`).end();
      });
    }
  } catch (e) {
    log.be("fail:").e(`copy file '${oriRootPath}' to '${targetRootPath}' fail!`).end();
  }
}

function setWebPackConfAlias(conf, fullPath, packageJson) {
  const name = packageJson.name;
  const map = baseMap[name] || {};
  if (/wxm/.test(name) || /(app-|-app|pc-|-pc)/g.test(name)) {
    const srcName = /wxm/.test(name) ? name : name.replace(/(app-|-app|pc-|-pc)/g, "");
    conf[`@${srcName}`] = `${fullPath}${map.src || ""}`;
    conf[`${name}`] = `${fullPath}`;
  } else {
    const srcName = packageJson.name;
    conf[`@${srcName}`] = `${fullPath}${fs.readdirSync(fullPath).includes("src") ? `/src` : ``}`;
    conf[`${name}`] = path.join(fullPath, (packageJson.main || "").replace(/index\.js/, ""));
  }
}


function getAllPackageJsonInWorkSpace(rootPath){
  const workSapceReg = /(^work-space-)|(sections)/;
  const workSpaceListRoot = fs.readdirSync(rootPath);
  const prevList = workSpaceListRoot.filter(item =>
    workSapceReg.test(item) && !fs.statSync(path.join(rootPath, item)).isFile()
  ).map(item =>
    fs.readdirSync(path.join(rootPath, item))
      .filter(key => !/^node_modules$/.test(key) && !fs.statSync(path.join(rootPath, item, key)).isFile())
      .map(key => ({
        name: require(path.join(rootPath, item, key, "package.json")).name,
        path: path.join(rootPath, item, key)
      }))
  );
  const list = [].concat.apply([], prevList);
  const alias = {};
  list.forEach(item => {
    const oriSrcPath = path.join(item.path, "/src");
    alias[`@${item.name}`] = fs.existsSync(oriSrcPath) || path.existsSync(oriSrcPath) ? oriSrcPath : item.path;
    alias[item.name] =  item.path;
  });
  fs.writeFileSync(path.join(rootPath, "./ctools.conf/alias.json"),JSON.stringify({resolve: {extensions: ['.js', '.vue', '.json'], alias}}));
  log.bs("succ").s(`write ${path.join(rootPath, "./ctools.conf/alias.json")} succ!`).end();
}
if (arv.includes("updataAllAlias")) {
  getAllPackageJsonInWorkSpace(cwd);
}
