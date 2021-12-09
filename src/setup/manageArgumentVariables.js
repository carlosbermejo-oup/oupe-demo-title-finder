import { program } from "commander";

export const manageArgumentVariables = () => {
  program
    .option(
      "-e, --env <env>",
      'Environment from which to retrieve the Alfresco informatiion. By default it\'s set to "dev".',
      "dev"
    )
    .option(
      "--cli",
      "Configure the Title Finder using a command line interface instead of manually entering arguments"
    )
    .option("-u, --user, --username <username>", "Alfresco username.")
    .option("-p, --pass, --password <password>", "Alfresco password.")
    .parse();

  program.on("--help", () => {
    console.log(
      "For more information on how to use this program, please visit https://github.com/OUP2/oupe-demo-title-finder#readme"
    );
  });

  return program.opts();
};
