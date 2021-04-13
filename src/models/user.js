// imports
const mongoose = require("mongoose");

// schema
const userSchema = mongoose.Schema({
   username: {
      type: String,
      required: true,
      trim: true,
   },
   password: {
      type: String,
      required: true,
      trim: true,
   },
   email: {
      type: String,
      required: true,
      trim: true,
   },
   emailtoken: {
      type: String,
      required: true,
   },
   emailconfirm: {
      type: Boolean,
      required: true,
      default: false,
   }
}, {timestamps: true});

// export
module.exports = mongoose.model("User", userSchema);