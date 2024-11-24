import React, { useState, useEffect } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../../mock-api/RoleApi";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: "", permissions: [] });

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // Handle role deletion
  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter((role) => role.id !== id));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // Handle role creation
  const handleCreate = async () => {
    const newRole = { name: "Manager", permissions: ["Read", "Write"] };
    try {
      const createdRole = await createRole(newRole);
      setRoles([...roles, createdRole]);
    } catch (error) {
      console.error("Error creating role:", error);
    }
  };

  // Handle role update
  const handleUpdate = async (id) => {
    try {
      const updatedRole = await updateRole(id, formData);
      setRoles(roles.map((role) => (role.id === id ? updatedRole : role)));
      setEditingRole(null); // Reset editing state
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "permissions") {
      setFormData({ ...formData, permissions: value.split(",").map((perm) => perm.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Open the form to edit a role
  const handleEdit = (role) => {
    setEditingRole(role.id);
    setFormData({ name: role.name, permissions: role.permissions.join(", ") });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Role Management</h2>

      {/* Button to create a new role */}
      <button
        onClick={handleCreate}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create New Role
      </button>

      {loading ? (
        <p>Loading roles...</p>
      ) : (
        <div>
          {/* Role Update Form */}
          {editingRole && (
            <div className="mb-4 p-4 bg-gray-100 rounded-md shadow-md">
              <h3 className="text-xl font-semibold mb-2">Update Role</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(editingRole);
                }}
                className="space-y-4"
              >
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1">Role Name</label>
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
                  <label htmlFor="permissions" className="mb-1">Permissions (comma separated)</label>
                  <input
                    type="text"
                    id="permissions"
                    name="permissions"
                    value={formData.permissions.join(", ")}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Update Role
                </button>
              </form>
            </div>
          )}

          {/* Role Table */}
          <table className="min-w-full table-auto mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300">Role Name</th>
                <th className="px-4 py-2 border border-gray-300">Permissions</th>
                <th className="px-4 py-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="odd:bg-gray-50 even:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300">{role.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{role.permissions.join(", ")}</td>
                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleEdit(role)}
                      className="bg-yellow-500 text-white px-4 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
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

export default RoleManagement;
