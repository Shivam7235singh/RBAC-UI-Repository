import React, { useState, useEffect } from "react";
import PermissionMatrix from "./PermissionMatrix";
import { getRoles, getPermissions, createRole, updateRole, deleteRole } from "../../mock-api/RoleApi";

const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] });
  const [loading, setLoading] = useState(true);

  // Fetch roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await getRoles();
        const permissionsData = await getPermissions();
        setRoles(rolesData);
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error fetching roles or permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle new role creation
  const handleCreateRole = async () => {
    if (newRole.name) {
      try {
        const createdRole = await createRole(newRole);
        setRoles([...roles, createdRole]);
        setNewRole({ name: "", permissions: [] });
      } catch (error) {
        console.error("Error creating role:", error);
      }
    }
  };

  // Handle role edit
  const handleEditRole = async (id, updatedRole) => {
    try {
      const updated = await updateRole(id, updatedRole);
      setRoles(roles.map(role => (role.id === id ? updated : role)));
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  // Handle role delete
  const handleDeleteRole = async (id) => {
    try {
      await deleteRole(id);
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error("Error deleting role:", error);
    }
  };

  // Handle permission update for the new role
  const handlePermissionChange = (permission) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((perm) => perm !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Role Management</h2>

      {loading ? (
        <p>Loading roles and permissions...</p>
      ) : (
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold">Create New Role</h3>
            <input
              type="text"
              className="border px-4 py-2 mt-2 w-full"
              placeholder="Role name"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            />
            <div className="mt-2">
              {permissions.map((permission) => (
                <label key={permission} className="inline-block mr-4">
                  <input
                    type="checkbox"
                    checked={newRole.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="mr-1"
                  />
                  {permission}
                </label>
              ))}
            </div>
            <button
              onClick={handleCreateRole}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
            >
              Create Role
            </button>
          </div>

          <h3 className="text-xl font-semibold mb-4">Existing Roles</h3>
          <ul>
            {roles.map((role) => (
              <li key={role.id} className="mb-2">
                <div className="flex items-center justify-between">
                  <span>{role.name}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditRole(role.id, { name: role.name, permissions: role.permissions })}
                      className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <span>Permissions: {role.permissions.join(", ")}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RoleManager;
