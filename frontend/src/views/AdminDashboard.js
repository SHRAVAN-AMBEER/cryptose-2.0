"use client";
import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsersAndMembers();
  }, []);

  const fetchUsersAndMembers = async () => {
    try {
      const userRes = await fetch("http://localhost:5000/get/users");
      const memberRes = await fetch("http://localhost:5000/get/members");

      const usersData = await userRes.json();
      const membersData = await memberRes.json();

      const formattedUsers = usersData.map((user) => ({
        id: user._id?.$oid || user._id,  // for BSON or plain object fallback
        name: user.username,
        role: "User",
        status: "Active",
      }));

      const formattedMembers = membersData.map((member) => ({
        id: member._id?.$oid || member._id,
        name: member.username,
        role: "Member",
        status: "Active",
      }));

      setUsers([...formattedUsers, ...formattedMembers]);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  const promoteUser = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/promote/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchUsersAndMembers();
      }
    } catch (error) {
      console.error("Promotion failed:", error);
    }
  };

  const demoteMember = async (id) => {
    try {
      const res = await fetch("http://localhost:5000/demote/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchUsersAndMembers();
      }
    } catch (error) {
      console.error("Demotion failed:", error);
    }
  };

  const deleteUser = async (id, role) => {
    try {
      const res = await fetch(`http://localhost:5000/delete/${role.toLowerCase()}/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        fetchUsersAndMembers();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-lg text-gray-400 mt-2">Manage Users & Members</p>

      <input
        type="text"
        placeholder="🔍 Search user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-lg px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 mt-6"
      />

      <div className="w-full max-w-4xl mt-6">
        <table className="w-full bg-gray-800 text-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-600 hover:bg-gray-700 transition">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.role}</td>
                <td className="py-3 px-4 text-green-500">{user.status}</td>
                <td className="py-3 px-4 flex gap-2">
                  {user.role === "User" && (
                    <button
                      onClick={() => promoteUser(user.id)}
                      className="bg-green-500 px-3 py-2 rounded"
                    >
                      Promote
                    </button>
                  )}
                  {user.role === "Member" && (
                    <button
                      onClick={() => demoteMember(user.id)}
                      className="bg-yellow-500 px-3 py-2 rounded"
                    >
                      Demote
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(user.id, user.role)}
                    className="bg-red-500 px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-3 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
