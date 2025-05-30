import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
// import { Button } from "./ui/button";
export default function GitHubUserSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [favorites, setFavorites] = useState([]);
  const [submittedQuery, setSubmittedQuery] = useState("");

  const fetchUsers = async (search, currentPage) => {
    if (!search) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/search/users?q=${search}&page=${
          currentPage + 1
        }&per_page=${perPage}`
      );
      const data = await res.json();

      const items = data.items || [];
      setTotalPages(Math.ceil(Math.min(data.total_count, 1000) / perPage)); // GitHub API chỉ cho max 1000 kết quả

      const detailedUsers = await Promise.all(
        items.map(async (user) => {
          const res = await fetch(`https://api.github.com/users/${user.login}`);
          const detail = await res.json();
          return {
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            public_repos: detail.public_repos,
            followers: detail.followers,
          };
        })
      );

      setUsers(detailedUsers);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/favorites");
      const data = await res.json();
      setFavorites(data.map((u) => u.id)); // assuming backend returns array of users
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (user) => {
    const isFavorited = favorites.includes(user.id);
    try {
      if (isFavorited) {
        await fetch(`http://localhost:5000/api/favorites/${user.id}`, {
          method: "DELETE",
        });
        setFavorites((prev) => prev.filter((id) => id !== user.id));
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
          }),
        });
        setFavorites((prev) => [...prev, user.id]);
      }
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  //  fetchFavorites 1 lần duy nhất khi app load
  useEffect(() => {
    fetchFavorites();
  }, []);

  //  query, page, perPage cho fetchUsers
  useEffect(() => {
    if (submittedQuery) {
      fetchUsers(submittedQuery, page);
    }
  }, [submittedQuery, page, perPage]);

  const handlePageClick = ({ selected }) => {
    setPage(selected);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          GitHub User Search
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search username..."
              className="border rounded-l-md px-3 py-1 w-72"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={() => {
                setPage(0); // reset về trang đầu khi submit
                setSubmittedQuery(query);
              }}
              className="bg-green-600 text-white px-4 py-1 rounded-r-md"
            >
              <Search />
            </button>
          </div>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded-md px-2 py-1"
          >
            {/* <option value={5}>5 / page</option> */}
            <option value={9}>10 / page</option>
            <option value={15}>15 / page</option>
            <option value={20}>20 / page</option>
          </select>

          <button
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
            className="bg-blue-600 text-white px-4 py-1 rounded-md"
          >
            {viewMode === "grid" ? "Table View" : "Grid View"}
          </button>
          <Link to="/dashboard">
            <img
              src="https://avatars.githubusercontent.com/u/9919?s=40"
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>
      </nav>

      <main className="p-6">
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 && query ? (
          <p>No users found.</p>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-4 rounded shadow relative"
              >
                <button
                  onClick={() => toggleFavorite(user)}
                  className="absolute top-2 right-2 text-red-500 text-xl"
                >
                  {favorites.includes(user.id) ? "❤️" : "🤍"}
                </button>

                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-16 h-16 rounded-full mx-auto"
                />
                <h2 className="text-center font-semibold text-lg mt-2">
                  {user.login}
                </h2>
                <p className="text-center text-sm text-gray-600">
                  ID: {user.id}
                </p>
                <p className="text-center text-sm">
                  Repos: {user.public_repos} | Followers: {user.followers}
                </p>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-blue-500 mt-2"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-blue-100">
                  <th className="text-left px-4 py-2">Avatar</th>
                  <th className="text-left px-4 py-2">Login</th>
                  <th className="text-left px-4 py-2">ID</th>
                  {/* <th className="text-left px-4 py-2">Repos</th>
                  <th className="text-left px-4 py-2">Followers</th> */}
                  <th className="text-left px-4 py-2">Profile</th>
                  <th className="text-center px-4 py-2">❤️</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-2">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-4 py-2">{user.login}</td>
                    <td className="px-4 py-2">{user.id}</td>
                    {/* <td className="px-4 py-2">{user.public_repos}</td>
                    <td className="px-4 py-2">{user.followers}</td> */}
                    <td className="px-4 py-2">
                      <a
                        href={user.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500"
                      >
                        View
                      </a>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => toggleFavorite(user)}
                        className="text-red-500 text-xl"
                      >
                        {favorites.includes(user.id) ? "❤️" : "🤍"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {users.length > 0 && (
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            pageCount={totalPages}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName="flex items-center justify-center mt-4 space-x-2"
            pageClassName="px-4 py-2 text-gray-700 bg-white border rounded-md hover:bg-gray-100"
            previousLinkClassName="px-4 py-2 text-gray-700 bg-white border rounded-md hover:bg-gray-100"
            nextLinkClassName="px-4 py-2 text-gray-700 bg-white border rounded-md hover:bg-gray-100"
            disabledClassName="opacity-50 cursor-not-allowed"
            activeClassName="bg-blue-500 text-white"
            forcePage={page}
          />
        )}
      </main>
    </div>
  );
}
