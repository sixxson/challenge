const express = require("express");
const router = express.Router();
const FavoriteUser = require("../models/FavoriteUser");

// GET all favorites
router.get("/", async (req, res) => {
  try {
    const favorites = await FavoriteUser.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Error fetching favorites" });
  }
});

// POST add to favorites
router.post("/", async (req, res) => {
  const { id, login, avatar_url, html_url } = req.body;

  try {
    const exists = await FavoriteUser.findOne({ id });
    if (exists) {
      return res.status(400).json({ error: "User already favorited" });
    }

    const favUser = new FavoriteUser({ id, login, avatar_url, html_url });
    await favUser.save();
    res.status(201).json(favUser);
  } catch (err) {
    res.status(500).json({ error: "Error adding to favorites" });
  }
});

// DELETE remove from favorites
router.delete("/:id", async (req, res) => {
  try {
    const result = await FavoriteUser.deleteOne({ id: req.params.id });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Error deleting favorite" });
  }
});

module.exports = router;
