const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  const roomName = input.value;
  input.value = "";

  socket.emit("enter_room", roomName, () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `You are in room: ${roomName}`;
  });
});

socket.on("welcome", () => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = "Someone joined!";
  ul.appendChild(li);
});
