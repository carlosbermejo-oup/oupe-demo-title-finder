import * as retrieveMySQLInfo from "./retrieveMySQLInfo";
import * as verifyConnection from "./verifyConnection";

jest.mock("./verifyConnection");

const mockQuery = jest.fn();

jest.mock("mysql2/promise", () => ({
  createConnection: () => ({
    connect: () => undefined,
    query: mockQuery,
    end: () => undefined,
  }),
}));

describe("retrieveMySQLInfo - Basic unit tests", () => {
  describe("retrieveDemoProducts - Basic unit tests", () => {
    let mockRetrieveDemoProducts;

    beforeAll(() => {
      mockRetrieveDemoProducts = jest.spyOn(
        retrieveMySQLInfo,
        "retrieveDemoProducts"
      );
    });

    it("should try to retrieve MySQL info only if connection to MySQL is correct", async () => {
      verifyConnection.isMySQLUp.mockReturnValueOnce(true);
      mockQuery.mockImplementationOnce(async (query) => [
        [
          {
            idPais: 1,
            d_pais: "ESPAÑA",
            idTitulo: 1,
            nombre: "Test Product 1",
          },
          {
            idPais: 1,
            d_pais: "ESPAÑA",
            idTitulo: 2,
            nombre: "Test Product 2",
          },
        ],
      ]);

      const expected = [
        { isDemo: "Sí", simId: 1, titleName: "Test Product 1" },
        { isDemo: "Sí", simId: 2, titleName: "Test Product 2" },
      ];
      const actual = await retrieveMySQLInfo.retrieveDemoProducts({
        settings: { urls: { mysql_host: "", premium_url: "" } },
      });
      expect(actual).toStrictEqual(expected);
    });

    it("should throw an error if the MySQL DB is down", async () => {
      verifyConnection.isMySQLUp.mockReturnValueOnce(false);

      await expect(
        retrieveMySQLInfo.retrieveDemoProducts({
          settings: { urls: { mysql_host: "", premium_url: "" } },
        })
      ).rejects.toThrow(
        "MySQL is down according to the API, query cannot be performed."
      );
    });

    it("should throw an error if query fails", async () => {
      verifyConnection.isMySQLUp.mockReturnValueOnce(true);

      mockQuery.mockImplementationOnce(async (query) => {
        throw new Error("Test error");
      });

      await expect(
        retrieveMySQLInfo.retrieveDemoProducts({
          settings: { urls: { mysql_host: "", premium_url: "" } },
        })
      ).rejects.toThrow("Error trying to query the DB: Error: Test error");
    });
  });
});
