import { LayoutGrid, LayoutList } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [favorites, setFavorites] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 👉 NEW
  const phone = localStorage.getItem("phone");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!phone) return;
      try {
        const res = await fetch(
          `http://localhost:5000/api/favorites?phone_number=${phone}`
        );
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Lỗi tải favorites:", err);
      }
    };
    fetchFavorites();
  }, [phone]);

  const handleUserClick = async (id) => {
    try {
      const res = await fetch(`https://api.github.com/user/${id}`);
      const data = await res.json();
      setSelectedUser(data);
      setShowPopup(true);
    } catch (err) {
      console.error("Lỗi khi fetch chi tiết user:", err);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };

  const isFavorited = (id) => favorites.some((u) => u.id === id);

  const toggleFavorite = async (user) => {
    try {
      if (isFavorited(user.id)) {
        await fetch(
          `http://localhost:5000/api/favorites/${user.id}?phone_number=${phone}`,
          {
            method: "DELETE",
          }
        );
        setFavorites(favorites.filter((fav) => fav.id !== user.id));
      } else {
        await fetch("http://localhost:5000/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: phone,
            id: user.id,
            login: user.login,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
          }),
        });
        setFavorites([...favorites, user]);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật yêu thích:", err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {viewMode === "grid" ? <LayoutList /> : <LayoutGrid />}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        ⭐ Hồ sơ GitHub đã yêu thích
      </h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">Chưa có hồ sơ nào được yêu thích.</p>
      ) : viewMode === "grid" ? (
        // ✅ Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="p-4 bg-white shadow-md rounded-xl cursor-pointer transition hover:shadow-lg relative"
            >
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-16 h-16 rounded-full border-2 border-gray-300 mb-3"
              />
              <h3 className="font-semibold text-gray-800">{user.login}</h3>
              <p className="text-sm text-gray-500">ID: {user.id}</p>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm underline mt-2 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                Xem trên GitHub
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(user);
                }}
                className="absolute top-3 right-3 text-2xl hover:scale-110 transition"
              >
                {isFavorited(user.id) ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        // ✅ Table View
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="px-4 py-2">Avatar</th>
                <th className="px-4 py-2">Login</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Link</th>
                <th className="px-4 py-2">❤️</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleUserClick(user.id)}
                >
                  <td className="px-4 py-2">
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>
                  <td className="px-4 py-2">{user.login}</td>
                  <td className="px-4 py-2">{user.id}</td>
                  <td className="px-4 py-2">
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 underline"
                    >
                      GitHub
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(user);
                      }}
                      className="text-xl"
                    >
                      {isFavorited(user.id) ? "❤️" : "🤍"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup */}
      {showPopup && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative animate-fadeIn">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <div className="text-center">
              <img
                src={selectedUser.avatar_url}
                alt={selectedUser.login}
                className="w-24 h-24 rounded-full mx-auto mb-4 border"
              />
              <h2 className="text-xl font-bold text-gray-800">
                {selectedUser.login}
              </h2>
              <p className="text-gray-600">ID: {selectedUser.id}</p>
              <p className="text-gray-600">
                Public Repos: {selectedUser.public_repos}
              </p>
              <p className="text-gray-600">
                Followers: {selectedUser.followers}
              </p>
              <a
                href={selectedUser.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline mt-2 inline-block"
              >
                Xem trên GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
