const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        res.status(401);
        throw new Error("Not authorized.");
      }
      req.user = user.id;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
