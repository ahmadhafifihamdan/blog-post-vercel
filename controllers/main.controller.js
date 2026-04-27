const { getLatestBlog, getBlogById, getNextBlog } = require("../services/blog.service");
const { getCommentsByIds } = require("../services/comment.service");
const { hasUserLiked } = require("../services/like.service");

const mainPage = async (req, res) => {
    let blog = null;
    let commentIds = [];
    let comments = [];
    let hasLiked = false;

    if (req.cookies.current_blog_id) {
        blog = await getBlogById(req.cookies.current_blog_id);
    }

    // Fallback if cookie missing OR cookie points to deleted blog
    if (!blog) {
        blog = await getLatestBlog();
        if (blog) {
            res.cookie("current_blog_id", blog.id);
        } else {
            // No blogs at all
            res.clearCookie("current_blog_id");
        }
    }

    if (blog && req.user?.email) {
        hasLiked = await hasUserLiked(blog.id, req.user.email);
    }

    // Only read commentIds if blog exists
    if (blog && Array.isArray(blog.commentIds)) {
        commentIds = blog.commentIds;
    }

    if (commentIds.length > 0) {
        comments = await getCommentsByIds(commentIds);
    }

    // wrapping notice
    let notice = "";
    if (req.cookies.nav_notice === "wrapped") {
        notice = "You’ve reached the end. Back to the latest post.";
        res.clearCookie("nav_notice");
    }

    const error = req.query.error === "comment_empty" ? "Comment must not be empty." : "";

    return res.render("blogs", { 
        blog, 
        comments, 
        error, 
        notice, 
        user: req.user, 
        hasLiked 
    });
};


const nextBlog = async(req, res) => {
    let blog;
    let wrapped = false;
    
    blog = await getNextBlog(req.cookies.current_blog_id); 
    if (!blog) {
        blog = await getLatestBlog();
        wrapped = true;
    }

    if (blog) {
        res.cookie("current_blog_id", blog.id)
    }

    if (wrapped) {
        res.cookie("nav_notice", "wrapped", { httpOnly: true });
    }

    return res.redirect("/blogs");
}

module.exports = {
    mainPage,
    nextBlog
}