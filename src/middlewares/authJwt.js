const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (request, response, next) => {
  let token = request.headers["x-access-token"];

  if (!token) {
    return response.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return response.status(401).send({ message: "Token expired" });
    }

    request.userId = decoded.id;
    request.userRoles = decoded.roles;
    next();
  });
};

const isAdmin = async (request, response, next) => {
  try {
    const user = await User.findById(request.userId);

    if (!user) {
      return response.status(404).send({ message: "User not found" });
    }

    const roles = await Role.find({ _id: { $in: user.roles } });

    const isAdmin = roles.some(role => role.name === "admin");

    if (!isAdmin) {
      return response.status(403).send({ message: "Admin Role is required" });
    }

    next();
  } catch (err) {
    console.error("isAdmin error:", err);
    response.status(500).send({ message: "Internal server error" });
  }
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;
