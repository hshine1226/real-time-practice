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
  socket.on("room", (msg, done) => {
    console.log("msg: ", msg);
    setTimeout(() => {
      done();
    }, 3000);
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
