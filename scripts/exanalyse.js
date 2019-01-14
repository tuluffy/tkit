const { default: Project, VariableDeclarationKind } = require('ts-simple-ast');
const fs = require('fs-extra');
const path = require('path');

const indentationText = require('../package.json').rekit.indentationText || '  ';

function defaultCodeWriter(
  type,
  bodyArr,
  indentationText = defaultCodeWriter,
  start = '',
  end = ''
) {
  switch (type) {
    default:
      return `${start ? `${start}\n` : ''}${
        bodyArr.length ? `${indentationText}${bodyArr.join(`,\n${indentationText}`)}` : ''
      }${end ? `\n${end}` : ''}`;
  }
}

function injectCode(fileMapToInject, action) {
  console.time('parse');
  const isRemove = action === 'remove';
  const project = new Project({
    manipulationSettings: {
      quoteKind: "'", // single or double quote
      indentationText: ''
    },
    tsConfigFilePath: path.join(__dirname, '..', 'tsconfig.json')
  });
  Object.keys(fileMapToInject).forEach(file => {
    const root = project.addExistingSourceFile(file, fs.readFileSync(file, { encoding: 'utf8' }));
    const config = fileMapToInject[file];
    if (typeof config !== 'object' || Array.isArray(config)) {
      return console.error(`Error: ${file} with invalid config`);
    }
    if (config.namedImports) {
      if (!Array.isArray(config.namedImports)) {
        config.namedImports = [config.namedImports];
      }
    }
    if (config.vars) {
      if (!Array.isArray(config.vars)) {
        config.vars = [config.vars];
      }
    }
    if (config.namedExports) {
      if (!Array.isArray(config.namedExports)) {
        config.namedExports = [config.namedExports];
      }
    }
    handleVars(root, config, isRemove);
    handleImport(root, config, isRemove);
    // hanleExport(root, config, isRemove);
  });
  project.save();
  console.timeEnd('parse');
}

function handleVars(root, config, isRemove) {
  if (config.vars) {
    const { vars } = config;
    vars.forEach(v => {
      const { declarationKind, declarations, codeWriter = defaultCodeWriter } = v;
      if (Array.isArray(declarations)) {
        let newDeclarations = declarations;
        const statement = root.getVariableStatement(decl => {
          const _declarationKind = decl.getDeclarationKind();
          const namesNode = decl.getDeclarations();
          if (_declarationKind === declarationKind) {
            let matched;
            namesNode.forEach(nameNode => {
              // const typeString = nameNode.getType().getText();
              const nameString = nameNode.getName();
              newDeclarations = newDeclarations.filter(declaration => {
                let { name, type, initializer } = declaration;
                type = type || 'any';
                if (nameString === name) {
                  matched = true;
                  const initializerNodes = nameNode.getInitializer();
                  let arrStart = initializerNodes.getFirstChild();
                  arrStart = arrStart && arrStart.getText();
                  let arrEnd = initializerNodes.getLastChild();
                  arrEnd = arrEnd && arrEnd.getText();
                  const initializers = [];
                  let exitst;
                  if (
                    (arrStart === '[' || arrStart === '{') &&
                    (arrEnd === ']' || arrEnd === '}')
                  ) {
                    initializerNodes.forEachChild(initializerNode => {
                      const initializerString = initializerNode.getText();
                      if (initializerString === initializer) {
                        exitst = true;
                        if (!isRemove) {
                          initializers.push(initializerString);
                        }
                      } else {
                        initializers.push(initializerString);
                      }
                    });
                  } else {
                    // 非数组、对象：替换
                    arrStart = arrEnd = '';
                  }
                  if (!exitst) {
                    initializers.push(initializer);
                  }
                  nameNode.setInitializer(
                    codeWriter('initializer', initializers, indentationText, arrStart, arrEnd)
                  );
                  return false;
                }
                return true;
              });
            });
          }
        });
        if (newDeclarations.length) {
          const statement = root.addVariableStatement({
            declarationKind,
            declarations: newDeclarations
          });
          statement.setIsExported(true);
        }
      }
    });
  }
}

function handleImport(root, config, isRemove) {
  let { moduleSpecifier, namedImports } = config;
  const importDeclaration = root.getImportDeclaration(dec => {
    return dec.getModuleSpecifier().getText() === `'${moduleSpecifier}'`;
  });
  if (importDeclaration || isRemove) {
    // update or remove
    let oldNamedImports = (importDeclaration.getNamedImports() || []).map(a => a.getText());
    if (isRemove) {
      importDeclaration.remove();
    } else {
      if (config.defaultImport) {
        importDeclaration.setDefaultImport(config.defaultImport);
      }
      if ('defaultImport' in config) {
        importDeclaration.remove();
      }
      if (namedImports) {
        namedImports.forEach(newItem => {
          if (oldNamedImports.indexOf(newItem) === -1) {
            oldNamedImports.push(newItem);
          }
        });
        importDeclaration.removeNamedImports();
        importDeclaration.addNamedImports(oldNamedImports);
      } else if ('namedImports' in config) {
        importDeclaration.removeNamedImports();
      }
    }
  } else if (moduleSpecifier) {
    root.addImportDeclaration(config);
  }
}

function handleDefaultExport(root, config, isRemove) {
  const defaultExport = root.getDefaultExportSymbol();
}

function hanleExport(root, config, isRemove) {
  let { moduleSpecifier, namedExports } = config;
  const exportDeclaration = root.getExportedDeclarations(dec => {
    return dec.getModuleSpecifier().getText() === `'${moduleSpecifier}'`;
  });
  if (namedExports) {
    if (exportDeclaration) {
      const newAdd = [];
      exportDeclaration.forEach(declaration => {
        console.log(declaration.getName());
      });
    }
  }
}

module.exports.injectCode = injectCode;
