const mongoose = require("mongoose");

const FavoriteUserSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  login: String,
  avatar_url: String,
  html_url: String,
});

module.exports = mongoose.model("FavoriteUser", FavoriteUserSchema);
