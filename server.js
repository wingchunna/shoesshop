const http = require("http");
const app = require("./App/app");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const server = http.createServer(
  // {
  //   key: fs.readFileSync("key.pem"),
  //   cert: fs.readFileSync("cert.pem"),
  // },
  app
);

server.listen(PORT, HOST, console.log(`Server is running on port ${PORT}`));
