const capitalize = require("./utils").capitalize;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");

function templateReducer(name) {
  return `
import { call, put, select } from "redux-saga/effects";
import { Creators as ${capitalize(
    name
  )}Actions } from "reducers/reducers/${name}";

//TODO:TROCAR
//import { signInMutation } from "services/mutations/${name}";

import client from "services/client";

export function* get${capitalize(name)}(action) {
  try {

    //TODO:TROCAR
    
      let mutation = signInMutation(action.payload.user.email, action.payload.user.password);
    
    //
    const request = yield call(client.mutate, { mutation });
    yield put(${capitalize(name)}Actions.get${capitalize(
    name
  )}Success(request));
  } catch (error) {
    yield put(
      ${capitalize(name)}Actions.get${capitalize(name)}Failure({
        status: error.graphQLErrors,
        statusText: "Algo Deu Errado!"
      })
    );
  }
}


    `;
}

exports.sagas = name => {
  const template = templateReducer(name);

  const p = path.resolve(
    __dirname,
    global.env.REDUX_NAME_FOLDER,
    global.env.SAGAS_NAME_FOLDER,
    `${name}`,
    `${name}.js`

  );

  const pSagas = path.resolve(
    __dirname,
    global.env.REDUX_NAME_FOLDER,
    global.env.SAGAS_NAME_FOLDER,
    global.env.SAGAS_ROOT
  );

    shell.mkdir(
        "-p",
        path.resolve(
            __dirname,
            global.env.REDUX_NAME_FOLDER,
            global.env.SAGAS_NAME_FOLDER,
            `${name}`
    )
    )


  
  if (!fs.existsSync(p)) {
    const mainReducer = fs
      .readFileSync(pSagas)
      .toString()
      .split("\n")
      .filter(e => e != "");

    const imports = mainReducer.filter(e => e.indexOf("import") > -1);
    const restant = mainReducer.slice(imports.length, mainReducer.length);

    imports.push(`import { get${capitalize(name)} } from "./${name}/${name}";`);

    imports.push(
      `import { Types as ${capitalize(name)}Types } from "reducers/${
        global.env.REDUCER_NAME_FOLDER
      }/${name}";`
    );

    imports.push(``);

    const posRestnt = restant.reverse().findIndex(e => e.indexOf(",") > -1);

    restant.splice(
      posRestnt,
      0,
      `,       takeLatest(${capitalize(name)}Types.REQUEST, get${capitalize(
        name
      )})`
    );

    const newImports = imports.concat(restant.reverse());

    fs.writeFileSync(p, template);
    fs.writeFileSync(pSagas, newImports.join("\n"));

    chalk.green("CREATED FILE SUCCESS!");
  } else {
    throw chalk.red("FILE EXIST!");
  }
};
