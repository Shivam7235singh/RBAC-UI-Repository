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
        
        // Create a matrix with roles and permissions
        const initialMatrix = rolesData.reduce((acc, role) => {
          acc[role.id] = permissionsData.reduce((permAcc, permission) => {
            permAcc[permission] = role.permissions.includes(permission); // Set initial permissions based on role data
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
      const newMatrix = { ...prevMatrix }; // Create a copy of the previous matrix
      newMatrix[roleId] = { ...newMatrix[roleId] }; // Create a copy of the role's permissions
      newMatrix[roleId][permission] = !newMatrix[roleId][permission]; // Toggle the specific permission
      return newMatrix;
    });
  };

  // Handle save action for updating permissions
  const handleSave = async () => {
    try {
      const updatedRoles = [];

      for (const roleId in matrix) {
        const updatedPermissions = Object.keys(matrix[roleId]).filter(
          (permission) => matrix[roleId][permission] // Only include permissions that are enabled (true)
        );

        // Update the roles with new permissions
        updatedRoles.push({
          id: roleId,
          permissions: updatedPermissions,
        });

        // Call the mock API to save changes (in real-world, this would be an API request)
        await updateRolePermissions(roleId, updatedPermissions);
      }

      // Update the roles in the local state after saving
      setRoles((prevRoles) =>
        prevRoles.map((role) =>
          updatedRoles.find((updatedRole) => updatedRole.id === role.id) || role
        )
      );

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
                    <td key={permission} className="px-4 py-2 border border-gray-300 text-center">
                      <input
                        type="checkbox"
                        checked={matrix[role.id] && matrix[role.id][permission]}
                        onChange={() => handlePermissionToggle(role.id, permission)}
                        className="h-5 w-5"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Save Button */}
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
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
