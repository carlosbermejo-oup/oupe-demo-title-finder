import { isMySQLUp } from "./verifyConnection";
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

describe("verifyConnection", () => {
  describe("isMySQLUp - Basic unit tests", () => {
    beforeAll(() => {
      process.env.NODE_CONFIG_ENV = "dev";
    });

    afterAll(() => {
      jest.unmock("axios");
    });

    it("should return true if the MySQL instance is up", async () => {
      axios.get.mockResolvedValue({
        status: 200,
      });

      const actual = await isMySQLUp(environmentSettings);
      expect(actual).toBe(true);
    });

    it("should return false if the MySQL instance is down", async () => {
      axios.get.mockResolvedValue({
        status: 404,
      });

      const actual = await isMySQLUp(environmentSettings);
      expect(actual).toBe(false);
    });

    it("should throw an error if the MySQL health check cannot be performed", async () => {
      axios.get.mockImplementation(() => {
        throw new Error("getaddrinfo ENOTFOUND api.oxfordpremium.fake.oupe.es");
      });

      await expect(isMySQLUp(environmentSettings)).rejects.toThrow(Error);
      await expect(isMySQLUp(environmentSettings)).rejects.toThrow(
        "getaddrinfo ENOTFOUND api.oxfordpremium.fake.oupe.es"
      );
    });

    it("should make the call to the correct MySQL endpoint depending on the chosen environment", async () => {
      axios.get.mockResolvedValue({
        status: 200,
      });

      await isMySQLUp(environmentSettings);
      expect(axios.get).toHaveBeenCalledWith(
        "https://api.oxfordpremium.dev.oupe.es/check/mysql"
      );
    });

    it("should return false if any of the endpoints are down", async () => {
      process.env.NODE_CONFIG_ENV = "development";
      axios.get.mockResolvedValueOnce({
        status: 401,
      });

      const actual = await isMySQLUp(environmentSettings);
      expect(actual).toBe(false);
    });
  });
});
