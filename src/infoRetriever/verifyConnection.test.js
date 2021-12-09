import { isAlfrescoUp } from "./verifyConnection";
import axios from "axios";

jest.mock("axios");

describe("verifyConnection", () => {
  describe("isAlfrescoUp - Basic unit tests", () => {
    afterAll(() => {
      jest.unmock("axios");
    });

    it("should return true if the Alfresco instance is up", async () => {
      axios.get.mockResolvedValue({
        status: 200,
      });

      const actual = await isAlfrescoUp();
      expect(actual).toBe(true);
    });

    it("should return false if the Alfresco instance is down", async () => {
      axios.get.mockResolvedValue({
        status: 404,
      });

      const actual = await isAlfrescoUp();
      expect(actual).toBe(false);
    });

    it("should throw an error if the Alfresco health check cannot be performed", async () => {
      axios.get.mockImplementation(() => {
        throw new Error("getaddrinfo ENOTFOUND api.oxfordpremium.fake.oupe.es");
      });

      await expect(isAlfrescoUp()).rejects.toThrow(Error);
      await expect(isAlfrescoUp()).rejects.toThrow(
        "getaddrinfo ENOTFOUND api.oxfordpremium.fake.oupe.es"
      );
    });
  });
});
