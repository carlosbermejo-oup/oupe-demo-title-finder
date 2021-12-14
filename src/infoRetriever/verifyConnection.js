import axios from "axios";

export const isAlfrescoUp = async (environmentSettings) => {
  try {
    if (process.env.NODE_CONFIG_ENV !== "all") {
      const response = await axios.get(
        `${environmentSettings.settings.urls.premium_url}/check/alfresco`
      );
      return response.status === 200 ? true : false;
    } else {
      let resultArray = [];
      for (let envName in environmentSettings.settings) {
        const response = await axios.get(
          `${environmentSettings.settings[envName].urls.premium_url}/check/alfresco`
        );
        resultArray.push(response.status === 200 ? true : false);
      }
      return resultArray.every((element) => element === true);
    }
  } catch (e) {
    throw new Error(`Error verifying Alfresco status. ${e}`);
  }
};

export const verifyAlfrescoConnectivity = async (environmentSettings) => {
  try {
    if (process.env.NODE_CONFIG_ENV !== "all") {
      const response = await axios.get(
        `${environmentSettings.settings.urls.alfresco_url}/alfresco/service/touch`,
        {
          auth: {
            username: global.alfresco_username,
            password: global.alfresco_password,
          },
        }
      );
      return response.status === 200 ? true : false;
    } else {
      let resultArray = [];
      for (let envName in environmentSettings.settings) {
        const response = await axios.get(
          `${environmentSettings.settings[envName].urls.alfresco_url}/alfresco/service/touch`
        );
        resultArray.push(response.status === 200 ? true : false);
      }
      return resultArray.every((element) => element === true);
    }
  } catch (e) {
    throw new Error(`Error verifying Alfresco connectivity. ${e}`);
  }
};
