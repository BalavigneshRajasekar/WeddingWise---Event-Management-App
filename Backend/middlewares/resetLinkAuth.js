const Jwt = require("jsonwebtoken");
require("dotenv").config();

const Auth = (req, res, next) => {
  const token = req.header("Authorization");
  console.log(token);

  try {
    if (!token) {
      return res.status(401).json({ message: "Token Doesn't exist" });
    }
    const verified = Jwt.verify(token, process.env.JWTSECRET);
    req.user = verified;
    req.token = token;

    next();
  } catch (err) {
    res.status(401).json({ message: "Verification code expired" });
  }
};

module.exports = Auth;
