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

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "anonymous";
  console.log("Connected to Browser");

  socket.on("close", () => {
    console.log("Disconnected from the Browser");
  });

  socket.on("message", (message) => {
    const { type, payload } = JSON.parse(message);
    console.log("type, payload: ", type, payload);

    switch (type) {
      case "nickname":
        socket["nickname"] = payload;
        break;
      case "message":
        sockets.forEach((aSocket) => {
          aSocket.send(`${socket["nickname"]}: ${payload.toString()}`);
        });
        break;
    }
  });

  socket.send("hello");
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
