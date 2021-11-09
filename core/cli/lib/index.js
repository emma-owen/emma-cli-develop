"use strict";

module.exports = core;
const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const rootCheck = require("root-check");
const { homedir } = require("os");
const pathExists = require("path-exists").sync;
const minimist = require("minimist");

const log = require("@emma-cli-develop/log");
const pkg = require("../package.json");
const constant = require("./const");

const userHome = homedir();
let args, config;

async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    checkEnv();
    await checkGlobalUpdate();
  } catch (e) {
    log.error(e.message);
  }
}

async function checkGlobalUpdate() {
  // 获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 调用npm API，获取所有版本号
  // 提取所有版本号，比对哪些版本号大于当前版本号
  // 获取最新的版本号，提示用户更新到该版本
  const { getNpmSemverVersion } = require("@emma-cli-develop/get-npm-info");
  const latestVersion = await getNpmSemverVersion(currentVersion, npmName);
  if (latestVersion && semver.gt(latestVersion, currentVersion)) {
    log.warn(
      "更新提示",
      colors.yellow(
        `请手动更新 ${npmName},当前版本：${currentVersion},最新版本：${latestVersion}
        更新命令：npm install -g ${npmName}`
      )
    );
  }
}

function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  // 从 .env 文件中加载配置到 process.env 中
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  config = createDefaultConfig();
  log.verbose("环境变量缓存文件路径", process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };

  if (process.env.CLI_HOME) {
    cliConfig.cliHomePath = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig.cliHomePath = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHomePath;
  return cliConfig;
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
  log.level = process.env.LOG_LEVEL; // 由于log在上面require的时候已经初始化过了，当时env.LOG_LEVEL还没有生效，所以需要重新设置log level
}

function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}

function checkRoot() {
  rootCheck(); // 避免权限问题。如果是root,则尝试降低权限，核心就是使用了process.setgid 和 process.setuid
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
