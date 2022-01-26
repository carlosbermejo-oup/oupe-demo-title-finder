import axios from "axios";
const wpApiBaseUrl = "https://help.oupe.es/wp-json/wp/v2/posts";

/* istanbul ignore next */
export const retrieveWordpressPosts = async () => {
  let pageNumberIsExceeded = false;
  let pageNumber = 1;
  let resultingArray = [];

  while (!pageNumberIsExceeded) {
    try {
      let result = await axios.get(
        `${wpApiBaseUrl}?page=${pageNumber}&per_page=100`
      );
      if (result.status === 200) {
        result.data.forEach((post) => {
          if (post?.excerpt?.rendered.includes("AD:")) {
            resultingArray.push(post);
          }
        });
        pageNumber++;
      }
    } catch (e) {
      if (
        e.response.status === 400 &&
        e.response.data.code === "rest_post_invalid_page_number"
      ) {
        pageNumberIsExceeded = true;
      } else {
        throw new Error(
          `Found an error when trying to retrieve Wordpress posts. ${e.response.data}`
        );
      }
    }
  }

  return resultingArray;
};
