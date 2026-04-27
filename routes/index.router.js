const { Router } = require("express");
const authRouter = require("./auth.router");
const blogRouter = require("./blog.router");

const router = Router();

router.get("/", (req, res) => {
    return res.redirect("/auth/login");
});

router.use("/auth", authRouter);
router.use("/blogs", blogRouter);

module.exports = router;