import * as createExcelDocument from "./createExcelDocument";
import fs from "../../utils/fsExtra.cjs";
import path from "path";
import dirname from "../../utils/dirname.cjs";
import xlsx from "exceljs";

let mockExistsSync;
let mockCreateExcelWorkbook;

describe("createExcelDocument - Basic unit tests", () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("verifyExcelFile - Basic unit tests", () => {
    beforeAll(() => {
      mockExistsSync = jest.spyOn(fs, "existsSync");
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
    });

    afterAll(() => {
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
    });

    it("should look for the default Excel file if no argument is provided", async () => {
      await createExcelDocument.verifyExcelFileExists();
      expect(mockExistsSync).toHaveBeenCalledWith(
        path.resolve(dirname, "../output/title-detail-automated.xlsx")
      );
    });

    it("should return true if Excel file has already been created", async () => {
      fs.createFileSync(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );
      const actual = await createExcelDocument.verifyExcelFileExists(
        "title-detail-tests.xlsx"
      );
      expect(mockExistsSync).toHaveBeenCalled();
      expect(actual).toBeTruthy();
    });

    it("should return false if Excel file does not exist", async () => {
      const actual = await createExcelDocument.verifyExcelFileExists(
        "title-detail-non-existant.xlsx"
      );
      expect(mockExistsSync).toHaveBeenCalled();
      expect(actual).not.toBeTruthy();
    });
  });

  describe("createExcelDocument - Basic unit tests", () => {
    beforeAll(() => {
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
      mockCreateExcelWorkbook = jest.spyOn(
        createExcelDocument,
        "createExcelWorkbook"
      );
    });

    afterAll(() => {
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
      delete process.env.NODE_CONFIG_ENV;
    });

    const demoProducts = [
      { DEMO: "Sí", IDSIM: 1, TITULO: "Test Product 1" },
      { DEMO: "Sí", IDSIM: 2, TITULO: "Test Product 2" },
    ];

    const adoptedTitles = [
      { DEMO: "No", IDSIM: 3, TITULO: "Test Product 3" },
      { DEMO: "No", IDSIM: 4, TITULO: "Test Product 4" },
    ];

    it("should create the Workbook if it doesn't exist already", async () => {
      process.env.NODE_CONFIG_ENV = "development";
      await createExcelDocument.createExcelWorkbook(
        demoProducts,
        adoptedTitles,
        "title-detail-tests.xlsx"
      );
      const expected = fs.existsSync(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );

      expect(expected).toBeTruthy();
      expect(mockCreateExcelWorkbook).toHaveBeenCalledWith(
        demoProducts,
        adoptedTitles,
        "title-detail-tests.xlsx"
      );

      const workbook = new xlsx.Workbook();
      const createdWorkbook = await workbook.xlsx.readFile(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );
      const sheetNames = createdWorkbook.worksheets.map((sheet) => sheet.name);
      expect(sheetNames.includes("development")).toBeTruthy();
    });

    it("should overwrite the existing file in the same tab", async () => {
      process.env.NODE_CONFIG_ENV = "development";
      await createExcelDocument.createExcelWorkbook(
        [{ DEMO: "No", IDSIM: 1, TITULO: "Overwrite Test 1" }],
        undefined,
        "title-detail-tests.xlsx"
      );

      const workbook = new xlsx.Workbook();
      const createdWorkbook = await workbook.xlsx.readFile(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );
      const sheetNames = createdWorkbook.worksheets.map((sheet) => sheet.name);
      expect(sheetNames.includes("development")).toBeTruthy();
    });

    it("should create the preproduction tab", async () => {
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
      process.env.NODE_CONFIG_ENV = "preproduction";
      await createExcelDocument.createExcelWorkbook(
        demoProducts,
        adoptedTitles,
        "title-detail-tests.xlsx"
      );

      const workbook = new xlsx.Workbook();
      const createdWorkbook = await workbook.xlsx.readFile(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );
      const sheetNames = createdWorkbook.worksheets.map((sheet) => sheet.name);
      expect(sheetNames.includes("preproduction")).toBeTruthy();
    });

    it("should create the production tab", async () => {
      fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
      process.env.NODE_CONFIG_ENV = "production";
      await createExcelDocument.createExcelWorkbook(
        demoProducts,
        adoptedTitles,
        "title-detail-tests.xlsx"
      );

      const workbook = new xlsx.Workbook();
      const createdWorkbook = await workbook.xlsx.readFile(
        path.resolve(dirname, "../output/title-detail-tests.xlsx")
      );
      const sheetNames = createdWorkbook.worksheets.map((sheet) => sheet.name);
      expect(sheetNames.includes("production")).toBeTruthy();
    });

    it("should throw an error if the environment set is invalid", async () => {
      process.env.NODE_CONFIG_ENV = "test";
      await expect(
        createExcelDocument.createExcelWorkbook(
          demoProducts,
          adoptedTitles,
          "title-detail-tests.xlsx"
        )
      ).rejects.toThrow(Error);
    });
  });
});
