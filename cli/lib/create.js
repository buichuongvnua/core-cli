const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const validateProjectName = require("validate-npm-package-name");
const chalk = require("chalk");

async function create(projectName, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy;
  }
  const cwd = options.cwd || process.cwd();
  const inCurrent = projectName === ".";
  const name = inCurrent ? path.relative("../", cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || ".");
  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.log(`Invalid project name: "${name}"`);
    exit(1);
  }
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `Generate project in current directory?`,
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
      name: "framework",
      message: "Select a framework?",
      choices: ["NodeJS", "React CMS"],
    },
  ];
  const template = {
    NodeJS: "create-cli/template-nodejs",
    "React CMS": "create-cli/template-react-cms",
  };
  const { framework } = await inquirer.prompt(questions);
  const templatePath = path.join(
    path.resolve(__dirname, "../../"),
    template[framework]
  );
  await fs.copy(templatePath, targetDir);
  process.chdir(targetDir);
  // Update project name in package.json
  const packageJsonFilePath = path.join(targetDir, "package.json")
  const data = fs.readFileSync(packageJsonFilePath, "utf8");
  const packageJson = JSON.parse(data);
  packageJson.name = projectName
  fs.writeFileSync(packageJsonFilePath, JSON.stringify(packageJson, null,2), 'utf-8');

  //Remove folder template components
  const componentTemplatePath = path.join(targetDir, "components/example");
  fs.removeSync(componentTemplatePath);

  console.log(chalk.green(`Project '${projectName}' created successfully.`));
}

module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log(err);
    process.exit(1);
  });
};
