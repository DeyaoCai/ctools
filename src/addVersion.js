const fs = require("fs");
const log = require("./log.js");
const exec = require("./exec.js");
const lightBranch = require("./updataVertion/lightBranch.js");
const devBranch = require("./updataVertion/devBranch.js");

const pathes = fs.readdirSync("../");
const cwd = process.cwd().split(/[\\\/]/).pop();

let bizType = cwd;

const confs ={
  appPath: pathes.find(item=> item.match(/app-common/)),
  bizVersion: null,
  branch: null,
  pushType: null,
  isLightBranch: null,
  isDevBranch: null,
  pushToDevBrance: process.argv.includes("--todev"),
  needPublish: process.argv.includes("--publish"),
}

function getBizType(){
  log("提示!").use("bt")("业务类型： " + bizType).use("t").end();
  exec({
    exec: "git branch",
    resove: judgeBranch,
  });
}

function judgeBranch(stdout) {
  const branches = stdout.replace(/ /g,"").split(/\n/);
  const nowBranch = branches.find(item=>/\*/.test(item));
  confs.branch = nowBranch && nowBranch.slice(1);
  log.t(`now branch is ${confs.branch}!`).end();
  confs.isLightBranch = /^ISSUES-/.test(confs.branch);
  confs.isDevBranch = /^(dev|test|uat|master)$/.test(confs.branch);
  if (confs.isLightBranch) {
    lightBranch(confs);
    return true;
  }
  if (confs.isDevBranch) {
    devBranch(confs);
  }
};
// 入口；
getBizType();
