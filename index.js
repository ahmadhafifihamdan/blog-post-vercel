const express = require("express");
const cookieParser = require("cookie-parser");
const { PORT } = require("./config/env.config");
const app = express();
const router = require("./routes/index.router");

//  View Engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/", router);

app.use((req, res) => {
    const isLoggedIn = Boolean(req.cookies?.authentication_token);

    return res.status(404).render("404", { isLoggedIn });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})