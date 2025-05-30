const mongoose = require("mongoose");

const FavoriteUserSchema = new mongoose.Schema({
  userPhone: { type: String, required: true }, // 💡 gắn user theo số điện thoại
  id: { type: Number },
  login: String,
  avatar_url: String,
  html_url: String,
});

FavoriteUserSchema.index({ userPhone: 1, id: 1 }, { unique: true }); // ngăn người dùng thích trùng user

module.exports = mongoose.model("FavoriteUser", FavoriteUserSchema);
