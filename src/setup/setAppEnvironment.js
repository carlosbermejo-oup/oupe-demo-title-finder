import { manageArgumentVariables } from "./manageArgumentVariables.js";
import path from "path";
import fs from "fs";
import dirname from "./dirname.cjs";

export const setAppEnvironment = () => {
  const appEnvironment = manageArgumentVariables();
  switch (appEnvironment.env) {
    case "dev":
    case "development":
      process.env.NODE_CONFIG_ENV = "development";
      readEnvironmentFiles();
      break;
    case "pre":
    case "prepro":
    case "preproduction":
      process.env.NODE_CONFIG_ENV = "preproduction";
      readEnvironmentFiles();
      break;
    case "pro":
    case "prod":
    case "production":
      process.env.NODE_CONFIG_ENV = "production";
      readEnvironmentFiles();
      break;
    default:
      throw new Error(
        `Incorrect environment ${appEnvironment?.env}, please make sure that you entered a valid env name.`
      );
  }
};

export const readEnvironmentFiles = () => {
  try {
    const configParsed = JSON.parse(
      fs.readFileSync(
        path.resolve(
          dirname,
          `../../config/${process.env.NODE_CONFIG_ENV}.json`
        )
      )
    );
    global.ENV_SETTINGS = configParsed;
  } catch (e) {
    throw new Error(e);
  }
};
