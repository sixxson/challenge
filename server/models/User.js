const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  favorite_github_user_ids: [Number], // store github_user_id only
});

module.exports = mongoose.model("User", userSchema);
