const fs = require("fs");
const cprocess = require("child_process");

function writeFiles() {
  cprocess.exec("node ./bin/ctools.js read");
  shouldExec = true;
  console.log("succ");
}

let shouldExec;
writeFiles();

function timeout() {
  shouldExec && setTimeout(() => {
    writeFiles();
  }, 300);
  shouldExec = false;
}

fs.unwatchFile("./oriSrc");
fs.watch("./oriSrc", {}, function (a, b) {
  lastTime = new Date().getTime();
  timeout();
});

