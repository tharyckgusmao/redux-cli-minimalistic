const program = require("commander");
const chalk = require("chalk");

const envs = require("dotenv").config({ path: "mini.env" });

if (envs.error) {
  throw console.log(chalk.red("MINI.ENV NOT FOUND IN PROJECT"));
}

global.env = envs.parsed;

const init = require("./init.js").init;
const reducer = require("./reducer.js").reducer;
const sagas = require("./sagas.js").sagas;

program.version("Minimalistic and Develompment 1.0.0");

program
  .option("-i, --init", "Initialize JSON Default")
  .option("-r, --reducer <type>", "Create reducer and actions creators")
  .option("-s, --sagas <type>", "Crate sagas and init on Root")
  .parse(process.argv);

if (program.init) init();
else if (program.reducer) reducer(program.reducer);
else if (program.sagas) sagas(program.sagas);

console.log(chalk.blue("BYEEE !!"));
