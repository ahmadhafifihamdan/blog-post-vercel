const jwt = require("jsonwebtoken");
const { JWT_AUTH_TOKEN } = require("../config/env.config");

// Helper function to clear cookies
function clearAuthCookies(res) {
  res.clearCookie("authentication_token", { path: "/" });
  res.clearCookie("current_blog_id", { path: "/" });
}

const protect =  async (req, res, next) => {
    try {
        const token = req.cookies.authentication_token;
        if (!token) {
            // redirect to login if no token
            clearAuthCookies(res);
            return res.redirect("/auth/login");
        }
        
        // verify token
        const decoded = jwt.verify(token, JWT_AUTH_TOKEN);
        
        // attach decoded to req.user
        req.user = decoded;
        return next();
    } catch (err) {
        // redirect to login if failed to verify token
        clearAuthCookies(res);
        return res.redirect("/auth/login");
    }
}

const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.authentication_token;

  // No token → user is not logged in → allow access
  if (!token) {
    return next();
  }

  try {
    // Try to verify token
    jwt.verify(token, JWT_AUTH_TOKEN);
        // Token valid → user is authenticated → redirect away from login/signup
    return res.redirect("/blogs");
  } catch (err) {
    // Token invalid/expired → clean up and allow access
    clearAuthCookies(res);
    return next();
  }
};

module.exports = { protect, redirectIfAuthenticated, clearAuthCookies };
