import { withMySQLConnection } from "./databaseConnection";
import mysql from "mysql2/promise";

jest.mock("mysql2/promise", () => ({
  createConnection: jest.fn().mockImplementation(function () {
    this.connect = jest.fn(() => null);
    this.end = jest.fn(() => null);

    return {
      connect: this.connect,
      end: this.end,
    };
  }),
}));

const mockFunction = jest.fn();

describe("databaseConnection - Basic Unit tests", () => {
  describe("withMySQLConnection - Basic Unit tests", () => {
    afterAll(() => {
      delete process.env.NODE_CONFIG_ENV;
      delete global.mysql_username;
      delete global.mysql_password;
    });

    it("should verify that the connection is created using the correct parameters for the development environment", async () => {
      process.env.NODE_CONFIG_ENV = "development";
      global.mysql_username = "user";
      global.mysql_password = "test";

      await withMySQLConnection(
        {
          settings: { urls: { mysql_host: "" } },
        },
        mockFunction
      );

      expect(mysql.createConnection).toHaveBeenCalledWith({
        host: "",
        user: "user",
        password: "test",
        database: "oupesimdev",
      });
    });

    it("should verify that the connection is created using the correct parameters for the production environment", async () => {
      process.env.NODE_CONFIG_ENV = "production";
      global.mysql_username = "user";
      global.mysql_password = "test";

      await withMySQLConnection(
        {
          settings: { urls: { mysql_host: "" } },
        },
        mockFunction
      );

      expect(mysql.createConnection).toHaveBeenCalledWith({
        host: "",
        user: "user",
        password: "test",
        database: "oupesim",
      });
    });

    it("should verify that the connection is created, the function called and finally the connection is closed", async () => {
      await withMySQLConnection(
        {
          settings: { urls: { mysql_host: "" } },
        },
        mockFunction
      );

      expect(
        mysql.createConnection.mock.instances[0].connect
      ).toHaveBeenCalled();
      expect(mockFunction).toHaveBeenCalled();
      expect(mysql.createConnection.mock.instances[0].end).toHaveBeenCalled();
    });
  });
});
