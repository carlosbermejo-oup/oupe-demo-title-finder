import * as retrieveMySQLInfo from "./retrieveMySQLInfo";
import * as retrieveWordpressPosts from "./retrieveWordpressPosts";
import * as verifyConnection from "./verifyConnection";

jest.mock("./verifyConnection");

const mockQuery = jest.fn();
let mockRetrieveWordpressPosts;

jest.mock("mysql2/promise", () => ({
  createConnection: () => ({
    connect: () => undefined,
    query: mockQuery,
    end: () => undefined,
  }),
}));

const mockWordpressPost = [
  {
    id: 1,
    date: "2022-01-11T13:51:52",
    date_gmt: "2022-01-11T12:51:52",
    guid: {
      rendered: "https://help.oupe.es/?p=1",
    },
    modified: "2022-01-11T13:51:52",
    modified_gmt: "2022-01-11T12:51:52",
    slug: "webinar-mediation-in-english-file",
    status: "publish",
    type: "post",
    link: "https://help.oupe.es/test/",
    title: {
      rendered: "TEST",
    },
    content: {
      rendered: "\n<p>This is a test</p>\n",
      protected: false,
    },
    excerpt: {
      rendered: "<p>This is a test</p>\n",
      protected: false,
    },
    author: 1,
    featured_media: 1,
    comment_status: "closed",
    ping_status: "closed",
    sticky: false,
    template: "",
    format: "standard",
    meta: [],
    categories: [2],
    tags: [1],
    _links: { mock: true },
  },
];

describe("retrieveMySQLInfo - Basic unit tests", () => {
  describe("retrieveDemoProducts - Basic unit tests", () => {
    let mockRetrieveDemoProducts;

    beforeAll(() => {
      mockRetrieveDemoProducts = jest.spyOn(
        retrieveMySQLInfo,
        "retrieveDemoProducts"
      );

      mockRetrieveWordpressPosts = jest.spyOn(
        retrieveWordpressPosts,
        "retrieveWordpressPosts"
      );
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it("should retrieve MySQL info only if connection to MySQL is correct", async () => {
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
        {
          isDemo: "Sí",
          isInLibrary: "No",
          simId: 1,
          titleName: "Test Product 1",
        },
        {
          isDemo: "Sí",
          isInLibrary: "No",
          simId: 2,
          titleName: "Test Product 2",
        },
      ];

      mockRetrieveWordpressPosts.mockResolvedValueOnce(mockWordpressPost);
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
