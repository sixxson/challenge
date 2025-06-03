// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone_number: { type: String, required: true, unique: true },
  favorite_github_users: [
    {
      id: Number,
      login: String,
      avatar_url: String,
      html_url: String,
      public_repos: Number,
      followers: Number,
    }
  ],
});

module.exports = mongoose.model("User", userSchema);
