const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  collegeName: String,
  branch: String,
  state: String,
  category: String,
  gender: String,
  quota: String,
  year: Number,
  openingRank: Number,
  closingRank: Number
});

module.exports = mongoose.model('College', collegeSchema);
