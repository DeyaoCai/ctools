const fs = require("fs");
const path = require("path");
const cProcess = require("child_process");
const cwd = process.cwd();
const conf = require(path.join(cwd, "./ctools.config"));
const readCb = makeExecLater(function () {
  cProcess.execSync(`node ${path.join(__dirname, `./ctools.js`)} read"`);
  console.log(`exec success, ${Date.now()}`);
});
const hotCb = makeExecLater(function () {
  const hotPath = path.join(cwd, conf.hot);
  console.log(`now start reload ${hotPath}!`);
  cProcess.execSync(`npm run build"`);
  console.log(`exec success, ${Date.now()}`);
});
const arr = flatArr(
  flatArr(conf.read).map(item => item.inputPath)
);
if (conf.hot) {
  const hotPath = path.join(cwd, conf.hot);
  fs.watch(hotPath, hotCb);
  console.log(`now watching: ${hotPath}`);
}
function flatArr (arr){
  return [].concat.apply([], Object.values(arr))
}

arr.forEach(item => {
  fs.watch(path.join(cwd, item), readCb);
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
