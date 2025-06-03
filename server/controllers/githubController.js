const fetch = require("node-fetch");
const User = require("../models/User");

const searchGithubUsers = async (req, res) => {
  const { q, page, per_page } = req.query;
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${q}&page=${page}&per_page=${per_page}`
    );
    const data = await response.json();
    res.json(data.items || []);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi tìm kiếm GitHub user", error: err.message });
  }
};

const findGithubUserProfile = async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/user/${req.params.id}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy thông tin user", error: err.message });
  }
};

// const likeGithubUser = async (req, res) => {
//   const { phone_number, github_user_id } = req.body;
//   try {
//     const response = await fetch(
//       `https://api.github.com/user/${github_user_id}`
//     );
//     const githubUser = await response.json();

//     if (!githubUser.id) {
//       return res.status(404).json({ message: "GitHub user không tồn tại" });
//     }

//     let user = await User.findOne({ phone_number });
//     if (!user) {
//       user = new User({ phone_number, favorite_github_users: [] });
//     }

//     const alreadyLiked = user.favorite_github_users.some(
//       (u) => u.id === githubUser.id
//     );
//     if (!alreadyLiked) {
//       user.favorite_github_users.push({
//         id: githubUser.id,
//         login: githubUser.login,
//         avatar_url: githubUser.avatar_url,
//         html_url: githubUser.html_url,
//         public_repos: githubUser.public_repos,
//         followers: githubUser.followers,
//       });
//       await user.save();
//     }

//     res.json({ message: "Đã thêm vào danh sách yêu thích" });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Lỗi khi thích GitHub user", error: err.message });
//   }
// };

// const getUserProfile = async (req, res) => {
//   const { phone_number } = req.query;
//   try {
//     const user = await User.findOne({ phone_number });
//     if (!user) {
//       return res.json({ favorite_github_users: [] });
//     }
//     res.json({ favorite_github_users: user.favorite_github_users });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi lấy hồ sơ user", error: err.message });
//   }
// };

module.exports = {
  searchGithubUsers,
  findGithubUserProfile,
  // likeGithubUser,
  // getUserProfile,
};
