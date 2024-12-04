const app = require("./app");
const port = process.env.PORT || 4000;

async function main() {
  app.listen(port);
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
  
}

main();
