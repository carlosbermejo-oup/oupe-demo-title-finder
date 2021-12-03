import axios from "axios";

export const isAlfrescoUp = async () => {
  try {
    //   TODO: parameterize URL
    const response = await axios.get(
      "https://api.oxfordpremium.oupe.es/check/alfresco"
    );
    return response.status === 200 ? true : false;
  } catch (e) {
    throw new Error(e);
  }
};
