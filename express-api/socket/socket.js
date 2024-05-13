const { Server } = require("socket.io");
const { prisma } = require("../prisma/prisma-client");
const http = require("http");
const express = require("express");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("a user connected", socket.id, userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
    await prisma.user.update({ where: { id: userId }, data: { online: true } });
  }
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  socket.on("disconnect", async () => {
    console.log("user disconnected", socket.id);
    await prisma.user.update({
      where: { id: userId },
      data: { online: false, lastSeen: new Date() },
    });
    delete userSocketMap[userId];
  });
});

module.exports = { app, io, server, getReceiverSocketId };