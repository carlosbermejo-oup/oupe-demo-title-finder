import { createExcelWorkbook } from "./src/infoFormatter/createExcelDocument.js";
import {
  retrieveAdoptedTitles,
  retrieveDemoProducts,
} from "./src/infoRetriever/retrieveMySQLInfo.js";
import { setAppEnvironment } from "./src/setup/setAppEnvironment.js";

setAppEnvironment().then(async (appSettings) => {
  const demoProducts = await retrieveDemoProducts(appSettings);
  const adoptedtitles = await retrieveAdoptedTitles(appSettings);
  createExcelWorkbook(demoProducts, adoptedtitles);
});
