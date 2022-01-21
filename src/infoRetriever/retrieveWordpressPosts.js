import axios from "axios";

export const retrieveWordpressPosts = async () => {
  try {
    const result = await axios.get("https://help.oupe.es/wp-json/wp/v2/posts");
    return result.status == 200 ? result.data : undefined;
  } catch (err) {
    throw new Error(
      `Found an error when trying to retrieve Wordpress posts: ${err}`
    );
  }
};
