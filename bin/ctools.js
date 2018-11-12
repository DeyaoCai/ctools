#! node
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
const read = require("../src/read.js");
const cwd = process.cwd();
const arv = process.argv;

if(arv.includes("read")) {
  let conf;
  const pathes = fs.readdirSync("./");
  if (pathes.includes("ctools.config.js")){
    try{conf = require(cwd + "/ctools.config.js");}
    catch (e) {throw("get 'ctools.config.js' fail!");}
    conf.forEach(item => read.writeExportFile(item));
  } else {
    throw "we need a 'read.config.js' file";
  }
}



