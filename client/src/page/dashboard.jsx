import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [favorites, setFavorites] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/favorites");
        const data = await res.json();
        setFavorites(data);
      } catch (err) {
        console.error("Lỗi tải favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <h2 className="text-xl font-semibold mb-3">
        ⭐ Hồ sơ GitHub đã yêu thích:
      </h2>

      {favorites.length === 0 ? (
        <p>Chưa có hồ sơ nào được yêu thích.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-50"
            >
              <img
                src={user.avatar_url}
                className="w-16 h-16 rounded-full mb-2"
                alt={user.login}
              />
              <h3 className="font-bold">{user.login}</h3>
              <p>ID: {user.id}</p>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline mt-2 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                Xem trên GitHub
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {showPopup && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>
            <div className="flex flex-col items-center">
              <img
                src={selectedUser.avatar_url}
                className="w-20 h-20 rounded-full mb-4"
                alt={selectedUser.login}
              />
              <h2 className="text-xl font-bold mb-2">{selectedUser.login}</h2>
              <p>ID: {selectedUser.id}</p>
              <p>Public Repos: {selectedUser.public_repos}</p>
              <p>Followers: {selectedUser.followers}</p>
              <a
                href={selectedUser.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline mt-2"
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
