#! node
const fs = require("fs");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
const read = require("../src/read.js");
const readWx = require("../src/readWx.js");
const cProcess = require("child_process")
const cwd = process.cwd();
const arv = process.argv;

if(arv.includes("getPackage")) {
  const list = require(`${cwd}/ctools.conf/packgeList.js`).map(item => require(`${cwd}${item}/package.json`));
  const baseConf = require(`${cwd}/ctools.conf/basePackageJSON.js`);
  list.forEach(conf => {
    const dependencies =  conf.dependencies;
    const devDependencies =  conf.devDependencies;
    dependencies && Object.keys(dependencies).forEach(key =>
      baseConf.dependencies[key] = dependencies[key]
    );
    devDependencies && Object.keys(devDependencies).forEach(key =>
      baseConf.dependencies[key] = devDependencies[key]
    );
  });
  fs.writeFileSync(`${cwd}/package.json`, JSON.stringify(baseConf));
  console.log(`write 'package.json' success!`);

}
if(arv.includes("install")) {
  cProcess.execSync("npm install");
  console.log(`install package success!`);
}
if(arv.includes("getCodes")) {

  const branchReg = /^--branch-/;
  const branchArv = arv.find(item => branchReg.test(item));
  const branch = branchArv && branchArv.replace(branchReg, "");
  const branchRegExp = branch ? new RegExp(branch) : null;

  process.chdir(`${cwd}/tem-biz`);
  const repertoryList = require(`${cwd}/ctools.conf/repertoryList.js`);
  repertoryList.forEach(item => {
    let dirName = "";
    try {
      dirName = item.replace(/(.+)\/([^\/]+)\.git$/,`$2`);
      cProcess.execSync(`git clone ${item}`);
      console.log(`clone '${item}' success!`);
    } catch(e){}

    if (branchRegExp) {
      try {
        process.chdir(`${cwd}/tem-biz/${dirName}`);
        const result = cProcess.execSync(`git branch -r`, {encoding: 'utf8'});
        if (!branchRegExp.test(result)) {
          cProcess.execSync(`git checkout master`);
          cProcess.execSync(`git branch ${branch}`);
        }
        cProcess.execSync(`git checkout ${branch}`);
      } catch(e) {
        process.chdir(`${cwd}/tem-biz`);
      }
    }
  });
  console.log(`clone repertory complete!`);
}
