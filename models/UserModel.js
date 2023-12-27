const mongoose = require("mongoose")
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "A user must have a firstName"],
      },
      lastName: {
        type: String,
        required: [true, "A user must have a lastname"],
      },
      email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "A user must have an email address"],
        validate: [validator.isEmail, "A user must provide a valid email address"],
      },
      password: {
        type: String,
        required: [true, "A user must provide a password"],
        select: false,
      },
      passwordConfirm: {
        type: String,
        required: [true, "Please re-enter your password"],
        validate: {
          validator: function (el) {
            return this.password === el;
          },
          message: "Password do not match!",
        },
      },
})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel