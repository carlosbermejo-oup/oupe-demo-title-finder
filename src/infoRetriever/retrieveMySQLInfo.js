import { withMySQLConnection } from "../setup/databaseConnection.js";
import { retrieveWordpressPosts } from "./retrieveWordpressPosts.js";
import { isMySQLUp } from "./verifyConnection.js";

export const retrieveDemoProducts = async (appSettings) => {
  let resultDemoProducts;
  let resultTitlesInLibrary;

  const mySQLStatus = await isMySQLUp(appSettings);
  const wordPressPosts = await retrieveWordpressPosts();

  if (mySQLStatus) {
    await withMySQLConnection(appSettings, async (connection) => {
      resultDemoProducts = await queryDemoProducts(connection);
    });

    resultDemoProducts = mapWordPressPostExcerptToTitle(
      wordPressPosts,
      resultDemoProducts
    );

    /* istanbul ignore next */
    if (global.premium_email) {
      await withMySQLConnection(appSettings, async (connection) => {
        resultTitlesInLibrary = await queryTitlesInLibrary(connection);
      });

      resultDemoProducts.map((demoProduct) => {
        if (demoProduct.simId in resultTitlesInLibrary) {
          demoProduct.isInLibrary = "Sí";
          demoProduct.email = global.premium_email;
        } else {
          demoProduct.isInLibrary = "No";
        }
      });
    }

    return resultDemoProducts;
  } else {
    throw new Error(
      "MySQL is down according to the API, query cannot be performed."
    );
  }
};

/* istanbul ignore next */
export const retrieveAdoptedTitles = async (appSettings) => {
  let resultAdoptedTitles;
  let resultTitlesInLibrary;
  const mySQLStatus = await isMySQLUp(appSettings);
  const wordPressPosts = await retrieveWordpressPosts();

  if (global.premium_email) {
    if (mySQLStatus) {
      await withMySQLConnection(appSettings, async (connection) => {
        resultAdoptedTitles = await queryAdoptedTitles(connection);
      });

      resultAdoptedTitles = mapWordPressPostExcerptToTitle(
        wordPressPosts,
        resultAdoptedTitles
      );

      await withMySQLConnection(appSettings, async (connection) => {
        resultTitlesInLibrary = await queryTitlesInLibrary(connection);
      });

      resultAdoptedTitles.map((adoptedTitle) => {
        if (adoptedTitle.simId in resultTitlesInLibrary) {
          adoptedTitle.isInLibrary = "Sí";
        } else {
          adoptedTitle.isInLibrary = "No";
        }
      });

      return resultAdoptedTitles;
    } else {
      throw new Error(
        "MySQL is down according to the API, query cannot be performed."
      );
    }
  }
};

const queryDemoProducts = async (connection) => {
  const formattedResult = [];

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
      formattedResult.push({
        titleName: row.nombre,
        simId: row.idTitulo,
        isDemo: "Sí",
        isInLibrary: "No",
      });
    });

    return formattedResult;
  } catch (err) {
    throw new Error(`Error trying to query the DB: ${err}`);
  }
};

/* istanbul ignore next */
const queryAdoptedTitles = async (connection) => {
  const formattedResult = [];

  try {
    const adoptedTitles = await connection.query(
      "SELECT t.idSim , t.nombre " +
        "FROM adopcion AS a " +
        "JOIN categoria AS c2 " +
        "ON a.idComunidadAutonoma = c2.idSim " +
        "JOIN categoria AS c3 " +
        "ON a.idIdioma = c3.idSim " +
        "JOIN titulo AS t " +
        "ON a.idTitulo = t.idSim " +
        "JOIN nivel AS n " +
        "ON a.idNivel = n.idSim " +
        "JOIN centro AS c " +
        "ON a.idCentro = c.idCentro " +
        "JOIN asignatura AS a2 " +
        "ON a.idAsignatura = a2.idSim " +
        "JOIN profesor AS p " +
        "ON p.idCentro = c.idCentro " +
        "JOIN correo AS c4 " +
        "ON c4.idProfesor = p.idSim " +
        `WHERE c4.direccionCorreo = \"${global.premium_email}\";`
    );

    adoptedTitles[0].map((row) => {
      formattedResult.push({
        titleName: row.nombre,
        simId: row.idSim,
        isDemo: "No",
        email: global.premium_email,
      });
    });

    return formattedResult;
  } catch (err) {
    throw new Error(`Error trying to query the DB: ${err}`);
  }
};

/* istanbul ignore next */
const queryTitlesInLibrary = async (connection) => {
  const formattedResult = {};

  try {
    const titlesInLibrary = await connection.query(
      "SELECT b.idtitulo, t.nombre " +
        "FROM biblioteca AS b " +
        "JOIN profesor AS p " +
        "ON b.idprofesor = p.idSim " +
        "JOIN titulo AS t " +
        "ON b.idtitulo = t.idSim " +
        "JOIN correo AS c " +
        "ON p.idSim = c.idProfesor " +
        `WHERE c.direccionCorreo = \"${global.premium_email}\" ;`
    );

    titlesInLibrary[0].map((row) => {
      formattedResult[row.idtitulo] = row.nombre;
    });
    return formattedResult;
  } catch (err) {
    throw new Error(`Error trying to query the DB: ${err}`);
  }
};

/* istanbul ignore next */
export const mapWordPressPostExcerptToTitle = (wordPressPosts, titles) => {
  titles.map((title) => {
    wordPressPosts.map((post) => {
      if ( post.excerpt.rendered.includes("@") && post.excerpt.rendered.split("@")[0].includes(title.simId)) {
        title.postTitle =
          (title.postTitle ? title.postTitle : "") +
          `${post.title.rendered} - ${post.id}\n`;
        title.postCode =
          (title.postCode ? title.postCode : "") +
          `${post.excerpt.rendered.split("<p>")[1].split("</p>")[0]}\n`;
        title.moreInformationUrl =
          (title.moreInformationUrl ? title.moreInformationUrl : "") +
          // `${post?.excerpt?.rendered?.split("@")[1].split("</p>")[0]}\n`;
          `${!post?.excerpt?.rendered?.includes("PM:") ? post?.excerpt?.rendered?.split("@")[1].split("</p>")[0] + "\n" : ""}`;
      }
    });
  });
  return titles;
};
