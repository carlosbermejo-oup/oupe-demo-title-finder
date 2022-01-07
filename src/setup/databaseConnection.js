import mysql from "mysql2/promise";

export const withMySQLConnection = async (appSettings, functionToExecute) => {
  const connection = await mysql.createConnection({
    host: appSettings.settings.urls.mysql_host,
    user: global.mysql_username,
    password: global.mysql_password,
    database:
      process.env.NODE_CONFIG_ENV === "preproduction" ||
      process.env.NODE_CONFIG_ENV === "production"
        ? "oupesim"
        : "oupesimdev",
  });

  /* istanbul ignore next */
  try {
    await connection.connect();
  } catch (err) {
    throw new Error(`Error connecting to the DB: ${err}`);
  }

  await functionToExecute(connection);

  /* istanbul ignore next */
  try {
    await connection.end();
  } catch (err) {
    throw new Error(`Error disconnecting from the DB: ${err}`);
  }
};
