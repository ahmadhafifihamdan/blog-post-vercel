const { createNewBlog } = require("../services/blog.service");
const { uploadBlogImageToStorage } = require("../services/storage.service");

const getBlogForm = (req, res) => {
    return res.render("blog-creation", { error: "", title: "", content: "", imageHeader: "", user: req.user });
}

const createBlogHandler = async (req, res) => {
    let imageUrl = '';
    let newBlogId = '';

    const body = req.body || {};
    const title = body.title || "";
    const content = body.content || "";
    const imageHeader = body.imageHeader || "";

    if (req.uploadError) {
        return res.status(req.uploadError.status).render("blog-creation", {
            error: req.uploadError.message,
            title,
            content,
            imageHeader,
        });
    }

    if (req.file) {
        try {
            const result = await uploadBlogImageToStorage(req.file);
            imageUrl = result.imageUrl;
        } catch (err) {
            return res.status(500).render("blog-creation", { error: "Image upload fail. Please try again.", title, content, imageHeader })
        }
    }

    if (!String(req.body.title || "").trim() || !String(req.body.content || "").trim()) {
        return res.status(400).render("blog-creation", { error: "Blog title and content are mandatory.", title, content, imageHeader })
    }

    try {
        newBlogId = await createNewBlog(
            {
                title,
                content,
                imageHeader: imageHeader || "",
                authorEmail: req.user.email,
                likeCount: 0,
                commentIds: [],
            },
            imageUrl);
    } catch (err) {
        return res.status(500).render("blog-creation", { error: "Blog creation failed. Please try again.", title, content, imageHeader })

    }

    return res.cookie("current_blog_id", newBlogId).redirect("/blogs");
}


module.exports = {
    getBlogForm,
    createBlogHandler
}