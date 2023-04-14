const https = require("https");
const app = require("./App/app");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const server = https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

server.listen(PORT, HOST, console.log(`Server is running on port ${PORT}`));
