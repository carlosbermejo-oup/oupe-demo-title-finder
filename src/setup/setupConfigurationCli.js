import inquirer from "../../utils/inquirer.cjs";
import dotenv from "dotenv";

export const setupConfigurationCli = async (appEnvironment) => {
  const questions = [
    {
      type: "list",
      name: "environmentName",
      message: "Which environment do you want to get the information from?",
      choices: ["Development", "Preproduction", "Production"],
      default: "Development",
    },
    {
      type: "input",
      name: "username",
      message: "Enter your MySQL username:",
    },
    {
      type: "password",
      message: "Enter your MySQL password",
      name: "password",
    },
  ];

  dotenv.config();

  if (appEnvironment?.cli) {
    try {
      const answers = await inquirer.prompt(questions);
      global.environment = answers.environmentName.toLowerCase();

      if (answers.username === "") {
        global.mysql_username =
          process.env[`MYSQL_USER_${answers.environmentName.toUpperCase()}`];
      } else {
        global.mysql_username = answers.username;
      }

      if (answers.password === "") {
        global.mysql_password =
          process.env[
            `MYSQL_PASSWORD_${answers.environmentName.toUpperCase()}`
          ];
      } else {
        global.mysql_password = answers.password;
      }
    } catch (error) {
      throw new Error(`Configurator settings could not be set: ${error}`);
    }
  } else {
    global.environment = appEnvironment.env;
    global.mysql_username = appEnvironment.user;
    global.mysql_password = appEnvironment.pass;
  }
};
