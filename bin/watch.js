const fs = require("fs");
const path = require("path");
const cProcess = require("child_process");
const cwd = process.cwd();
const conf = require(path.join(cwd, "./ctools.config"));
const cb = makeExecLater(function () {
  cProcess.execSync(`node ${path.join(__dirname, `./ctools.js`)} read"`);
  console.log(`exec success, ${Date.now()}`);
});
const arr = flatArr(
  flatArr(conf.read).map(item => item.inputPath)
);
function flatArr (arr){
  return [].concat.apply([], Object.values(arr))
}

arr.forEach(item => {
  fs.watch(path.join(cwd, item), cb);
});

function makeExecLater(fn) {
  let time = 0;
  return function () {
    const thisTime = time = `${Date.now()} ${Math.random()}`;
    setTimeout(() => {
      if (thisTime === time) fn.apply(null, arguments);
    }, 340)
  }
}
