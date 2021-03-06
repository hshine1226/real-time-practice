import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/*", (req, res) => {
  res.redirect("/");
});

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("message", (message, roomName, done) => {
    socket.to(roomName).emit("message", message);
    done();
  });

  socket.on("disconnecting", () => {
    const rooms = socket.rooms;
    rooms.forEach((roomName) => {
      socket.to(roomName).emit("bye");
    });
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
