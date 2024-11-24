let roles = [
    { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
    { id: 2, name: "Editor", permissions: ["Read", "Write"] },
    { id: 3, name: "Viewer", permissions: ["Read"] },
  ];
  
  let permissions = ["Read", "Write", "Delete"];
  
  const simulateApiCall = (data, delay = 500) => {
    return new Promise((resolve) => setTimeout(() => resolve(data), delay));
  };
  
  export const getRoles = async () => simulateApiCall(roles);
  
  export const getPermissions = async () => simulateApiCall(permissions);
  
  export const getRoleById = async (id) => {
    const role = roles.find((role) => role.id === id);
    if (!role) throw new Error("Role not found");
    return simulateApiCall(role);
  };
  
  export const createRole = async (newRole) => {
    newRole.id = roles.length + 1;
    roles.push(newRole);
    return simulateApiCall(newRole);
  };
  
  export const updateRole = async (id, updatedData) => {
    const roleIndex = roles.findIndex((role) => role.id === id);
    if (roleIndex === -1) throw new Error("Role not found");
    roles[roleIndex] = { ...roles[roleIndex], ...updatedData };
    return simulateApiCall(roles[roleIndex]);
  };
  
  export const deleteRole = async (id) => {
    const roleIndex = roles.findIndex((role) => role.id === id);
    if (roleIndex === -1) throw new Error("Role not found");
    const [deletedRole] = roles.splice(roleIndex, 1);
    return simulateApiCall(deletedRole);
  };
  
  export const updateRolePermissions = async (roleId, newPermissions) => {
    const roleIndex = roles.findIndex((role) => role.id === roleId);
    if (roleIndex === -1) throw new Error("Role not found");
    roles[roleIndex].permissions = newPermissions;
  
    // Dynamically update the global permission list if necessary
    newPermissions.forEach((permission) => {
      if (!permissions.includes(permission)) {
        permissions.push(permission);  // Add new permission if not already in the list
      }
    });
  
    return simulateApiCall(roles[roleIndex]);
  };
  