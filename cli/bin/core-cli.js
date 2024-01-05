#!/usr/bin/env node

const { program } = require("commander");
const minimist = require("minimist");
program
  .command("create <projectName>")
  .alias("c")
  .description("Add a new project")
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        "\n Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
      );
    }
    // --git makes commander to default git to true
    if (process.argv.includes("-g") || process.argv.includes("--git")) {
      options.forceGit = true;
    }
    require("../lib/create")(name, options);
  });

program.parse(process.argv);
