const socket = io();

const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.querySelector("#room");
const roomForm = room.querySelector("form");

room.hidden = true;
let roomName;

const addMessage = (msg) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = msg;
  ul.appendChild(li);
};

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  roomName = input.value;
  input.value = "";

  socket.emit("enter_room", roomName, () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `You are in room: ${roomName}`;
  });
});

roomForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  const message = input.value;
  input.value = "";
  socket.emit("message", message, roomName, () => {
    addMessage(`You: ${message}`);
  });
});

socket.on("welcome", () => {
  addMessage("Someone joined!");
});

socket.on("bye", () => {
  addMessage("Someone left!");
});

socket.on("message", (message) => {
  addMessage(`Someone: ${message}`);
});
