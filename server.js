const http = require("http");
const app = require("./App/app");
const fs = require("fs");

require("dotenv").config();
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", function (socket) {
  socket.on("disconnect", function () {});

  //server lắng nghe dữ liệu từ client

  socket.on("Client-sent-data", function (data) {
    //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác

    console.log("client send data", data);
  });
});
const socketIoObject = io;
module.exports.ioObject = socketIoObject;
server.listen(PORT, HOST, console.log(`Server is running on port ${PORT}`));
