const exec = require("../exec.js");
const updatePackageJson = require("./updatePackageJson.js");
const fns = {
  // 发布
  publish: {
    exec: "npm publish",
    next: ()=> fns.xxx,
  },
}
// 入口；
module.exports =  function () {
  updatePackageJson();
  exec(fns.publish)
};
