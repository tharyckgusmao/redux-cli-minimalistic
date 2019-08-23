const capitalize = require("./utils").capitalize;
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");

function templateReducer(name) {
  return `
    export const Types = {
  REQUEST: "${name}/REQUEST",
  SUCCESS: "${name}/SUCCESS",
  FAILURE: "${name}/FAILURE"
};

const initialState = {
  isFetching: false,
  isFetched: false,
  data: null,
  statusText: null,
  status: null
};

export default function ${name}(state = initialState, action) {
  switch (action.type) {
    case Types.REQUEST:
      return Object.assign({}, state, {
        isFetching: false,
        isFetched: true,        
        status: action.payload.error.status,
        statusText: action.payload.error.statusText,
        uuid: new Date().getTime()
      });
    case Types.SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        isFetched: false,
        data:action.payload.${name}.edges,
        status: [],
        statusText: null,
        uuid: new Date().getTime()
      });
    case Types.FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isFetched: false,
        statusText: null,
        data:null,
        status: null,
        uuid: new Date().getTime()
      });

    default:
      return state;
  }
}

export const Creators = {
  get${capitalize(name)}Request: data => ({
    type: Types.REQUEST,
    payload: data
  }),

  get${capitalize(name)}Success: data => ({
    type: Types.SUCCESS,
    payload: data
  }),

  get${capitalize(name)}Failure: error => ({
    type: Types.FAILURE,
    payload: { error }
  })
};

    `;
}

exports.reducer = name => {
  const template = templateReducer(name);
  const p = path.resolve(
    __dirname,
    global.env.REDUX_NAME_FOLDER,
    global.env.REDUCER_NAME_FOLDER,
    "reducers",
    `${name}.js`
  );
  const pReducer = path.resolve(
    __dirname,
    global.env.REDUX_NAME_FOLDER,
    global.env.REDUCER_NAME_FOLDER,
    global.env.REDUCER_NAME_MAIN
  );

  if (!fs.existsSync(p)) {
    const mainReducer = fs
      .readFileSync(pReducer)
      .toString()
      .split("\n")
      .filter(e => e != "");

    const imports = mainReducer.filter(e => e.indexOf("import") > -1);
    
    const restant = mainReducer.slice(imports.length, mainReducer.length);

    imports.push(`import ${name} from "./reducers/${name}";`);
    imports.push(``);


    const posRestnt = restant.reverse().findIndex(e => e.indexOf(",") > -1);
    restant.splice(posRestnt - 1, 0, `,        ${name}`);

    const newImports = imports.concat(restant.reverse());

    fs.writeFileSync(p, template);
    fs.writeFileSync(pReducer, newImports.join("\n"));

    chalk.green("CREATED FILE SUCCESS!");
  } else {
    throw chalk.red("FILE EXIST!");
  }
};
