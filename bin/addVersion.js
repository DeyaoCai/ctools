// #! node
/*
    dev参数
    "push" 发布版本；
    "push --push" // 提交代码并发布版本
    "push --push --not-publish" //提交代码不发布版本

    分支参数
    "push" 提交代码
    "push --todev",  // 提交代码并合并到dev
    "push --todev --publish", // 提交代码并合并到dev 并发布版本

      为什么一个分支参数做加法一个做减法 因为之前的设计就是 dev发版本 ISSUES 提交代码啊；
*/
const fs = require("fs");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
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
  push: process.argv.includes("--push"),
  notPublish: process.argv.includes("--not-publish"),
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
