import { Server } from "socket.io";

/*
const gamestate = {
    "893983" : {
        "players": [],
        "current_action": ""
        ...
    }
}
*/

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log("*First use, starting socket.io");

    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.broadcast.emit("a user connected");
      socket.on("hello", (msg) => {
        socket.emit("hello", "world!");
      });
    });

    socket.on("gamecreate", (data) => {
      // TODO create a new UUID for the game session
      // and send it back to the client
      // Also, create a new game state object
    });

    socket.on("useraction", (data) => {
      // work out what has happened, update the game state object
      // Then broadcast this updated data back to all clients.
    });

    res.socket.server.io = io;
  } else {
    console.log("socket.io already running");
  }
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
