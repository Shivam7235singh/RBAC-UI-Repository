import React, { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../mock-api/UserApi";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "", status: "" });

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Handle user creation
  const handleCreate = async () => {
    const newUser = { name: "New User", email: "new@example.com", role: "Editor", status: "Active" };
    try {
      const createdUser = await createUser(newUser);
      setUsers([...users, createdUser]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Handle user update
  const handleUpdate = async (id) => {
    try {
      const updatedUser = await updateUser(id, formData);
      setUsers(users.map((user) => (user.id === id ? updatedUser : user)));
      setEditingUser(null); // Reset editing state
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Open the form to edit a user
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({ name: user.name, email: user.email, role: user.role, status: user.status });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      
      {/* Button to create a new user */}
      <button
        onClick={handleCreate}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create New User
      </button>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div>
          {/* User Update Form */}
          {editingUser && (
            <div className="mb-4 p-4 bg-gray-100 rounded-md shadow-md">
              <h3 className="text-xl font-semibold mb-2">Update User</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(editingUser);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="role" className="mb-1">Role</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="status" className="mb-1">Status</label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Update User
                </button>
              </form>
            </div>
          )}

          {/* User Table */}
          <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300">Name</th>
                <th className="px-4 py-2 border border-gray-300">Email</th>
                <th className="px-4 py-2 border border-gray-300">Role</th>
                <th className="px-4 py-2 border border-gray-300">Status</th>
                <th className="px-4 py-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="odd:bg-gray-50 even:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300">{user.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.email}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.role}</td>
                  <td className="px-4 py-2 border border-gray-300">{user.status}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="ml-2 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
