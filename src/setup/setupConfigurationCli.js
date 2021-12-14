import inquirer from "../../utils/inquirer.cjs";

export const setupConfigurationCli = async (appEnvironment) => {
  const questions = [
    {
      type: "list",
      name: "environmentName",
      message: "Which environment do you want to get the information from?",
      choices: ["Development", "Preproduction", "Production", "All"],
      default: "Development",
    },
    {
      type: "input",
      name: "username",
      message: "Enter your Alfresco username:",
    },
    {
      type: "password",
      message: "Enter your Alfresco password",
      name: "password",
    },
  ];

  if (appEnvironment?.cli) {
    try {
      const answers = await inquirer.prompt(questions);
      global.environment = answers.environmentName.toLowerCase();
      global.alfresco_username = answers.username;
      global.alfresco_password = answers.password;
    } catch (error) {
      throw new Error(`Configurator settings could not be set: ${error}`);
    }
  } else {
    global.environment = appEnvironment.env;
    global.alfresco_username = appEnvironment.user;
    global.alfresco_password = appEnvironment.pass;
  }
};
