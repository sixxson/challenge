// routes/githubRoutes.js
const express = require("express");
const {
  searchGithubUsers,
  findGithubUserProfile,
  likeGithubUser,
  getUserProfile,
} = require("../controllers/githubController");

const router = express.Router();

// GET /api/searchGithubUsers?q=abc&page=1&per_page=10
router.get("/searchGithubUsers", searchGithubUsers);

// GET /api/findGithubUserProfile/:id
router.get("/findGithubUserProfile/:id", findGithubUserProfile);

// // POST /api/likeGithubUser
// router.post("/likeGithubUser", likeGithubUser);

// // GET /api/getUserProfile?phone_number=...
// router.get("/getUserProfile", getUserProfile);

module.exports = router;
