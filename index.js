import { createExcelWorkbook } from "./src/infoFormatter/createExcelDocument.js";
import { retrieveDemoProducts } from "./src/infoRetriever/retrieveMySQLInfo.js";
import { setAppEnvironment } from "./src/setup/setAppEnvironment.js";

setAppEnvironment().then((appSettings) => {
  retrieveDemoProducts(appSettings).then((demoProducts) => {
    createExcelWorkbook(demoProducts);
  });
});
