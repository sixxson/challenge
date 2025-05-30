const FavoriteUser = require("../services/FavoriteUser");

const getUserProfile = async (req, res) => {
  const { phone_number } = req.query;

  if (!phone_number) {
    return res.status(400).json({ error: "Missing phone_number" });
  }

  try {
    const favorites = await FavoriteUser.find({ userPhone: phone_number });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Error fetching favorites" });
  }
};

const postLikeGithubUser = async (req, res) => {
  const { id, login, avatar_url, html_url, phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ error: "Missing phone_number" });
  }

  try {
    const exists = await FavoriteUser.findOne({ userPhone: phone_number, id });
    if (exists) {
      return res.status(400).json({ error: "User already favorited" });
    }

    const favUser = new FavoriteUser({
      userPhone: phone_number,
      id,
      login,
      avatar_url,
      html_url,
    });

    await favUser.save();
    res.status(201).json(favUser);
  } catch (err) {
    res.status(500).json({ error: "Error adding to favorites" });
  }
};

const deleteFavorites = async (req, res) => {
  const { phone_number } = req.query;
  const githubId = req.params.id;

  if (!phone_number) {
    return res.status(400).json({ error: "Missing phone_number" });
  }

  try {
    const result = await FavoriteUser.deleteOne({
      userPhone: phone_number,
      id: githubId,
    });
    res.json({ success: true, deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Error deleting favorite" });
  }
};


module.exports = {
  getUserProfile,
  postLikeGithubUser,
  deleteFavorites,
};
