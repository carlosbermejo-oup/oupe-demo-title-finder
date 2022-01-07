import { verifyExcelFile } from "./createExcelDocument";
import fs from "../../utils/fsExtra.cjs";
import path from "path";
import dirname from "../../utils/dirname.cjs";

let mockExistsSync;

describe("createExcelDocument - Basic unit tests", () => {
  describe("verifyExcelFile - Basic unit tests", () => {
    beforeAll(() => {
      mockExistsSync = jest.spyOn(fs, "existsSync");
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
    });

    afterAll(() => {
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
    });

    it("should look for the default Excel file if no argument is provided", () => {
      verifyExcelFile();
      expect(mockExistsSync).toHaveBeenCalledWith(
        path.resolve(dirname, "../output/title-detail-automated.xlsx")
      );
    });

    it("should return true if Excel file has already been created", () => {
      fs.createFileSync(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );
      const actual = verifyExcelFile("title-detail-tests.xlsx");
      expect(mockExistsSync).toHaveBeenCalled();
      expect(actual).toBeTruthy();
    });

    it("should return false if Excel file does not exist", () => {
      const actual = verifyExcelFile("title-detail-non-existant.xlsx");
      expect(mockExistsSync).toHaveBeenCalled();
      expect(actual).not.toBeTruthy();
    });
  });
});
