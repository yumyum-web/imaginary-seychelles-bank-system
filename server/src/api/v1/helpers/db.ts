import mysql, { ConnectionOptions } from "mysql2/promise";

import { config } from "../../config.js";

const access: ConnectionOptions = {
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
};

const conn = await mysql.createConnection(access);

export default conn;
