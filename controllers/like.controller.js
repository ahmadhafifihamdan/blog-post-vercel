const { toggleLike } = require("../services/like.service");

const toggleLikeHandler = async(req, res) => {
    const { blogId } = req.params;
    const userEmail = req.user.email;
    if (!blogId) return res.redirect("/blogs");

    await toggleLike(blogId, userEmail);
    return res.redirect("/blogs");
}

module.exports = {
    toggleLikeHandler
}