const sql = require("mssql");

const dbConfig = {
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE, 
    options: {
      encrypt: process.env.DB_ENCRYPT === 'true', 
      trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', 
    },
  };


try {
    sql.connect(dbConfig);
        console.log("Conexión exitosa a la base de datos");
} catch (err) {
    console.error("Error al conectar a la base de datos:", err);
}


module.exports = {sql};


