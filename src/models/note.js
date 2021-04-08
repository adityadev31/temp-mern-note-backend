// imports
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

// schema
const noteSchema = mongoose.Schema({
   title: {
      type: String,
      required: true,
      trim: true,
   },
   content: {
      type: String,
      required: true,
      trim: true,
   },
   date: {
      type: Date,
      default: Date.now
   },
   userid: {
      type: String,
      required: true,
      trim: true,
   },
}, {timestamps: true});

// encrypting
var secret = process.env.MONGOOSE_ENCRYPTION_KEY;
noteSchema.plugin(encrypt, { secret: secret , encryptedFields: ['title', 'content']});

// export
module.exports = mongoose.model("Note", noteSchema);