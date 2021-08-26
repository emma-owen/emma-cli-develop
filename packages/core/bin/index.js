#!/usr/bin/env node

const utils = require("@emma-cli-develop/utils");
console.log("utils----------", utils);
const helpers = require("@emma-cli-develop/helpers");
console.log("helpers--------", helpers);
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const pkg = require("../package.json");
const ListCommand = require("./command");
const listCommandObj = new ListCommand();
listCommandObj.lis();
const arg = hideBin(process.argv);
const cli = yargs(arg);
const argv = process.argv.slice(2);
console.log("filename", __filename);
const context = {
  emmaVersion: pkg.version,
};
cli
  .usage("Usage:emma-cli-develop <command> [options]")
  .demandCommand(
    1,
    "A command is required. Pass --help to see all available commands and options."
  )
  .alias("h", "help")
  .alias("v", "version")
  .epilogue("Your own footer description")
  .strict()
  .command(
    "init [name]",
    "Do init a project",
    (yargs) => {
      yargs.option("name", { type: "string", describe: "Name of a project" });
    },
    (argv) => {
      console.log("argv", argv);
    }
  )
  .parse(argv, context);
console.log("hello, emma-cli-develop!!!!!!");
