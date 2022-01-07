import { setupConfigurationCli } from "./setupConfigurationCli.js";
import inquirer from "inquirer";

let mockInquirer;

describe("setupConfigurationCli - Basic tests", () => {
  beforeAll(() => {
    mockInquirer = jest.spyOn(inquirer, "prompt").mockImplementation(() =>
      Promise.resolve({
        environmentName: "Development",
        username: "user",
        password: "test",
      })
    );
  });

  beforeEach(() => {
    delete global.environment;
    delete global.mysql_username;
    delete global.mysql_password;
  });

  afterAll(() => {
    jest.restoreAllMocks();
    delete process.env.MYSQL_USER_DEVELOPMENT;
    delete process.env.MYSQL_PASSWORD_DEVELOPMENT;
  });

  it("should call inquirer if the app environment variable is true", async () => {
    const appEnvironment = { cli: true };
    await setupConfigurationCli(appEnvironment);
    expect(mockInquirer).toHaveBeenCalled();
  });

  it("should not call inquirer if the app environment variable is undefined", async () => {
    const appEnvironment = { env: "dev" };
    await setupConfigurationCli(appEnvironment);
    expect(mockInquirer).not.toHaveBeenCalled();
  });

  it("should call inquirer if the app environment variable is false", async () => {
    const appEnvironment = { cli: false };
    await setupConfigurationCli(appEnvironment);
    expect(mockInquirer).not.toHaveBeenCalled();
  });

  it("should try to set the global settings correctly.", async () => {
    const appEnvironment = { cli: true };
    await setupConfigurationCli(appEnvironment);
    expect(global.environment).toBe("development");
    expect(global.mysql_username).toBe("user");
    expect(global.mysql_password).toBe("test");
  });

  it("should use the default username and password if no data is provided to the CLI", async () => {
    mockInquirer.mockImplementation(() =>
      Promise.resolve({
        environmentName: "Development",
        username: "",
        password: "",
      })
    );

    process.env.MYSQL_USER_DEVELOPMENT = "user";
    process.env.MYSQL_PASSWORD_DEVELOPMENT = "test";
    const appEnvironment = { cli: true };
    await setupConfigurationCli(appEnvironment);
    expect(global.environment).toBe("development");
    expect(global.mysql_username).toBe("user");
    expect(global.mysql_password).toBe("test");
  });

  it("should handle an error thrown by inquirer when getting the environment variables.", async () => {
    const appEnvironment = { cli: true };
    mockInquirer.mockImplementation(() => {
      throw new Error("Test error");
    });
    await expect(setupConfigurationCli(appEnvironment)).rejects.toThrow(Error);
  });
});
