const config = require("../config/auth.config");
const db = require("../models");
const validatePassword = require("../utils/passwordValidator")
const User = db.user;
const Role = db.role;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (request, response) => {
  try {
    const userss = request.username
    console.log(userss)
    const { username, email, password, roles } = request.body;
    
    const validation = validatePassword(password);
    if (!validation.valid) {
      return response.status(400).send({ message: validation.message });
    }

    let assignedRoles = [];

    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ name: { $in: roles } });

      if (foundRoles.length === 0) {
        return response.status(400).send({ message: "No valid roles found." });
      }

      assignedRoles = foundRoles.map(role => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: "user" });
      if (!defaultRole) {
        return response.status(500).send({ message: "Default role not found." });
      }
      assignedRoles = [defaultRole._id];
    }

    const user = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
      roles: assignedRoles
    });

    await user.save();

    response.status(201).send({ message: "User was registered successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    response.status(500).send({ message: "Internal server error during signup." });
  }
};

exports.signin = async (request, response) => {
  try {
    const { username, password } = request.body;
    if(!username || !password){
      return response.status(404).send({message: "Username and password are required to signin"})
    }

    const user = await User.findOne({ username }).populate("roles", "-__v");

    if (!user) {
      return response.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return response.status(401).send({
        accessToken: null,
        message: "Invalid password!"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      config.secret,
      { expiresIn: "1d" }
    );

    // const roles = user.roles.map(role => "ROLE_" + role.name.toUpperCase());

    response.status(200).send({
      message: "Signed in successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      roles:user.roles[0].name,
      accessToken: token
    });
  } catch (err) {
    console.error("Signin error:", err);
    response.status(500).send({ message: "Internal server error during signin." });
  }
};

exports.getAllUsers = async (request, response) => {
  try {
    const users = await User.find().populate("roles", "-__v");
    console.log("users",users)
    const formattedUsers = users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles.map(role => role.name)
    }));

    response.status(200).send(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    response.status(500).send({
      message: error.message || "An error occurred while retrieving users."
    });
  }
};

exports.deleteUsers = async (request,response) => {
  const userId = request.params.id
   try {
    const deletedReview = await User.findByIdAndDelete(userId);

    if (!deletedReview) {
      return response.status(404).json({ message: 'User not found.' });
    }

    response.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting User:', error);
    response.status(500).json({ message: 'Server error while deleting user.' });
  }
}

exports.editUsers = async (request, response) => {
  const userId = request.params.id;

  try {
    if (!userId || !request.body) {
      return response.status(400).send({ message: "Invalid request data" });
    }

     const updateFields = {};

    for (const key of Object.keys(request.body)) {
      updateFields[key] = request.body[key];
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields
    );

    if (!updatedUser) {
      return response.status(404).send({ message: "User not found" });
    }

    response.status(200).send(updatedUser);
  } catch (error) {
    response.status(500).send({
      message: error.message || "Error updating user"
    });
  }
};





