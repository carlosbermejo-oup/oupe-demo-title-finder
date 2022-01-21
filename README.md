# OUPE Demo Title Finder

- [OUPE Demo Title Finder](#oupe-demo-title-finder)
  - [Usage](#usage)
    - [CLI Guided Execution](#cli-guided-execution)
    - [Manual parameters](#manual-parameters)
  - [GitHub Actions CI](#github-actions-ci)
  - [Unit tests](#unit-tests)
  - [License](#license)

An automation utility created to generate Excel files containing information about the demo titles available in MySQL for all environments in OUPE. It allows the user to keep an up-to-date registry of which titles can be used to test Phase 2 of the Promotion to users functionality of [Oxford Premium](https://oxfordpremium.oupe.es/) — both in manual and automated tests.

## Usage

There are two ways to launch the application: using a built-in CLI or providing the arguments directly.
Before any of that, Node packages need to be installed by executing the following command:

```
yarn install
```

After the process finishes, which how you want to execute the program, either by providing the necessary settings when being prompted by the application itself or by using flags and arguments.

Please, bear in mind that this application queries MySQL to retrieve the information, so certain **pre-requirements** are necessary (for instance: working MySQL credentials and VPN connection).

The output from the application is written to an Excel file located at <root>/output/title-detail-automated.xlsx.


### CLI Guided Execution

To have the application guide you in configuring the settings, execute the following command:

```
yarn start:cli
```
  
The application will ask you questions about the environment from which to recover the information and the database credentials.

To avoid having to enter the MySQL username and password, you can create a .env file with the following content:

```
# Development
MYSQL_USER_DEVELOPMENT=<username>
MYSQL_PASSWORD_DEVELOPMENT=<password>

# Preproduction
MYSQL_USER_PREPRODUCTION=<username>
MYSQL_PASSWORD_PREPRODUCTION=<password>

# Production
MYSQL_USER_PRODUCTION=<username>
MYSQL_PASSWORD_PRODUCTION=<password>
```

When the CLI requests MySQL credentials, press the return key without entering any value and the system will default to using the credentials in the .env file.

### Manual parameters

The alternative is to provide the parameters manually on execution. The command will follow this format.

```
yarn start --env <env> --user <MySQL Username> --pass <MySQL Password> --email <>
```

* **--env**: the environment from which to retrieve the information. Possible values are **dev**, **pre** and **pro**. Can also be used as *-e*
* **--user**: the MySQL username. Can also be used as *-u* or *--username*.
* **--pass**: the MySQL password. Can also be used as *-p* or *--password*.
* **--email**: the email address for the Oxford Premium user from which the adopted titles will be retrieved.

## GitHub Actions CI

This project includes a basic CI implementation using GitHub Actions that runs the tests on PRs and pushes to feature branches. For more information, visit [the corresponding section in the repository](https://github.com/carlosbermejo-oup/oupe-demo-title-finder/actions).

## Unit tests

This project contains unit tests created using Jest and run on push and merge. They can be executed using the following command:

```
yarn test
```

The project is configured so that at least 80% of the branches, functions, lines and statements are covered by unit tests or the execution will fail.

## License

Licenced under [MIT License](./LICENSE) © 2021 Oxford University Press España - Carlos Bermejo Pérez
