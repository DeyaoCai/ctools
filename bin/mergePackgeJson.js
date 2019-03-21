#! node
const fs = require("fs");
const path = require("path");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
const type = require("../src/type.js");

const cProcess = require("child_process")
const readTemMainTemp = require("../src/readTemMainTemp.js");

const cwd = process.cwd();
const arv = process.argv;
let repertoryDirName;

try {
  repertoryDirName = require(`${cwd}/ctools.conf/webpack.conf.js`).repertoryPath;
} catch (e) {
  repertoryDirName = "tem-biz";
}
let baseMap;
try {
  baseMap = require(`${cwd}/ctools.conf/webpack.conf.js`).alias;
} catch (e) {
  baseMap = {}
}

function setWebPackConfAlias(name, conf, fullPath) {
  const map = baseMap[name] || {};
  const srcName = /wxm/.test(name) ? name : name.replace(/(app-|-app`)/g, "");
  conf[`@${srcName}`] = `${fullPath}${map.src || ""}`;
  conf[`${name}`] = `${fullPath}`;
}

function getPackage(list = []) {
  const baseConf = require(`${cwd}/ctools.conf/webpack.conf.js`).packageJson;
  const webpackConfAlias = {};

  const confList = list.map(item => require(`${item}/package.json`));
  confList.forEach((conf, index) => {
    const name = conf.name;
    name && setWebPackConfAlias(name, webpackConfAlias, list[index]);
    const dependencies = conf.dependencies;
    const devDependencies = conf.devDependencies;
    // const repository = conf.repository;
    dependencies && Object.keys(dependencies).forEach(key =>
      (baseConf.dependencies[key] = dependencies[key])
    );
    devDependencies && Object.keys(devDependencies).forEach(key =>
      (baseConf.dependencies[key] = devDependencies[key])
    );
    // repository && Object.keys(repository).forEach(key =>
    //   (baseConf.repository ? (baseConf.repository[key] = repository[key]) : (baseConf.repository = repository))
    // );
  });
  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(baseConf));
  log("succ:").use("bs")(`write 'package.json' success!`).use("s").end();

  fs.writeFileSync(`${cwd}/ctools.conf/webpack.conf.json`, JSON.stringify({
    resolve: {extensions: ['.js', '.vue', '.json'], alias: webpackConfAlias}
  }));
  log("succ:").use("bs")(`write 'webpack.conf.json' success!`).use("s").end();

  try {
    const templateConfsPath = require(`${cwd}/ctools.conf/webpack.conf.js`).getTemplateConfs;
    let templateConfs = require(`${cwd}/ctools.conf/templateFns/${templateConfsPath}`)(confList, readTemMainTemp.smallHump);
    if (!type.isArray(templateConfs)) {
      templateConfs = [templateConfs];
    }
    templateConfs.forEach(conf => {
      const fullPath = `${cwd}${conf.outPutPath}`;
      fs.writeFileSync(fullPath, conf.content);
      log("succ:").use("bs")(`write '${fullPath}' success!`).use("s").end();
    });
  } catch (e) {
    // console.log(e);
  }
}

if (arv.includes("install")) {
  cProcess.execSync("npm install");
  log("succ:").use("bs")(`install package success!`).use("s").end();
}
if (arv.includes("updatePackageJson")) {
  getPackage();
  log("succ:").use("bs")(`update package success!`).use("s").end();
}

if (arv.includes("getDemo")) {
  cProcess.execSync(`git clone https://github.com/DeyaoCai/vue-dev-tool.git`);
  log("succ:").use("bs")(`clone https://github.com/DeyaoCai/vue-dev-tool.git success!`).use("s").end();
}

if (arv.includes("getCodes")) {
  const packagePatth = [];
  const branchReg = /^--branch-/;
  const branchArv = arv.find(item => branchReg.test(item));

  process.chdir(`${cwd}/${repertoryDirName}`);
  const repertoryList = require(`${cwd}/ctools.conf/webpack.conf.js`).repertoryList.filter(item => !item.disabled);

  repertoryList.forEach(item => {
    const repertory = item.repertory;
    const userBranch = item.branch;
    log(repertory).use("t").end();
    const branch = userBranch || (branchArv && branchArv.replace(branchReg, ""));
    const branchRegExp = branch ? new RegExp(branch) : null;

    const dirName = repertory.replace(/(.+)\/([^\/]+)\.git$/, `$2`);
    const outPutPath = `${cwd}/${repertoryDirName}/${dirName}`;
    packagePatth.push(outPutPath);
    try {
      cProcess.execSync(`git clone ${repertory}`);
      log("succ:").use("bs")(`clone '${repertory}' success!`).use("s").end();
    } catch (e) {
    }

    if (branchRegExp) {
      try {
        process.chdir(outPutPath);
        const result = cProcess.execSync(`git branch -r`, {encoding: 'utf8'});
        if (!branchRegExp.test(result)) {
          try {
            cProcess.execSync(`git checkout master`);
          } catch (e) {
          }
          try {
            cProcess.execSync(`git branch ${branch}`);
          } catch (e) {
          }
        }
        cProcess.execSync(`git checkout ${branch}`);
      } catch (e) {
      }
      process.chdir(`${cwd}/${repertoryDirName}`);
    }
  });
  log("succ:").use("bs")(`clone 'clone repertory complete!`).use("s").end();
  getPackage(packagePatth);
}
