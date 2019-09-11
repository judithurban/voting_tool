const User = require("../models/User");
const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");

exports.findUser = async (req, res, next) => {
  //was authorization token sent with headers?
  const userToken = req.headers["authorization"];
  //check if it matches /w user from database
  const user = await User.findOne({ token: userToken });

  if (!user) {
    throw new Error(`Unknown authorization token: ${userToken}`);
  }
  //save userObject in locals for middleware to use
  res.locals.user = user;
  next();
};

exports.validateSignup = [
  sanitizeBody("firstName"),
  body("firstName", "You must supply a first name!")
    .not()
    .isEmpty(),
  sanitizeBody("lastName"),
  body("lastName", "You must supply a last name!")
    .not()
    .isEmpty(),
  body("email", "That Email is not valid!").isEmail(),
  sanitizeBody("email").normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  }),
  body("password", "Password cannot be blank!")
    .not()
    .isEmpty(),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }

    // Indicates the success of this synchronous custom validator
    return true;
  })
];
