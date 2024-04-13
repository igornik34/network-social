const { prisma } = require("../prisma/prisma-client");
const { getReceiverSocketId, io } = require("../socket/socket.js");

const MessageController = {
  sendMessage: async (req, res) => {
    try {
      const { text } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user.userId;

      console.log(req.params);

      let dialog = await prisma.dialog.findFirst({
        where: {
          participantIDs: {
            hasEvery: [senderId, receiverId],
          },
        },
      });

      if (!dialog) {
        dialog = await prisma.dialog.create({
          data: {
            participants: {
              connect: [{ id: senderId }, { id: receiverId }],
            },
          },
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          dialog: {
            connect: {
              id: dialog.id,
            },
          },
          text: text,
          sender: {
            connect: {
              id: senderId,
            },
          },
        },
        include: {
          dialog: {
            include: { messages: true, participants: true },
          },
        },
      });

      // SOCKET IO FUNCTIONALITY WILL GO HERE
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        console.log("new message");
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  // getMessages: async (req, res) => {
  //   try {
  //     const { id: userToChatId } = req.params;
  //     const senderId = req.user.userId;

  //     const dialog = await prisma.dialog.findFirst({
  //       where: {
  //         participantIDs: {
  //           hasEvery: [senderId, userToChatId],
  //         },
  //       },
  //     });

  //     if (!dialog) return res.status(200).json([]);

  //     const messages = await prisma.message.findMany({
  //       where: {
  //         dialogID: dialog.id,
  //       },
  //     });
  //     console.log(messages);
  //     res.status(200).json(messages);
  //   } catch (error) {
  //     console.log("Error in getMessages controller: ", error.message);
  //     res.status(500).json({ error: "Internal server error" });
  //   }
  // },
};

module.exports = MessageController;
