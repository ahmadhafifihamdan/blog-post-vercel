const { Router } = require("express");
const authRouter = require("./auth.router");
const blogRouter = require("./blog.router");

const router = Router();

router.use("/auth", authRouter);
router.use("/blogs", blogRouter);

module.exports = router;