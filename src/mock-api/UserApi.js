// src/mock-api/userApi.js

const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Inactive" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", role: "Viewer", status: "Active" },
  ];
  
  // Simulate a delay for mock API calls
  const simulateApiCall = (data, delay = 500) => {
    return new Promise((resolve) => setTimeout(() => resolve(data), delay));
  };
  
  // CRUD operations
  export const getUsers = async () => simulateApiCall(users);
  export const getUserById = async (id) => simulateApiCall(users.find((user) => user.id === id));
  export const createUser = async (newUser) => {
    newUser.id = users.length + 1;
    users.push(newUser);
    return simulateApiCall(newUser);
  };
  export const updateUser = async (id, updatedData) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    users[userIndex] = { ...users[userIndex], ...updatedData };
    return simulateApiCall(users[userIndex]);
  };
  export const deleteUser = async (id) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) throw new Error("User not found");
    const [deletedUser] = users.splice(userIndex, 1);
    return simulateApiCall(deletedUser);
  };
  