module.exports = function validatePassword(password) {
  const minLength = 8;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  const hasWhitespace = /\s/;
  const hasLowercase = /[a-z]/;
  const hasUppercase = /[A-Z]/;

  if (password.length < minLength) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }

  if (!hasNumber.test(password)) {
    return { valid: false, message: "Password must contain at least one number." };
  }

  if (!hasSpecialChar.test(password)) {
    return { valid: false, message: "Password must contain at least one special character." };
  }

  if (hasWhitespace.test(password)) {
    return { valid: false, message: "Password should not contain white spaces." };
  }

  if (!hasLowercase.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter." };
  }

  if (!hasUppercase.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter." };
  }

  return { valid: true };
};
