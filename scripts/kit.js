#! /usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const fsX = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const injectCode = require('./exanalyse').injectCode;

_.pascalCase = _.flow(
  _.camelCase,
  _.upperFirst
);
_.upperSnakeCase = _.flow(
  _.snakeCase,
  _.toUpper
);

const baseSourceDir = path.join(__dirname, '..', 'src');
const baseTestsDir = path.join(__dirname, '..', 'tests');
const templatesDir = path.join(__dirname, 'templates');

const featureMateriels = ['redux', 'selectors', 'services'];
const add = (feature, name, type, options = {}) => {
  let templateType = _.upperFirst(type); // Abb like
  const templates = [];

  if (!type || !type.trim()) {
    return console.log(`Error: invalid type '${type}' found`);
  }

  if (templateType === 'List') {
    name = `${name.replace(/list$/gi, '')}List`;
  }

  // format
  feature = _.kebabCase(feature); // a-a-b like
  const lowerName = _.lowerCase(name);
  const camelName = _.camelCase(name); // aAB like
  const pascalName = _.pascalCase(name); // WordWordWord like

  let modelName = `do${pascalName.replace(/Model$/, '')}Model`;
  let actionName = `do${pascalName}`;
  let selectActionName = `doSelect${pascalName}`;
  let reducerName = `apply${pascalName}`;
  let sagaName = `saga${pascalName}`; // ?
  let selectorName = `get${pascalName}`;
  let presenterName = `SFC${pascalName}`;
  let componentName = pascalName;
  let constsName = _.upperSnakeCase(pascalName);
  let featureSagaName = `${feature}Saga`;
  let cssClassName = `k-${feature}-${_.kebabCase(name)}`;

  const pureStateName = `pure${pascalName}State`;

  const sourceDir = path.join(baseSourceDir, 'features', feature);
  const testsDir = path.join(baseTestsDir, 'features', feature);

  let targetSourceDir = sourceDir;
  let targetTestsDir = testsDir;

  const featureIndex = path.join(sourceDir, 'index.ts');

  // init feature
  let needInit;
  if (!fsX.pathExistsSync(sourceDir)) {
    needInit = true;
    fsX.ensureDirSync(sourceDir);
    fsX.ensureDirSync(testsDir);
    templates.push({
      template: path.join(templatesDir, 'route.ts.tmpl'),
      target: path.join(sourceDir, 'route.ts')
    });
    templates.push({
      template: path.join(templatesDir, 'Index.ts.tmpl'),
      target: featureIndex
    });
    featureMateriels.forEach(materiel => {
      fsX.ensureDirSync(path.join(sourceDir, materiel));
      fsX.ensureDirSync(path.join(testsDir, materiel));
      fsX.copySync(path.join(templatesDir, materiel), path.join(sourceDir, materiel));
    });
  }

  if (!name || !name.trim()) {
    return;
  }

  // options
  const { async, connect, force, pure, url, event } = options;
  // 是否放到 components 子目录
  let components = false;
  let fileName = camelName;
  let exportCode = '';
  let ext = '.ts';
  const isPage = url && !pascalName.match(/Page$/g);
  switch (templateType) {
    // case 'Saga':
    //   targetSourceDir = path.join(sourceDir, 'sagas');
    //   targetTestsDir = path.join(testsDir, 'sagas');
    //   exportCode = '';
    //   break;
    case 'List':
      targetSourceDir = path.join(sourceDir, 'redux');
      targetTestsDir = path.join(testsDir, 'redux');
      exportCode = {
        // vscode syntax bug
        // [path.join(targetSourceDir, 'actions.ts')]:
        //   `export { ${actionName}, ${selectActionName} } from './${fileName}'` + ';\n',
        [path.join(targetSourceDir, 'sagas.ts')]:
          `export { ${sagaName} } from './${fileName}'` + ';\n'
      };
      injectCode({
        [path.join(targetSourceDir, 'actions.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `${actionName}, ${selectActionName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'actions',
                  initializer: `${actionName}`
                },
                {
                  name: 'actions',
                  initializer: `${selectActionName}`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'initialState.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `${pureStateName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'pureInitialState',
                  initializer: `...${pureStateName}`
                }
              ]
            },
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'initialState',
                  initializer: `...${pureStateName}`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'reducer.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: reducerName,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'reducers',
                  initializer: reducerName
                }
              ]
            }
          ]
        }
      });
      break;
    case 'Action':
      targetSourceDir = path.join(sourceDir, 'redux');
      targetTestsDir = path.join(testsDir, 'redux');
      exportCode = {
        // vscode syntax bug
        // [path.join(targetSourceDir, 'actions.ts')]: `export { ${actionName} } from './${fileName}'` + ';\n'
      };
      // async force to using saga
      if (async) {
        templateType = 'Saga';
        exportCode[path.join(targetSourceDir, 'sagas.ts')] =
          `export { ${sagaName} } from './${fileName}'` + ';\n';
      }
      // add initial state into initialState.ts
      injectCode({
        [path.join(targetSourceDir, 'actions.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `${actionName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'actions',
                  initializer: `${actionName}`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'initialState.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `${pureStateName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'pureInitialState',
                  initializer: `...${pureStateName}`
                }
              ]
            },
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'initialState',
                  initializer: `...${pureStateName}`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'reducer.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: reducerName,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'reducers',
                  initializer: reducerName
                }
              ]
            }
          ]
        }
      });
      break;
    case 'Model':
      targetSourceDir = path.join(sourceDir, 'redux');
      targetTestsDir = path.join(testsDir, 'redux');
      templateType = 'Model';
      injectCode({
        [path.join(targetSourceDir, 'sagas.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `default as ${modelName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: `saga${pascalName}`,
                  initializer: `${modelName}.sagas`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'actions.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `default as ${modelName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'actions',
                  initializer: `...${modelName}.actions`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'initialState.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `${camelName}State`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'initialState',
                  initializer: `...${camelName}State`
                }
              ]
            }
          ]
        },
        [path.join(targetSourceDir, 'reducer.ts')]: {
          moduleSpecifier: `./${fileName}`,
          namedImports: `default as ${modelName}`,
          vars: [
            {
              declarationKind: 'const',
              declarations: [
                {
                  name: 'reducers',
                  initializer: `${modelName}.reducers`
                }
              ]
            }
          ]
        }
      });
      break;
    case 'Selector':
      targetSourceDir = path.join(sourceDir, 'selectors');
      targetTestsDir = path.join(testsDir, 'selectors');
      exportCode = {
        // vscode syntax bug
        [path.join(targetSourceDir, 'index.ts')]:
          `export { ${selectorName} } from './${fileName}'` + ';\n'
      };
      break;
    case 'Presenter':
      components = options.components;
      if (components) {
        targetSourceDir = path.join(sourceDir, 'components');
        targetTestsDir = path.join(testsDir, 'components');
      }
      fsX.ensureFileSync(path.join(targetSourceDir, 'index.ts'));
      // stateless component
      presenterName = fileName = `SFC${pascalName}${isPage ? 'Page' : ''}`;
      exportCode = {
        [path.join(targetSourceDir, 'index.ts')]:
          `export { default as ${presenterName} } from './${fileName}'` + ';\n'
      };
      ext = '.tsx';
      break;
    case 'Component':
      components = options.components;
      if (components) {
        targetSourceDir = path.join(sourceDir, 'components');
        targetTestsDir = path.join(testsDir, 'components');
      }
      fsX.ensureFileSync(path.join(targetSourceDir, 'index.ts'));
      componentName = fileName = `${pascalName}${isPage ? 'Page' : ''}`;
      exportCode = {
        [path.join(targetSourceDir, 'index.ts')]:
          `export { default as ${componentName} } from './${fileName}'` + ';\n'
      };
      ext = '.tsx';
      break;
    default:
      return console.error(`Error: invalid type ${type} found`);
  }
  fsX.ensureDirSync(targetSourceDir);
  fsX.ensureDirSync(targetTestsDir);

  const renderData = {
    async: true,
    connect,
    force,
    pure,
    feature,
    url,
    event,
    components,

    name,
    cssClassName,
    pureStateName,
    actionName,
    modelName,
    reducerName,
    sagaName,
    pascalSagaName: _.pascalCase(sagaName),
    selectorName,
    presenterName,
    componentName,
    constsName,
    selectActionName,

    lowerName,
    camelName,
    pascalName,

    fileName
  };

  if (
    lowerName === 'index' ||
    lowerName === 'actions' ||
    lowerName === 'reducer' ||
    camelName === 'initialState' ||
    name === 'default' ||
    lowerName === 'saga'
  ) {
    return console.error(`Error: can\'t use ${name} as name`);
  }

  ['', '.test'].forEach(pts => {
    const extName = `${pts}${ext}`;
    templates.push({
      exportCode,
      template: path.join(templatesDir, `${templateType}${extName}.tmpl`),
      target: path.join(pts === '.test' ? targetTestsDir : targetSourceDir, `${fileName}${extName}`)
    });
  });

  if (templateType === 'Component' || templateType === 'Presenter') {
    templates.push({
      template: path.join(templatesDir, 'Less.tmpl'),
      target: path.join(targetSourceDir, `${fileName}.less`)
    });
  }

  templates.forEach(({ template, target, exportCode }) => {
    if (fsX.pathExistsSync(template)) {
      const res = _.template(fsX.readFileSync(template, 'utf8'))(renderData);
      const old = fsX.pathExistsSync(target);
      if (old && !force) {
        console.error(`Error: ${target} alreay exists, use -f, --force to overlap it`);
      } else {
        if (old) {
          console.log(`Warning: overlap ${target}`);
        }
        fsX.writeFileSync(target, res.replace(/[\n]{3,}/g, '\n\n').trim(), { encoding: 'utf8' });
      }
      if (exportCode) {
        Object.keys(exportCode).forEach(fileToInject => {
          const code = exportCode[fileToInject];
          if (
            code &&
            fsX.readFileSync(fileToInject, { encoding: 'utf8' }).indexOf(code.trim()) === -1
          ) {
            fsX.writeFileSync(fileToInject, code, { encoding: 'utf8', flag: 'a+' });
          }
        });
      }
    } else {
      console.log(`Error: template ${template} not found`);
    }
  });
  if (needInit) {
    // add sagas.ts into src/common/rootSaga.ts
    injectCode({
      [path.join(baseSourceDir, 'common', 'routeConfig.ts')]: {
        moduleSpecifier: `@features/${feature}/route`,
        defaultImport: `${feature}Route`,
        vars: [
          {
            declarationKind: 'const',
            declarations: [
              {
                name: 'childRoutes',
                initializer: `${feature}Route`
              }
            ]
          }
        ]
      },
      [path.join(baseSourceDir, 'common', 'rootSaga.ts')]: {
        moduleSpecifier: `@features/${feature}/redux/sagas`,
        defaultImport: `* as ${featureSagaName}`,
        vars: [
          {
            declarationKind: 'const',
            declarations: [
              {
                name: 'featureSagas',
                initializer: featureSagaName
              }
            ]
          }
        ]
      },
      [path.join(baseSourceDir, 'common', 'rootReducer.ts')]: {
        moduleSpecifier: `@features/${feature}/redux/reducer`,
        defaultImport: `${feature}Reducer`,
        vars: [
          {
            declarationKind: 'const',
            declarations: [
              {
                name: 'reducerMap',
                initializer: `${feature}: ${feature}Reducer`
              }
            ]
          }
        ]
      }
    });
  }

  // add Page into src/features/${feature}/route.ts
  if ((templateType === 'Component' || templateType === 'Presenter') && url) {
    injectCode({
      [path.join(targetSourceDir, 'route.ts')]: {
        vars: [
          {
            declarationKind: 'const',
            declarations: [
              {
                name: 'childRoutes',
                initializer: `{
    load: loader('${templateType === 'Component' ? componentName : presenterName}'),
    path: '${_.kebabCase(typeof url === 'string' && url ? url : name)}'
  }`
              }
            ]
          }
        ]
      }
    });
  }
};

commander
  .version(require('../package.json').version)
  .command('add <type> <feature[/name]>')
  .option('-a, --async', 'auto async in features/xxx/index.tsx')
  .option('-c, --connect', 'connect with redux')
  .option('-p, --pure', 'use React.PureComponent insted of React.Component')
  .option('-e, --event', 'wrapp with EventWrapper')
  .option('-f, --force', 'overlap if file already exists')
  .option('-u, --url', "'create NamePage' like Component")
  .action((type, featureAndname, options) => {
    const [feature, name, cpName] = featureAndname.split('/');
    // 普通组件是否放到 components 目录
    if (cpName && !options.url) {
      options.components = true;
    }
    if (name || cpName) {
      add(feature, cpName || name, type, options);
    }
  });

commander.parse(process.argv);
