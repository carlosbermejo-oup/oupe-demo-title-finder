import { retrieveAlfrescoInfo } from "./src/infoRetriever/retrieveAlfrescoInfo.js";
import { setAppEnvironment } from "./src/setup/setAppEnvironment.js";

setAppEnvironment().then((result) => {
  retrieveAlfrescoInfo(result).then((result) => {
    console.log(result);
  });
});
