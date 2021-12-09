import { manageArgumentVariables } from "./manageArgumentVariables.js";
import {
  setAppEnvironment,
  readEnvironmentFiles,
} from "./setAppEnvironment.js";

jest.mock("./manageArgumentVariables");

describe("setAppEnvironment", () => {
  beforeEach(() => {
    process.env.NODE_CONFIG_ENV = undefined;
    delete global.ENV_SETTINGS;
  });

  afterAll(() => {
    jest.unmock("./manageArgumentVariables");
    delete process.env.NODE_CONFIG_ENV;
  });

  describe("setAppEnvironment - Basic tests", () => {
    it("should set NODE_CONFIG_ENV to development when setting --env to dev.", () => {
      manageArgumentVariables.mockReturnValue({ env: "dev" });
      const expected = "development";
      setAppEnvironment();
      expect(process.env.NODE_CONFIG_ENV).toBe(expected);
    });

    it("should set NODE_CONFIG_ENV to preproduction when setting --env to prepro.", () => {
      manageArgumentVariables.mockReturnValue({ env: "pre" });
      const expected = "preproduction";
      setAppEnvironment();
      expect(process.env.NODE_CONFIG_ENV).toBe(expected);
    });

    it("should set NODE_CONFIG_ENV to production when setting --env to pro.", () => {
      manageArgumentVariables.mockReturnValue({ env: "pro" });
      const expected = "production";
      setAppEnvironment();
      expect(process.env.NODE_CONFIG_ENV).toBe(expected);
    });

    it("should throw an error if the environment set using the flag is invalid.", () => {
      manageArgumentVariables.mockReturnValue({ env: "test" });
      expect(() => setAppEnvironment()).toThrow("Incorrect environment test, please make sure that you entered a valid env name.");
    });
  });

  describe("readEnvironmentFiles - Basic tests", () => {
    it("should read the correct file for the environment provided", () => {
      process.env.NODE_CONFIG_ENV = "development";

      const expected = {
        settings: {
          urls: {
            alfresco_url: "http://82.223.131.223:8080",
            premium_url: "https://api.oxfordpremium.dev.oupe.es/check/alfresco",
          },
        },
      };
      readEnvironmentFiles();
      expect(global.ENV_SETTINGS).toEqual(expected);
    });

    it("should throw an error if the environment provided is incorrect.", () => {
        process.env.NODE_CONFIG_ENV = "test";
        expect(() => readEnvironmentFiles()).toThrow(Error);
    })
  });
});
