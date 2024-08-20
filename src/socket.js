import { Server } from "socket.io";
import http from "http";
import express from "express";
// import { joinRooms } from "../utils/JoinRooms.js";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`http://localhost:5173`], // https://taxidi.vercel.app
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};


const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connect", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("handshakeId ", userId);
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  // emit is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("userTyping", (data) => {
  const receiverSocketId = getReceiverSocketId(data.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("userIsTyping", data.message);
  }
});

// joinRooms(socket, userId);

socket.on("userStoppedTyping", (data) => {
  const receiverSocketId = getReceiverSocketId(data.receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("userStoppedTyping");
  }
});


  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
