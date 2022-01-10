// import fs from "../../utils/fsExtra.cjs";
// import path from "path";
// import dirname from "../../utils/dirname.cjs";
// import xlsx from "exceljs";

// export const verifyExcelFileExists = (
//   fileName = "title-detail-automated.xlsx"
// ) => {
//   return fs.existsSync(path.resolve(dirname, `../output/${fileName}`));
// };

// export const createExcelWorkbook = (
//   demoProducts,
//   /* istanbul ignore next */
//   fileName = "title-detail-automated.xlsx"
// ) => {
//   const workbookAlreadyExists = verifyExcelFileExists(fileName);

//   let wb;
//   let sheetNames;

//   if (!workbookAlreadyExists) {
//     wb = new xlsx.Workbook();
//     wb.creator("Oxford University Press España");
//     // TODO: I stopped here
//     sheetNames = wb.SheetNames;
//   } else {
//     wb = xlsx.readFile(path.resolve(dirname, `../output/${fileName}`), {
//       cellStyles: true,
//     });
//     sheetNames = wb.Workbook.Sheets.map((sheet) => sheet.name);
//   }

//   switch (process.env.NODE_CONFIG_ENV) {
//     case "development":
//       createWorksheet(wb, sheetNames, "development", demoProducts);
//       break;

//     case "preproduction":
//       createWorksheet(wb, sheetNames, "preproduction", demoProducts);
//       break;

//     case "production":
//       createWorksheet(wb, sheetNames, "production", demoProducts);
//       break;

//     default:
//       throw new Error(
//         `Worksheet cannot be created: wrong environment was passed down ${process.env.NODE_CONFIG_ENV}`
//       );
//   }

//   xlsx.writeFile(wb, path.resolve(dirname, `../output/${fileName}`));
// };

// const createWorksheet = (
//   workbook,
//   sheetNames,
//   environmentName,
//   demoProducts
// ) => {
//   if (!sheetNames.includes(environmentName)) {
//     workbook.SheetNames.push(environmentName);
//   }

//   const ws = xlsx.utils.json_to_sheet(demoProducts, {
//     header: [
//       "TITULO",
//       "IDSIM",
//       "POST (Título - ID)",
//       "CÓDIGO POST",
//       "DEMO",
//       "USUARIO",
//       "AÑADIDO A LA BIBLIOTECA",
//     ],
//   });

//   ws["!cols"] = [
//     { wch: 50 },
//     { wch: 15 },
//     { wch: 25 },
//     { wch: 15 },
//     { wch: 10 },
//     { wch: 50 },
//     { wch: 25 },
//   ];

//   const headerStyle = {
//     fill: { patternType: "solid", fgColor: { rgb: "002060" } },
//     font: { color: { rgb: "ffffff" }, bold: "true" },
//     alignment: { vertical: "center", horizontal: "center" },
//   };

//   ws["A1"].s = headerStyle;
//   ws["B1"].s = headerStyle;
//   ws["C1"].s = headerStyle;
//   ws["D1"].s = headerStyle;
//   ws["E1"].s = headerStyle;
//   ws["F1"].s = headerStyle;
//   ws["G1"].s = headerStyle;

//   workbook.Sheets[environmentName] = ws;
// };
