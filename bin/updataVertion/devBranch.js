const exec = require("../../src/exec.js");
const log = require("../../src/log.js");
const updatePackageJson = require("./updatePackageJson.js");
// 入口；
module.exports =  function (confs) {

  const fns = {
    pullCurBranch: {
      exec: () =>"git pull origin " +  confs.branch,
      next: ()=> fns.pullTest,
    },
    pullTest: {
      exec: () => "git pull origin test",
      resove: () => {
        updatePackageJson();
      },
      next: ()=> fns.save,
    },
    save: {
      exec: "git add .",
      next: ()=> fns.commit,
    },
    commit: {
      exec: 'git commit -m "auto commit"',
      next: ()=> fns.push,
    },
    push: {
      exec: 'git push',
      next: ()=> fns.publish,
    },
    // 发布
    publish: {
      exec: "npm publish",
      resove: () => {
        log("end").end();
      },
      next: ()=> fns.xxx,
    },
  }
  if(confs.push){
    exec(fns.pullCurBranch);
  } else {
    updatePackageJson();
    exec(fns.publish);
  }
};
