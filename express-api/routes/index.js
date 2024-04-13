const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  UserController,
  PostController,
  CommentController,
  LikeController,
  FollowController,
  MessageController,
  DialogController,
} = require("../controllers");
const authenticateToken = require("../middleware/auth");

const UPLOAD_DESTINATION = "uploads";

// показываем где хранить файлы
const storage = multer.diskStorage({
  destination: UPLOAD_DESTINATION,
  filename: function (req, file, next) {
    next(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

// routes user
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", authenticateToken, UserController.current);
router.get("/users/:id", authenticateToken, UserController.getUserById);
router.put("/users/:id", authenticateToken, uploads.single("avatar"), UserController.updateUser);

// routes posts
router.post("/posts", authenticateToken, PostController.createPost);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostById);
router.delete("/posts/:id", authenticateToken, PostController.deletePost);

// routes comments
router.post("/comments", authenticateToken, CommentController.createComment);
router.delete(
  "/comments/:id",
  authenticateToken,
  CommentController.deleteComment
);

// routes likes
router.post("/likes", authenticateToken, LikeController.likePost);
router.delete("/likes/:id", authenticateToken, LikeController.unlikePost);

// routes follows
router.post("/follow", authenticateToken, FollowController.followUser);
router.delete("/unfollow/:id", authenticateToken, FollowController.unfollowUser);

// routes messages
router.post('/send-message/:id', authenticateToken, MessageController.sendMessage)

// routes dialogs

router.get('/dialogs', authenticateToken, DialogController.getAllDialogs)
router.get('/dialogs/:id', authenticateToken, DialogController.getDialogById)
router.get('/receiver/:id', authenticateToken, DialogController.getReceiverById)

module.exports = router;
