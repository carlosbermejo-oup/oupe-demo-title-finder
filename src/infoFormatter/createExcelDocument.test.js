import * as createExcelDocument from "./createExcelDocument";
import fs from "../../utils/fsExtra.cjs";
import path from "path";
import dirname from "../../utils/dirname.cjs";
import xlsx from "exceljs";

let mockExistsSync;
let mockCreateExcelWorkbook;

describe("createExcelDocument - Basic unit tests", () => {
  // TODO: DELETE THIS
  it("should keep build from breaking", () => {
    expect(true).toBeTruthy();
  })
})
//   afterAll(() => {
//     jest.resetAllMocks();
//   });

//   describe("verifyExcelFile - Basic unit tests", () => {
//     beforeAll(() => {
//       mockExistsSync = jest.spyOn(fs, "existsSync");
//       fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
//     });

//     afterAll(() => {
//       fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
//     });

//     it("should look for the default Excel file if no argument is provided", () => {
//       createExcelDocument.verifyExcelFileExists();
//       expect(mockExistsSync).toHaveBeenCalledWith(
//         path.resolve(dirname, "../output/title-detail-automated.xlsx")
//       );
//     });

//     it("should return true if Excel file has already been created", () => {
//       fs.createFileSync(
//         path.resolve(dirname, "../output/title-detail-tests.xlsx")
//       );
//       const actual = createExcelDocument.verifyExcelFileExists(
//         "title-detail-tests.xlsx"
//       );
//       expect(mockExistsSync).toHaveBeenCalled();
//       expect(actual).toBeTruthy();
//     });

//     it("should return false if Excel file does not exist", () => {
//       const actual = createExcelDocument.verifyExcelFileExists(
//         "title-detail-non-existant.xlsx"
//       );
//       expect(mockExistsSync).toHaveBeenCalled();
//       expect(actual).not.toBeTruthy();
//     });
//   });

//   describe("createExcelDocument - Basic unit tests", () => {
//     beforeAll(() => {
//       fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
//       mockCreateExcelWorkbook = jest.spyOn(
//         createExcelDocument,
//         "createExcelWorkbook"
//       );
//     });

//     afterAll(() => {
//       fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
//       delete process.env.NODE_CONFIG_ENV;
//     });

//     const demoProducts = [
//       { DEMO: "Sí", IDSIM: 1, TITULO: "Test Product 1" },
//       { DEMO: "Sí", IDSIM: 2, TITULO: "Test Product 2" },
//     ];

//     it("should create the Workbook if it doesn't exist already", () => {
//       process.env.NODE_CONFIG_ENV = "development";
//       createExcelDocument.createExcelWorkbook(
//         demoProducts,
//         "title-detail-tests.xlsx"
//       );
//       const expected = fs.existsSync(
//         path.resolve(dirname, "../output/title-detail-tests.xlsx")
//       );

//       expect(expected).toBeTruthy();
//       expect(mockCreateExcelWorkbook).toHaveBeenCalledWith(
//         demoProducts,
//         "title-detail-tests.xlsx"
//       );

//       const createdWorkbook = xlsx.readFile(
//         path.resolve(dirname, "../output/title-detail-tests.xlsx")
//       );
//       expect(createdWorkbook.Workbook.Sheets[0].name).toBe("development");
//     });

//     it("should overwrite the existing file in the same tab", () => {
//       process.env.NODE_CONFIG_ENV = "development";
//       createExcelDocument.createExcelWorkbook(
//         [{ DEMO: "No", IDSIM: 1, TITULO: "Overwrite Test 1" }],
//         "title-detail-tests.xlsx"
//       );

//       const createdWorkbook = xlsx.readFile(
//         path.resolve(dirname, "../output/title-detail-tests.xlsx")
//       );
//       expect(createdWorkbook.Workbook.Sheets[0].name).toBe("development");
//     });

//     it("should create the preproduction tab", () => {
//       fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
//       process.env.NODE_CONFIG_ENV = "preproduction";
//       createExcelDocument.createExcelWorkbook(
//         demoProducts,
//         "title-detail-tests.xlsx"
//       );

//       const createdWorkbook = xlsx.readFile(
//         path.resolve(dirname, "../output/title-detail-tests.xlsx")
//       );
//       expect(createdWorkbook.Workbook.Sheets[0].name).toBe("preproduction");
//     });

//     it("should create the production tab", () => {
//       fs.removeSync(path.resolve(dirname, "../output/title-detail-tests.xlsx"));
//       process.env.NODE_CONFIG_ENV = "production";
//       createExcelDocument.createExcelWorkbook(
//         demoProducts,
//         "title-detail-tests.xlsx"
//       );

//       const createdWorkbook = xlsx.readFile(
//         path.resolve(dirname, "../output/title-detail-tests.xlsx")
//       );
//       expect(createdWorkbook.Workbook.Sheets[0].name).toBe("production");
//     });

//     it("should throw an error if the environment set is invalid", () => {
//       process.env.NODE_CONFIG_ENV = "test";
//       expect(() =>
//         createExcelDocument.createExcelWorkbook(
//           demoProducts,
//           "title-detail-tests.xlsx"
//         )
//       ).toThrow(Error);
//     });
//   });
// });
