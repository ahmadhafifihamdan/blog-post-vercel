const { Router } = require("express");
const { protect } = require("../middleware/auth.middleware");
const { uploadBlogImage } = require("../middleware/upload.middleware");
const { mainPage, nextBlog } = require("../controllers/main.controller");
const { getBlogForm, createBlogHandler } = require("../controllers/blog.controller");
const { addCommentHandler } = require("../controllers/comment.controller");
const { toggleLikeHandler } = require("../controllers/like.controller");

const router = Router();

// Blog feed
router.route("/").get(protect, mainPage);

// Go next
router.route("/next").post(protect, nextBlog);

// Create blog
router.route("/create")
    .get(protect, getBlogForm)
    .post(protect, uploadBlogImage, createBlogHandler);

// Interactions (Comment and Like)
router.route("/:blogId/comment").post(protect, addCommentHandler);
router.route("/:blogId/like").post(protect, toggleLikeHandler);

module.exports = router;