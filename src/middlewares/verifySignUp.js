const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

// Check for duplicate username or email
const checkForUsernameOrEmail = async (request, response, next) => {
    try {
        if (!request.body.username) {
            return response.status(400).send({ message: "Username is required to signup" })
        }
        if (!request.body.password) {
            return response.status(400).send({ message: "Password is required to signup" })
        }
        if (!request.body.email) {
            return response.status(400).send({ message: "Email is required to signup" })
        }
        if (!request.body.roles) {
            return response.status(400).send({ message: "Role is required to signup" })
        }
        const existingUsername = await User.findOne({ username: request.body.username });
        if (existingUsername) {
            return response.status(400).send({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email: request.body.email });
        if (existingEmail) {
            return response.status(400).send({ message: "Email already exists" });
        }

        next();
    } catch (err) {
        console.error("Error checking username/email:", err);
        response.status(500).send({ message: "Internal server error" });
    }
};

//check for duplicate username or email while updating
const checkForDuplicateUsernameorEmail = async (request, response, next) => {
    console.log(request.body)
    try {
        if (request.body.username) {
            const existingUsername = await User.findOne({ username: request.body.username });
            if (existingUsername) {
                return response.status(400).send({ message: "Username already exists" });
            }
        }
        if (request.body.email) {
            const existingEmail = await User.findOne({ email: request.body.email });
            if (existingEmail) {
                return response.status(400).send({ message: "Email already exists" });
            }
        }
        next()
    } catch (error) {
        console.error("Error checking for username:", error);
        response.status(500).send({ message: "Internal Server error" })
    }
}


const verifySignUp = {
    checkForUsernameOrEmail,
    checkForDuplicateUsernameorEmail,
};

module.exports = verifySignUp;
