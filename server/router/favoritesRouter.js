const {
  getUserProfile,
  postLikeGithubUser,
  deleteFavorites,
} = require("../controllers/favoritesController");
const express = require("express");
const router = express.Router();

// GET all favorites
router.get("/", getUserProfile);

// POST add to favorites
router.post("/", postLikeGithubUser);

// DELETE remove from favorites
router.delete("/:id", deleteFavorites);

module.exports = router;
