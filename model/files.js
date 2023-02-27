const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const schema = mongoose.Schema
const fileSchema = new schema({
  userId: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true }
)

module.exports = mongoose.model('file', fileSchema);