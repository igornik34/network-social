const { prisma } = require("../prisma/prisma-client");

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (followingId === userId) {
      return res
        .status(400)
        .json({ error: "Вы не можете подписаться на самого себя" });
    }

    try {
      const existingFollow = await prisma.follows.findFirst({
        where: { AND: [{ followerId: userId }, { followingId }] },
      });
      if (existingFollow) {
        return res.status(400).json({ error: "Подписка уже существует" });
      }
      await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } },
        },
      });
      res.status(201).json({ message: "Подписка успешно создана" });
    } catch (error) {
      console.error("follow user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  unfollowUser: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const follows = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: userId }, { followingId: id }],
        },
      });
      if (!follows) {
        return res
          .status(400)
          .json({ error: "Вы не подписаны на этого пользователя" });
      }

      await prisma.follows.delete({
        where: { id: follows.id },
      });
      res.status(201).json({ message: "Вы успешно отписались" });
    } catch (error) {
      console.error("unfollow user", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = FollowController;
