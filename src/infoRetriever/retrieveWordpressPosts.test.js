import { retrieveWordpressPosts } from "./retrieveWordpressPosts.js";
import axios from "axios";

jest.mock("axios");

const mockWordpressPost = {
  status: 200,
  data: {
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
};

describe("retrieveWordpressPosts - Basic unit tests", () => {
  afterAll(() => {
    jest.unmock("axios");
    jest.resetAllMocks();
  });

  it("should return a JSON containing the posts in Wordpress", async () => {
    axios.get.mockResolvedValueOnce(mockWordpressPost);

    const actual = await retrieveWordpressPosts();
    expect(actual).toStrictEqual(mockWordpressPost.data);
  });

  it("should return undefined if the status code in the response from Wordpress is not 200", async () => {
    axios.get.mockResolvedValueOnce({
      status: 401,
      data: { message: "Content could not be found" },
    });

    const actual = await retrieveWordpressPosts();
    expect(actual).toBe(undefined);
  });

  it("should throw an error if the request cannot be performed", async () => {
    axios.get.mockImplementationOnce(() => {
      throw new Error("Test failure");
    });

    await expect(retrieveWordpressPosts()).rejects.toThrow(
      "Found an error when trying to retrieve Wordpress posts: Error: Test failure"
    );
  });
});
