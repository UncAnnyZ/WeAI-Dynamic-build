#!/usr/bin/env node

import chalk from "chalk";
import fs from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const inputArray = process.argv.splice(2);

const runType = inputArray[0];

const canUseType = ["build", "watch"];

const folderPath = "./.weDynamic";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

if (canUseType.includes(runType)) {
  const pwd = execSync(`pwd`, { encoding: "utf8" });
  const path = pwd.toString().trim();
  if (runType === "build") {
    const log = execSync(`webpack --env srcPath=${path} status=release`, {
      cwd: __dirname,
      encoding: "utf8",
    });
  } else if (runType === "watch") {
    const log = execSync(
      `webpack --env srcPath=${path} status=test && node ./build/mpRun.js ${path} ${__dirname}`,
      {
        cwd: __dirname,
        encoding: "utf8",
      }
    );
    console.log(log.toString());
  } else if (runType === "release") {
    const log = execSync(
      `webpack --env srcPath=${path} status=release && node ./build/mpRelease.js  ${path} ${__dirname}`,
      {
        cwd: __dirname,
        encoding: "utf8",
      }
    );
    console.log(log.toString());
  }
} else {
  console.error(
    chalk.red(
      "No type! please input type, type have build or watch. For instance: wedev build"
    )
  );
}
