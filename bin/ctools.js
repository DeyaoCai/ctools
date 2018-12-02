#! node
const fs = require("fs");
const log = require("../src/log.js");
const exec = require("../src/exec.js");
const read = require("../src/read.js");
const readWx = require("../src/readWx.js");

const cwd = process.cwd();

const arv = process.argv;
if(arv.includes("read")) {
  let conf;
  const pathes = fs.readdirSync("./");
  if (pathes.includes("ctools.config.js")){
    try{conf = require(cwd + "/ctools.config.js");}
    catch (e) {throw("get 'ctools.config.js' fail!");}
    conf.forEach(item => {
      if(item.readType === "we") readWx.writeExportFile(item) ;
      else read.writeExportFile(item) ;
    });
  } else {
    throw "we need a 'read.config.js' file";
  }
}
