const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");

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
    const controllerFilePathTemplate = path.join(
      path.resolve(__dirname, "../../create-cli/template-nodejs"),
      "components/example/exampleController.js"
    );
    const controllerFileData = fs.readFileSync(controllerFilePathTemplate, "utf8");
    console.log(controllerFileData)
    const controllerFilePath = path.join(targetDir, `${name}Controller.js`);
    const controllerFileDataNew = controllerFileData.replace(
      /\{name\}/g,
      name
    );
    fs.writeFileSync(controllerFilePath, controllerFileDataNew, "utf8");
  }
  process.chdir(targetDir);
  console.log(`Project '${name}' created successfully.`);
}

module.exports = (...args) => {
  return generate(...args).catch((err) => {
    console.log(err);
    process.exit(1);
  });
};
