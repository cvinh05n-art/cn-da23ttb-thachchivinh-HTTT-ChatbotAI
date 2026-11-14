require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("------------------------------------");
    console.log("       SHOPTT BACKEND SERVER");
    console.log("------------------------------------");
    console.log(`Server running: http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});