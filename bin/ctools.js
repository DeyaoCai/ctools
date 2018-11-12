#! node
const fs = require("fs");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
const read = require("../src/read.js");


const cwd = process.cwd().split(/[\\\/]/).pop();

const arv = process.argv;
if(arv.includes("read")) {
  let conf;
  const pathes = fs.readdirSync("./");
  if (pathes.includes("ctools.config.js")){
    try{
      conf = require("../ctools.config.js");
    } catch (e) {
      throw("get 'ctools.config.js' fail!");
    }
    conf.forEach(item => read.writeExportFile(item));
    console.log(conf)
    // exec("./read.config.js");
  } else {
    throw "we need a 'read.config.js' file";
  }
}



