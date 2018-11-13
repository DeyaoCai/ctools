#! node
const fs = require("fs");
const log = require("../src/node/log.js");
const exec = require("../src/node/exec.js");
const read = require("../src/node/read.js");
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
if(arv.includes("proxy")) {
  exec("node ./src/node/app.js");
}


