// const axios = require("axios");

async function findGithubUserProfile(id) {
  const res = await fetch(`https://api.github.com/user/${id}`);
  const { login, id: userId, avatar_url, html_url, public_repos, followers } = res.data;

  return {
    login,
    id: userId,
    avatar_url,
    html_url,
    public_repos,
    followers,
  };
}

module.exports = findGithubUserProfile;
