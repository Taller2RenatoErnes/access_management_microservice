const sql = require("mssql");

// Configuración de conexión a SQL Server
const dbConfig = {
  user: "sa", // Reemplaza con tu usuario
  password: "123456", // Reemplaza con tu contraseña
  server: "localhost", // Cambia si tu servidor no es local
  database: "TestDB",
  options: {
    encrypt: false, // Cambiar a true si usas Azure
    trustServerCertificate: true, // Necesario para conexiones locales
  },
  
};


try {
sql.connect(dbConfig);
    console.log("Conexión exitosa a la base de datos");
} catch (err) {
    console.error("Error al conectar a la base de datos:", err);
}


module.exports = {sql};


