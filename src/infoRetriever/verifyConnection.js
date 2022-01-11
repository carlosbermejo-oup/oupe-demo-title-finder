import axios from "axios";

export const isMySQLUp = async (environmentSettings) => {
  try {
    const response = await axios.get(
      `${environmentSettings.settings.urls.premium_url}/check/mysql`
    );
    return response.status === 200 ? true : false;
  } catch (e) {
    throw new Error(`Error verifying MySQL status. ${e}`);
  }
};
