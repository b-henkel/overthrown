import { Server } from "socket.io";
import { initGameState, addUser } from "../../game/game-state";

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
      socket.emit("a user connected");
      socket.on("hello", (msg) => {
        socket.emit("hello", "world!");
      });

      socket.on("join", (room) => {
        console.log(`Socket ${socket.id} joining ${room}`);
        socket.join(room);
      });
      socket.on("chat", (data) => {
        const { message, room } = data;
        console.log(`msg: ${message}, room: ${room}`);
        io.to(room).emit("chat", message);
      });
      //  });

      socket.on("gamestart", (data) => {
        // how the heck do we maintain the channel correctly between multiple
        // pages joining the socket.
        // What even is the linking data?
        // const newGame = initGameState(socket);
      });

      socket.on("add-user", (data) => {
        console.log(`Trying to add user ${JSON.stringify(data)}`);
        // TODO need to mod the global game object to add the users?
        addUser(socket, data.gameId, {
          id: socket.id,
          name: data.username,
        });
        // socket.to(data.gameId).emit("state-update", updatedGameState);
      });

      socket.on("useraction", (data) => {
        // depending on the action type, call some function in game-state.js and pass the socket
        // so that it can re-emit the updated state
      });
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
