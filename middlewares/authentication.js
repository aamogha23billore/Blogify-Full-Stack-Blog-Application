const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    // Ensure req.user exists and is null by default
    req.user = null;

    const token = req.cookies?.[cookieName];
    if (!token) return next(); // no cookie → continue without user

    try {
      // validateToken should throw on invalid/expired token
      const payload = validateToken(token);
      // attach payload to the request for downstream handlers
      req.user = payload;

      // also expose to templates (optional, convenient for EJS)
      res.locals.user = payload;
    } catch (err) {
      // invalid token: treat as not authenticated, but do NOT crash
      req.user = null;
      res.locals.user = null;
      // optionally: console.error("Invalid token", err.message);
    }

    return next();
  };
}

module.exports = { checkForAuthenticationCookie };
