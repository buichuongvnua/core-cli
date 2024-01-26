const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function generate(name, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy;
  }
  const cwd = options.cwd || process.cwd();
  const inCurrent = name === ".";
  const targetDir = path.resolve(cwd, `components/${name}` || ".");
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `Generate component in current project?`,
          },
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `Target directory ${targetDir} already exists. Pick an action:`,
            choices: [
              { name: "Overwrite", value: "overwrite" },
              { name: "Cancel", value: false },
            ],
          },
        ]);
        if (!action) {
          return;
        } else if (action === "overwrite") {
          console.log(`\nRemoving ${targetDir}...`);
          await fs.remove(targetDir);
        }
      }
    }
  }
  const questions = [
    {
      type: "list",
      name: "feature",
      message: "Select feature in component?",
      choices: ["CRUD", "Empty"],
    },
  ];
  const { feature } = await inquirer.prompt(questions);
  fs.mkdirSync(targetDir);
  if (feature == "CRUD") {
    const questionInputs = [
      {
        type: "input",
        name: "sqlQuery",
        message: "Input sql query create table:",
      },
    ];
    const { sqlQuery } = await inquirer.prompt(questionInputs);
    if (!sqlQuery || sqlQuery.length == 0) {
      console.log(`Your not input sql query`);
    } else {
      await exec(`npx knex migrate:make create_table${name}`);
    }
    const controllerFilePathTemplate = path.join(
      path.resolve(__dirname, "../../create-cli/template-nodejs"),
      "components/example/exampleController.js"
    );
    const routerFilePathTemplate = path.join(
      path.resolve(__dirname, "../../create-cli/template-nodejs"),
      "components/example/exampleRouter.js"
    );
    const serviceFilePathTemplate = path.join(
      path.resolve(__dirname, "../../create-cli/template-nodejs"),
      "components/example/exampleService.js"
    );
    const repositoryFilePathTemplate = path.join(
      path.resolve(__dirname, "../../create-cli/template-nodejs"),
      "components/example/exampleRepository.js"
    );
    const indexFilePathTemplate = path.join(
      path.resolve(__dirname, "../../create-cli/template-nodejs"),
      "components/example/index.js"
    );

    const controllerFileData = fs.readFileSync(
      controllerFilePathTemplate,
      "utf8"
    );
    const routerFileData = fs.readFileSync(routerFilePathTemplate, "utf8");
    const serviceFileData = fs.readFileSync(serviceFilePathTemplate, "utf8");
    const repositoryFileData = fs.readFileSync(
      repositoryFilePathTemplate,
      "utf8"
    );

    const indexFileData = fs.readFileSync(indexFilePathTemplate, "utf8");
    const controllerFilePath = path.join(targetDir, `${name}Controller.js`);
    const routerFilePath = path.join(targetDir, `${name}Router.js`);
    const serviceFilePath = path.join(targetDir, `${name}Service.js`);
    const repositoryFilePath = path.join(targetDir, `${name}Repository.js`);
    const indexFilePath = path.join(targetDir, `index.js`);

    const controllerFileDataNew = controllerFileData.replace(/\{name\}/g, name);
    const routerFileDataNew = routerFileData.replace(/\{name\}/g, name);
    const serviceFileDataNew = serviceFileData.replace(/\{name\}/g, name);
    const repositoryFileDataNew = repositoryFileData.replace(/\{name\}/g, name);
    const indexFileDataNew = indexFileData.replace(/\{name\}/g, name);

    const indexComponentPath = path.resolve(cwd, `components/index.js`);
    const contentIndexComponent = fs.readFileSync(indexComponentPath, "utf8");

    const insertionDeclareLine = `const ${name} = require(\'./${name}\');`;
    let modifiedContent = "";
    // index.js in component is empty
    if (contentIndexComponent == "") {
      modifiedContent += insertionDeclareLine + "\n\n";
      modifiedContent += `module.exports = {\n  ${name},\n}` + "\n";
    } else {
      const lines = contentIndexComponent.split("\n");
      if (contentIndexComponent.includes(insertionDeclareLine)) {
        console.log("Line code is existing: " + insertionDeclareLine);
      } else {
        
      }
      const moduleExportsLine = "module.exports";
      const lineInserts = [];
      for (const line of lines) {
        if (contentIndexComponent.includes(insertionDeclareLine)) {
          console.log("Line code is existing: " + insertionDeclareLine);
        }
        if (line.includes(moduleExportsLine)) {
          lineInserts.push(insertionDeclareLine + "\n\n");
          lineInserts.push(line + "\n");
          continue;
        } else {
          lineInserts.push(line + "\n");
        }
      }
    }
    fs.writeFileSync(indexComponentPath, modifiedContent);

    fs.writeFileSync(controllerFilePath, controllerFileDataNew, "utf8");
    fs.writeFileSync(routerFilePath, routerFileDataNew, "utf8");
    fs.writeFileSync(serviceFilePath, serviceFileDataNew, "utf8");
    fs.writeFileSync(repositoryFilePath, repositoryFileDataNew, "utf8");
    fs.writeFileSync(indexFilePath, indexFileDataNew, "utf8");
  }
  process.chdir(targetDir);
  console.log(`Generate component '${name}' created successfully.`);
}

module.exports = (...args) => {
  return generate(...args).catch((err) => {
    console.log(err);
    process.exit(1);
  });
};
