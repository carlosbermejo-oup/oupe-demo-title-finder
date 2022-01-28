import { manageArgumentVariables } from "./manageArgumentVariables.js";
import {
  setAppEnvironment,
  readEnvironmentFiles,
  setConfigEnvironmentVariable,
} from "./setAppEnvironment.js";
import { setupConfigurationCli } from "./setupConfigurationCli.js";

jest.mock("./manageArgumentVariables");
jest.mock("./setupConfigurationCli");

describe("setAppEnvironment - Basic tests", () => {
  beforeEach(() => {
    process.env.NODE_CONFIG_ENV = undefined;
    delete global.ENV_SETTINGS;
  });

  afterAll(() => {
    jest.unmock("./manageArgumentVariables");
    jest.unmock("./setupConfigurationCli");
    jest.resetAllMocks();
    delete process.env.NODE_CONFIG_ENV;
  });

  it("should call the asynchronous function correctly.", () => {
    manageArgumentVariables.mockReturnValue({ env: "dev" });
    setAppEnvironment().then(
      () => {
        expect(setupConfigurationCli).toHaveBeenCalled();
      },
      () => null
    );
  });

  describe("setConfigEnvironmentVariable - Basic tests", () => {
    it("should set NODE_CONFIG_ENV to development when setting --env to dev.", () => {
      const expected = "development";
      setConfigEnvironmentVariable("dev");
      expect(process.env.NODE_CONFIG_ENV).toBe(expected);
    });

    it("should set NODE_CONFIG_ENV to preproduction when setting --env to prepro.", () => {
      const expected = "preproduction";
      setConfigEnvironmentVariable("pre");
      expect(process.env.NODE_CONFIG_ENV).toBe(expected);
    });

    it("should set NODE_CONFIG_ENV to production when setting --env to pro.", () => {
      const expected = "production";
      setConfigEnvironmentVariable("pro");
      expect(process.env.NODE_CONFIG_ENV).toBe(expected);
    });

    it("should throw an error if the environment set using the flag is invalid.", () => {
      expect(() => setConfigEnvironmentVariable("test")).toThrow(
        "Incorrect environment test, please make sure that you entered a valid env name."
      );
    });
  });

  describe("readEnvironmentFiles - Basic tests", () => {
    it("should read the correct file for the environment provided", () => {
      process.env.NODE_CONFIG_ENV = "development";

      const expected = {
        settings: {
          urls: {
            mysql_host: "192.168.30.92",
            premium_url: "https://api.oxfordpremium.dev.oupe.es",
          },
          categories: {
            promo_home: 656,
          },
        },
      };
      readEnvironmentFiles();
      expect(global.ENV_SETTINGS).toEqual(expected);
    });

    it("should throw an error if the environment provided is incorrect.", () => {
      process.env.NODE_CONFIG_ENV = "test";
      expect(() => readEnvironmentFiles()).toThrow(Error);
    });
  });
});
