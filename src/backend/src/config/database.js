const sql = require("mssql");
require("dotenv").config();

// ================================
// SQL SERVER CONFIGURATION
// ================================

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT || 1433),

    database: process.env.DB_DATABASE,

    options: {
        encrypt: false,
        trustServerCertificate: true
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },

    connectionTimeout: 15000,
    requestTimeout: 15000
};

// ================================
// CREATE CONNECTION POOL
// ================================

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("SQL Server connected successfully!");
        console.log(`Database: ${config.database}`);

        return pool;
    })
    .catch(error => {
        console.error("Database connection failed:", error.message);
        throw error;
    });

module.exports = {
    sql,
    poolPromise
};