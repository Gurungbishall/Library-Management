import pkg from "pg";
const { Pool } = pkg;
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASENAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync(process.env.DB_SSL_CA),
  },
});

export default pool;
