import fs from "../../utils/fsExtra.cjs";
import path from "path";
import dirname from "../../utils/dirname.cjs";
import xlsx from "exceljs";

export const verifyExcelFileExists = (
  fileName = "title-detail-automated.xlsx"
) => {
  return fs.existsSync(path.resolve(dirname, `../output/${fileName}`));
};

export const createExcelWorkbook = async (
  demoProducts,
  adoptedtitles,
  /* istanbul ignore next */
  fileName = "title-detail-automated.xlsx"
) => {
  const workbookAlreadyExists = verifyExcelFileExists(fileName);

  let wb;
  let sheetNames;

  if (!workbookAlreadyExists) {
    wb = new xlsx.Workbook();
    wb.creator = "Oxford University Press España";
    sheetNames = [];
  } else {
    wb = new xlsx.Workbook();
    wb = await wb.xlsx.readFile(path.resolve(dirname, `../output/${fileName}`));
    sheetNames = wb.worksheets.map((sheet) => sheet.name);
  }

  switch (process.env.NODE_CONFIG_ENV) {
    case "development":
      wb = createWorksheet(
        wb,
        sheetNames,
        "development",
        demoProducts,
        adoptedtitles
      );
      await wb.xlsx.writeFile(path.resolve(dirname, `../output/${fileName}`));
      break;

    case "preproduction":
      wb = createWorksheet(
        wb,
        sheetNames,
        "preproduction",
        demoProducts,
        adoptedtitles
      );
      await wb.xlsx.writeFile(path.resolve(dirname, `../output/${fileName}`));
      break;

    case "production":
      wb = createWorksheet(
        wb,
        sheetNames,
        "production",
        demoProducts,
        adoptedtitles
      );
      await wb.xlsx.writeFile(path.resolve(dirname, `../output/${fileName}`));
      break;

    default:
      throw new Error(
        `Worksheet cannot be created: wrong environment was passed down ${process.env.NODE_CONFIG_ENV}`
      );
  }
};

const createWorksheet = (
  workbook,
  sheetNames,
  environmentName,
  demoProducts,
  adoptedtitles
) => {
  if (sheetNames.includes(environmentName)) {
    const oldWorksheet = workbook.getWorksheet(environmentName);
    workbook.removeWorksheet(oldWorksheet.id);
  }

  const ws = workbook.addWorksheet(environmentName);

  const headerStyle = {
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF002060" } },
    font: { color: { argb: "FFFFFFFF" }, bold: "true" },
    alignment: { vertical: "middle", horizontal: "center" },
  };

  ws.columns = [
    {
      header: "TITULO",
      key: "titleName",
      width: 50,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "IDSIM",
      key: "simId",
      width: 15,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "POST (Título - ID)",
      key: "postTitle",
      width: 25,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "CÓDIGO POST",
      key: "postCode",
      width: 50,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "URL MÁS INFORMATION",
      key: "moreInformationUrl",
      width: 50,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "DEMO",
      key: "isDemo",
      width: 10,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "USUARIO",
      key: "email",
      width: 50,
      style: { alignment: { wrapText: true } },
    },
    {
      header: "AÑADIDO A LA BIBLIOTECA",
      key: "isInLibrary",
      width: 25,
      style: { alignment: { wrapText: true } },
    },
  ];

  ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1"].forEach((cell) => {
    ws.getCell(cell).style = headerStyle;
  });

  ws.autoFilter = "A1:H1";

  if (adoptedtitles) {
    ws.addRows(adoptedtitles);
  }

  ws.addRows(demoProducts);

  return workbook;
};
