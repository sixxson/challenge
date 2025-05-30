const {
  getAllFavorites,
  postAddFavorites,
  deleteFavorites,
} = require("../controllers/favoritesController");
const express = require("express");
const router = express.Router();

// GET all favorites
router.get("/", getAllFavorites);

// POST add to favorites
router.post("/", postAddFavorites);

// DELETE remove from favorites
router.delete("/:id", deleteFavorites);

module.exports = router;
