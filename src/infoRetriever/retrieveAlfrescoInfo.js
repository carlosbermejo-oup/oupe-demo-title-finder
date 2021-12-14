import axios from "axios";
import {
  isAlfrescoUp,
  verifyAlfrescoConnectivity,
} from "./verifyConnection.js";

export const retrieveAlfrescoInfo = async (environmentSettings) => {
  try {
    if (
      (await isAlfrescoUp(environmentSettings)) &&
      (await verifyAlfrescoConnectivity(environmentSettings)) &&
      process.env.NODE_CONFIG_ENV !== "all"
    ) {
      const response = await axios.get(
        `${environmentSettings.settings.urls.alfresco_url}/alfresco/service/oupe/obtenerDatosRecursosDemoPorTitulo`,
        {
          auth: {
            username: global.alfresco_username,
            password: global.alfresco_password,
          },
        }
      );

      return response.status === 200 ? response.data : false;
    } else if (
      (await isAlfrescoUp(environmentSettings)) &&
      (await verifyAlfrescoConnectivity(environmentSettings)) &&
      process.env.NODE_CONFIG_ENV === "all"
    ) {
      let resultObject = {};
      for (let envName in environmentSettings.settings) {
        const response = await axios.get(
          `${environmentSettings.settings[envName].urls.alfresco_url}/alfresco/service/oupe/obtenerDatosRecursosDemoPorTitulo`,
          {
            auth: {
              username: global.alfresco_username,
              password: global.alfresco_password,
            },
          }
        );
        resultObject[envName] =
          response.status === 200 ? response.data : "Could not retrieve";
      }
      return resultObject;
    } else {
      throw new Error("Connection to Alfresco could not be verified.");
    }
  } catch (e) {
    throw new Error(`Error retrieving Alfresco information. ${e}`);
  }
};
