import express from "express";
import http from "http";
import WebSocket from "ws";

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
const wss = new WebSocket.Server({ server });

wss.on("connection", (socket) => {
  console.log("Connected to Browser");

  socket.on("close", () => {
    console.log("Disconnected from the Browser");
  });

  socket.on("message", (message) => {
    console.log("New message: ", message.toString());
    socket.send(message.toString());
  });

  socket.send("hello");
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
