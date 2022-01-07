import fs from "../../utils/fsExtra.cjs";
import path from "path";
import dirname from "../../utils/dirname.cjs";

export const verifyExcelFile = (fileName = "title-detail-automated.xlsx") => {
  return fs.existsSync(path.resolve(dirname, `../output/${fileName}`));
};
