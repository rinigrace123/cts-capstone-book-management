
module.exports = function validatePassword(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (typeof password !== "string") {
    return { valid: false, message: "Password must be a string." };
  }

  if (password.length < minLength) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }

  if (!hasNumber.test(password)) {
    return { valid: false, message: "Password must contain at least one number." };
  }

  if (!hasSpecialChar.test(password)) {
    return { valid: false, message: "Password must contain at least one special character." };
  }

  return { valid: true };
};
