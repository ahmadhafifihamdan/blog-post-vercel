const asyncHandler = require("express-async-handler");
const { auth } = require("../config/firebase");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const jwt = require("jsonwebtoken");
const { JWT_AUTH_TOKEN } = require("../config/env.config");
const { clearAuthCookies } = require("../middleware/auth.middleware");

const signUpPage = (req, res) => {
    res.render("auth/signup", {
        error: "",
        email: ""
    });
}

const loginPage = (req, res) => {
    const success = req.query.registered === "1" ? "Registration successful. Please log in." : "";
    
    res.render("auth/login", {
        error: "",
        success,
        email: ""
    });
}

const registerUserHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("auth/signup", {
            error: "Email and password are required.",
            email
        });
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);

        return res.redirect("/auth/login?registered=1");

    } catch (error) {
        let message = "Unable to create account. Please check your details.";

        if (error.code === "auth/email-already-in-use") {
            message = "Email already registered. Please log in.";
        }

        if (error.code && error.code.startsWith("auth/")) {
            return res.status(400).render("auth/signup", {
                error: message,
                email
            });
        }

        // Unexpected error
        console.error("Signup error:", error);
        return res.status(500).render("auth/signup", {
            error: "Something went wrong. Please try again.",
            email
        });
    }
});


const loginUserHandler = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("auth/login", { error: "Email and password are required.", email });
    }
    
    if (!JWT_AUTH_TOKEN) {
        console.error("JWT_AUTH_TOKEN missing");
        return res.status(500).render("auth/login", {
            error: "Service temporarily unavailable. Please try again later."
        });
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);

        const authentication_token = jwt.sign(
            { email },
            JWT_AUTH_TOKEN,
            { expiresIn: "30m" }
        );

        res.cookie("authentication_token", authentication_token, { httpOnly: true });
        return res.redirect("/blogs");

    } catch (error) {
        // Any auth-related failure
        if (error.code && error.code.startsWith("auth/")) {
            return res.status(400).render("auth/login", {
                error: "Invalid email or password.",
                email
            });
        }

        // Unexpected error
        console.error("Login error:", error);
        return res.status(500).render("auth/login", {
            error: "Something went wrong. Please try again.",
            email
        });
    }

});

const logoutHandler = (req, res) => {
    clearAuthCookies(res);
    return res.redirect("/auth/login");
}

module.exports = { 
    signUpPage, 
    registerUserHandler,
    loginPage,
    loginUserHandler,
    logoutHandler
};