import { manageArgumentVariables } from "./manageArgumentVariables.js";
import path from "path";
import fse from "../../utils/fsExtra.cjs";
import dirname from "../../utils/dirname.cjs";
import { setupConfigurationCli } from "./setupConfigurationCli.js";

export const setAppEnvironment = async () => {
  const appEnvironment = manageArgumentVariables();
  await setupConfigurationCli(appEnvironment);
  setConfigEnvironmentVariable(global.environment);
};

export const readEnvironmentFiles = () => {
  try {
    const configParsed = fse.readJSONSync(
      path.resolve(dirname, `../config/${process.env.NODE_CONFIG_ENV}.json`)
    );
    console.log(configParsed);
    global.ENV_SETTINGS = configParsed;
  } catch (e) {
    throw new Error(e);
  }
};

export const setConfigEnvironmentVariable = (environmnetName) => {
  switch (environmnetName) {
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
        `Incorrect environment ${environmnetName}, please make sure that you entered a valid env name.`
      );
  }
};
