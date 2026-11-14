require("dotenv").config();

const sql = require("mssql");

async function testConnection() {
    try {
        const pool = await sql.connect({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_SERVER,
            port: Number(process.env.DB_PORT),
            database: process.env.DB_DATABASE,
            options: {
                encrypt: false,
                trustServerCertificate: true
            }
        });

        const result = await pool.request().query(`
            SELECT
                DB_NAME() AS databaseName,
                SUSER_SNAME() AS currentLogin
        `);

        console.log("DATABASE CONNECTION SUCCESS!");
        console.log(result.recordset);

        await pool.close();

    } catch (error) {
        console.error("DATABASE CONNECTION FAILED!");
        console.error(error.message);
    }
}

testConnection();