const chalk = require("chalk");
const shell = require("shelljs");
const path = require("path");
const fs = require("fs");

exports.init = function() {
  if (global.env.INIT == "0") {
    shell.mkdir(
      "-p",
      path.resolve(
        __dirname,
        global.env.REDUX_NAME_FOLDER,
        global.env.REDUCER_NAME_FOLDER,
        "reducers"
      )
    );
    shell.mkdir(
      "-p",
      path.resolve(
        __dirname,
        global.env.REDUX_NAME_FOLDER,
        global.env.SAGAS_NAME_FOLDER
      )
    );

    let envsTemp = global.env;

    envsTemp.INIT = 1;
      envsTemp = Object.keys(global.env).map(e => `${e}=${global.env[e]}`).join("\r\n");

    fs.writeFileSync("mini.env", envsTemp);

    chalk.green("INITIALIZED SUCCESS!");

  } else {
   throw chalk.red("APP INITIALIZED!");
  }
};
