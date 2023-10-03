const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const userRoutes = require("./routes/users");
const chatGroupRoutes = require("./routes/chatGroup");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3000;
server.use(cors());
server.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/chatApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connetcted to Mongodb"))
  .catch((err) => console.error("Could not connect to Mongodb...", err));

server.use("/api/users", userRoutes);
server.use("/api/chatgroup", chatGroupRoutes);

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinRoom", async (roomId) => {
    try {
      socket.join(roomId);

      // Fetch message history from the database
      const chatGroup = await ChatGroup.findById(roomId).populate('messages.sender');
      const messages = chatGroup.messages;

      // Emit message history to the client
      socket.emit("messageHistory", messages);
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  });

  socket.on("newMessage", async (roomId, message) => {
    try {
      // Save the message in the database
      const chatGroup = await ChatGroup.findById(roomId);
      chatGroup.messages.push(message);
      await chatGroup.save();

      // Emit the message to clients in the room
      io.to(roomId).emit("newMessage", message);
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${port}`)
);
