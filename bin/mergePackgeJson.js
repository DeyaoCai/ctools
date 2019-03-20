#! node
const fs = require("fs");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
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
    const repository = conf.repository;
    dependencies && Object.keys(dependencies).forEach(key =>
      (baseConf.dependencies[key] = dependencies[key])
    );
    devDependencies && Object.keys(devDependencies).forEach(key =>
      (baseConf.dependencies[key] = devDependencies[key])
    );
    repository && Object.keys(repository).forEach(key =>
      (baseConf.repository[key] = repository[key])
    );
  });
  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(baseConf));
  console.log(`write 'package.json' success!`);

  fs.writeFileSync(`${cwd}/ctools.conf/webpack.conf.json`, JSON.stringify({
    resolve: {extensions: ['.js', '.vue', '.json'], alias: webpackConfAlias}
  }));
  console.log(`write 'webpack.conf.json' success!`);

  try {
    const getMainJsTemplateConf = require(`${cwd}/ctools.conf/webpack.conf.js`).getMainJsTemplateConf(confList, readTemMainTemp.smallHump);
    const fullPath = `${cwd}${getMainJsTemplateConf.outPutPath}`
    fs.writeFileSync(fullPath, getMainJsTemplateConf.content);
    console.log(`write '${fullPath}' success!`);
  } catch (e) {

    console.log(e);
  }

}

if (arv.includes("install")) {
  cProcess.execSync("npm install");
  console.log(`install package success!`);
}
if (arv.includes("updatePackageJson")) {
  getPackage();
  console.log(`update package success!`);
}

if (arv.includes("getCodes")) {
  const packagePatth = [];
  const branchReg = /^--branch-/;
  const branchArv = arv.find(item => branchReg.test(item));

  process.chdir(`${cwd}/${repertoryDirName}`);
  const repertoryList = require(`${cwd}/ctools.conf/webpack.conf.js`).repertoryList;

  repertoryList.forEach(item => {
    const repertory = item.repertory;
    const userBranch = item.branch;
    console.log(repertory);
    const branch = userBranch || (branchArv && branchArv.replace(branchReg, ""));
    const branchRegExp = branch ? new RegExp(branch) : null;

    const dirName = repertory.replace(/(.+)\/([^\/]+)\.git$/, `$2`);
    const outPutPath = `${cwd}/${repertoryDirName}/${dirName}`;
    packagePatth.push(outPutPath);
    try {
      cProcess.execSync(`git clone ${repertory}`);
      console.log(`clone '${repertory}' success!`);
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
  console.log(`clone repertory complete!`);
  getPackage(packagePatth);
}
