"use strict";

module.exports = core;
const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const rootCheck = require("root-check");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;
const minimist = require("minimist");

const log = require("@emma-cli-develop/log");
const pkg = require("../package.json");
const constant = require("./const");

let args, config;

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
  } catch (e) {
    log.error(e.message);
  }
}
function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  console.log(dotenvPath);
  if (pathExists(dotenvPath)) {
    config = dotenv.config({
      path: dotenvPath,
    });
  }

  log.verbose("环境变量", config);
}

function checkInputArgs() {
  args = minimist(process.argv.slice(2));
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}

function checkRoot() {
  rootCheck();
}

function checkNodeVersion() {
  // 1.获取当前node版本号
  const currentVersion = process.version;
  // 2.比对最低版本号
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`emma-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
    );
  }
}

function checkPkgVersion() {
  log.notice("cli", pkg.version);
}
