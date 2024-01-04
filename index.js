#!/usr/bin/env node

const fs = require("fs-extra");
const { program } = require("commander");
const path = require("path");
const { promisify } = require("util");
const { exec } = require("child_process");
const execAsync = promisify(exec);


program
  .command("init <projectName>")
  .alias("i")
  .description("Add a new folder and file to a project")
  .action(async (projectName) => {
    await initProject(projectName);
  });

async function initProject(projectName) {
  try {
    const currentPath = process.cwd();
    const targetPath = path.join(currentPath, projectName);

    const templatePath = path.join(__dirname, "template");

    await fs.copy(templatePath, targetPath);

    process.chdir(targetPath);
    console.log(`Project '${projectName}' created successfully.`);
  } catch (error) {
    console.error("Error creating project:", error);
  }
}

program.parse(process.argv);
