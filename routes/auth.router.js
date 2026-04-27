const { Router } = require("express");
const { signUpPage, registerUserHandler, loginPage, loginUserHandler, logoutHandler } = require("../controllers/auth.controller");
const { redirectIfAuthenticated } = require("../middleware/auth.middleware");

const router = Router();

// Handle root auth
router.get("/", (req, res) => {
  return res.redirect("/auth/login");
});

router.route("/signup")
    .get(redirectIfAuthenticated, signUpPage)
    .post(registerUserHandler);

router.route("/login")
    .get(redirectIfAuthenticated, loginPage)
    .post(loginUserHandler);

router.route("/logout").post(logoutHandler);
    
module.exports = router;