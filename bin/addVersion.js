#! node
const exec = require("../src/exec.js");
const arg = [];

process.argv.includes("--todev") && arg.push(" --todev");
process.argv.includes("--publish") && arg.push(" --publish");

exec({
  exec: "node ./src/addVersion.js" + arg.join(""),
  next: undefined,
});
