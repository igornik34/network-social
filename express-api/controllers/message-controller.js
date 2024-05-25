const { prisma } = require("../prisma/prisma-client");
const { getUserSocketId, io } = require("../socket/socket.js");

const MessageController = {
  send: async (req, res) => {
    try {
      const { text } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user.userId;
      const receiverSocketId = getUserSocketId(receiverId);

      // ЭТОТ БЛОК ОТВЕЧАЕТ ЗА ТО, ЧТО ЕСЛИ ДИАЛОГ УЖЕ ЕСТЬ
      let dialog = await prisma.dialog.findFirst({
        where: {
          AND: [
            { participants: { some: { id: senderId } } },
            { participants: { some: { id: receiverId } } },
          ],
        },
      });

      // ЭТОТ БЛОК ОТВЕЧАЕТ ЗА ТО, ЧТО ЕСЛИ ДИАЛОГА ЕЩЕ НЕТ
      if (!dialog) {
        let dialog = await prisma.dialog.create({
          data: {
            participants: {
              connect: [{ id: senderId }, { id: receiverId }],
            },
          },
        });

        const newMessage = await prisma.message.create({
          data: {
            dialog: {
              connect: {
                id: dialog.id,
              },
            },
            dialogLastMessage: {
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
        });

        await prisma.dialog.update({
          where: {
            id: dialog.id,
          },
          data: {
            messages: {
              connect: {
                id: newMessage.id,
              },
            },
            lastMessage: {
              connect: {
                id: newMessage.id,
              },
            },
          },
        });

        dialog = await prisma.dialog.findFirst({
          where: {
            id: dialog.id,
          },
          include: {
            participants: true,
            messages: true,
            lastMessage: true,
          },
        });

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("SERVER:NEW_DIALOG", dialog);
        }
        console.log(dialog);
        return res.status(201).json(dialog);
      }

      let newMessage = await prisma.message.create({
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
          dialogLastMessage: {
            connect: {
              id: dialog.id,
            },
          },
        },
        include: {
          sender: true,
        },
      });

      await prisma.dialog.update({
        where: {
          id: dialog.id,
        },
        data: {
          lastMessage: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });

      // SOCKET IO FUNCTIONALITY WILL GO HERE
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("SERVER:NEW_MESSAGE", newMessage);
      }
      return res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  read: async (req, res) => {
    try {
      const { id: messageId } = req.params;
      const { senderId } = req.body;
      const readedMessage = await prisma.message.update({
        where: { id: messageId },
        data: { isReaded: true },
      });

      const senderSocketId = getUserSocketId(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("SERVER:READ_MESSAGE", {
          id: readedMessage.id,
        });
      }

      res.status(200).json(readedMessage);
    } catch (error) {
      console.log("Error in readMessage controller: ", error);
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
