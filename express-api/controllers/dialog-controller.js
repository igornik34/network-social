const { prisma } = require("../prisma/prisma-client");

const DialogController = {
  getAllDialogs: async (req, res) => {
    const userId = req.user.userId;
    try {
      const dialogs = await prisma.user
        .findUnique({ where: { id: userId } })
        .dialogs({
          include: {
            participants: true,
            lastMessage: true
          },
          orderBy: {
            lastMessage: {
              createdAt: "desc"
            }
          },
        });
      res.send(dialogs);
    } catch (error) {
      console.error("get all dialogs", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getDialogById: async (req, res) => {
    const { id } = req.params;
    const senderId = req.user.userId;
    try {
      const receiver = await prisma.user.findUnique({
        where: {
          id
        }
      })

      if(!receiver) {
        return res.status(404).json({ error: "Получатель не найден" });
      }

      const dialog = await prisma.dialog.findFirst({
        where: {
          AND: [
            { participants: { some: { id: senderId } } },
            { participants: { some: { id: id } } },
          ],
        },
        include: {
          messages: {
            include: {
              sender: true,
            },
          },
          participants: {
            include: true
          },
          lastMessage: {
            include: true
          }
        },
      });

      console.log(dialog);

      if (!dialog) {
        return res.status(404).json({ error: "Диалог не найден" });
      }

      res.send(dialog);
    } catch (error) {
      console.error("get dialog by id", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getReceiverById: async (req, res) => {
    const { id } = req.params;
    try {
      const receiver = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!receiver) {
        return res.status(404).json({ error: "Получатель не найден" });
      }

      res.send(receiver);
    } catch (error) {
      console.error("get receiver by id", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = DialogController;
