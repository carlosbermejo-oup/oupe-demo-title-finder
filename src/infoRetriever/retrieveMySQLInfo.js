import { withMySQLConnection } from "../setup/databaseConnection.js";
import { isMySQLUp } from "./verifyConnection.js";

export const retrieveDemoProducts = async (appSettings) => {
  let resultDemoProducts;
  const mySQLStatus = await isMySQLUp(appSettings);

  if (mySQLStatus) {
    await withMySQLConnection(appSettings, async (connection) => {
      resultDemoProducts = await queryDemoProducts(connection);
    });
    return resultDemoProducts;
  } else {
    throw new Error(
      "MySQL is down according to the API, query cannot be performed."
    );
  }
};

const queryDemoProducts = async (connection) => {
  const formattedResult = {};

  try {
    const demoProducts = await connection.query(
      "SELECT `tpp`.`idPais`, `p`.`d_pais`, `tpp`.`idTitulo`, `t`.`nombre` " +
        "FROM `titulo_promocion_pais` AS `tpp` " +
        "JOIN `titulo` AS `t` " +
        "ON `tpp`.`idTitulo` = `t`.`idSim` " +
        "JOIN `pais` `p` " +
        "ON `p`.`c_pais` = `tpp`.`idPais` " +
        'WHERE `p`.`d_pais` = "ESPAÑA" ;'
    );

    demoProducts[0].map((row) => {
      formattedResult[row.idTitulo] = row.nombre;
    });
    return formattedResult;
  } catch (err) {
    throw new Error(`Error trying to query the DB: ${err}`);
  }
};
