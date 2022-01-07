import { retrieveDemoProducts } from "./src/infoRetriever/retrieveMySQLInfo.js";
import { setAppEnvironment } from "./src/setup/setAppEnvironment.js";

setAppEnvironment().then((appSettings) => {
  retrieveDemoProducts(appSettings).then((result) => {
    console.log(result);
  });
});
