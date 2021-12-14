import { isAlfrescoUp, verifyAlfrescoConnectivity } from "./verifyConnection";
import axios from "axios";

jest.mock("axios");

const environmentSettings = {
  settings: {
    urls: {
      alfresco_url: "http://82.223.131.223:8080",
      premium_url: "https://api.oxfordpremium.dev.oupe.es",
    },
  },
};

const allEnvironmentSettings = {
  settings: {
    development: {
      urls: {
        alfresco_url: "http://82.223.131.223:8080",
        premium_url: "https://api.oxfordpremium.dev.oupe.es",
      },
    },
    preproduction: {
      urls: {
        alfresco_url: "http://82.223.252.223:8080",
        premium_url: "https://api.oxfordpremium.prepro2.oupe.es",
      },
    },
    production: {
      urls: {
        alfresco_url: "http://82.223.51.220:6081",
        premium_url: "https://api.oxfordpremium.oupe.es",
      },
    },
  },
};

describe("verifyConnection", () => {
  describe("isAlfrescoUp - Basic unit tests", () => {
    beforeAll(() => {
      process.env.NODE_CONFIG_ENV = "dev";
    });

    afterAll(() => {
      jest.unmock("axios");
    });

    it("should return true if the Alfresco instance is up", async () => {
      axios.get.mockResolvedValue({
        status: 200,
      });

      const actual = await isAlfrescoUp(environmentSettings);
      expect(actual).toBe(true);
    });

    it("should return false if the Alfresco instance is down", async () => {
      axios.get.mockResolvedValue({
        status: 404,
      });

      const actual = await isAlfrescoUp(environmentSettings);
      expect(actual).toBe(false);
    });

    it("should throw an error if the Alfresco health check cannot be performed", async () => {
      axios.get.mockImplementation(() => {
        throw new Error("getaddrinfo ENOTFOUND api.oxfordpremium.fake.oupe.es");
      });

      await expect(isAlfrescoUp(environmentSettings)).rejects.toThrow(Error);
      await expect(isAlfrescoUp(environmentSettings)).rejects.toThrow(
        "getaddrinfo ENOTFOUND api.oxfordpremium.fake.oupe.es"
      );
    });

    it("should make the call to the correct Alfresco endpoint depending on the chosen environment", async () => {
      axios.get.mockResolvedValue({
        status: 200,
      });

      await isAlfrescoUp(environmentSettings);
      expect(axios.get).toHaveBeenCalledWith(
        "https://api.oxfordpremium.dev.oupe.es/check/alfresco"
      );
    });

    it("should verify the status of all Alfresco endpoints if all environments are chosen", async () => {
      process.env.NODE_CONFIG_ENV = "all";
      axios.get.mockResolvedValue({
        status: 200,
      });

      const actual = await isAlfrescoUp(allEnvironmentSettings);
      expect(actual).toBe(true);
    });

    it("should return false if any of the endpoints are down", async () => {
      process.env.NODE_CONFIG_ENV = "all";
      axios.get.mockResolvedValueOnce({
        status: 401,
      });
      axios.get.mockResolvedValueOnce({
        status: 200,
      });
      axios.get.mockResolvedValueOnce({
        status: 401,
      });

      const actual = await isAlfrescoUp(allEnvironmentSettings);
      expect(actual).toBe(false);
    });
  });

  describe("verifyAlfrescoConnectivity - Basic unit tests", () => {
    beforeAll(() => {
      process.env.NODE_CONFIG_ENV = "dev";
    });

    afterAll(() => {
      jest.unmock("axios");
    });

    it("should return true if API call can be made to Alfresco if the correct credentials are used", async () => {
      axios.get.mockResolvedValue({
        status: 200,
      });

      global.alfresco_username = "user";
      global.alfresco_password = "test";

      const actual = await verifyAlfrescoConnectivity(environmentSettings);
      expect(actual).toBe(true);
      expect(axios.get).toHaveBeenCalledWith(
        "http://82.223.131.223:8080/alfresco/service/touch",
        {
          auth: { username: "user", password: "test" },
        }
      );
    });

    it("should return false if wrong credentials are used", async () => {
      axios.get.mockResolvedValue({
        status: 401,
      });

      global.alfresco_username = "fake";
      global.alfresco_password = "wrong";

      const actual = await verifyAlfrescoConnectivity(environmentSettings);
      expect(actual).toBe(false);
      expect(axios.get).toHaveBeenCalledWith(
        "http://82.223.131.223:8080/alfresco/service/touch",
        {
          auth: { username: "fake", password: "wrong" },
        }
      );
    });

    it("should throw an error if the Alfresco webscript cannot be used", async () => {
      axios.get.mockImplementation(() => {
        throw new Error("getaddrinfo ENOTFOUND XX.XXX.XXX.XX:1337");
      });

      await expect(
        verifyAlfrescoConnectivity(environmentSettings)
      ).rejects.toThrow(Error);
      await expect(
        verifyAlfrescoConnectivity(environmentSettings)
      ).rejects.toThrow("getaddrinfo ENOTFOUND XX.XXX.XXX.XX:1337");
    });

    it("should return true if API call can be made to all Alfresco environments", async () => {
      process.env.NODE_CONFIG_ENV = "all";
      axios.get.mockResolvedValue({
        status: 200,
      });

      const actual = await verifyAlfrescoConnectivity(allEnvironmentSettings);
      expect(actual).toBe(true);
    });

    it("should return false if any API call returns an unexpected response code", async () => {
      process.env.NODE_CONFIG_ENV = "all";
      axios.get.mockResolvedValueOnce({
        status: 401,
      });
      axios.get.mockResolvedValueOnce({
        status: 200,
      });
      axios.get.mockResolvedValueOnce({
        status: 401,
      });

      const actual = await verifyAlfrescoConnectivity(allEnvironmentSettings);
      expect(actual).toBe(false);
    });
  });
});
