import React, { useState, useEffect } from "react";
import { getRoles, getPermissions, updateRolePermissions } from "../../mock-api/RoleApi";

const PermissionMatrix = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch roles and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesData = await getRoles();
        const permissionsData = await getPermissions();
        
        // Initialize permission matrix with roles and permissions
        const initialMatrix = rolesData.reduce((acc, role) => {
          acc[role.id] = permissionsData.reduce((permAcc, permission) => {
            permAcc[permission] = role.permissions.includes(permission);
            return permAcc;
          }, {});
          return acc;
        }, {});

        setRoles(rolesData);
        setPermissions(permissionsData);
        setMatrix(initialMatrix);
      } catch (error) {
        console.error("Error fetching roles or permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle permission toggle
  const handlePermissionToggle = (roleId, permission) => {
    setMatrix((prevMatrix) => {
      const newMatrix = { ...prevMatrix };
      newMatrix[roleId][permission] = !newMatrix[roleId][permission]; // Toggle the permission
      return newMatrix;
    });
  };

  // Handle save action for updating permissions
  const handleSave = async () => {
    try {
      for (const roleId in matrix) {
        const updatedPermissions = Object.keys(matrix[roleId]).filter(
          (perm) => matrix[roleId][perm]
        );
        await updateRolePermissions(roleId, updatedPermissions);
      }
      alert("Permissions updated successfully.");
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update permissions.");
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">Manage Permissions</h3>

      {loading ? (
        <p>Loading roles and permissions...</p>
      ) : (
        <div>
          {/* Permission Matrix Table */}
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border border-gray-300">Role</th>
                {permissions.map((permission) => (
                  <th key={permission} className="px-4 py-2 border border-gray-300">{permission}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id} className="odd:bg-gray-50 even:bg-gray-100">
                  <td className="px-4 py-2 border border-gray-300">{role.name}</td>
                  {permissions.map((permission) => (
                    <td key={permission} className="px-4 py-2 border border-gray-300">
                      <input
                        type="checkbox"
                        checked={matrix[role.id][permission]}
                        onChange={() => handlePermissionToggle(role.id, permission)}
                        className="form-checkbox"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Save Changes Button */}
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionMatrix;
