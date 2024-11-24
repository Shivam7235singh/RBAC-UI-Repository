import React from "react";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="grid grid-cols-3 gap-4">
        <NavLink to="/admin/user-management" className="bg-blue-500 text-white p-4 rounded-lg">
          User Management
        </NavLink>
        <NavLink to="/admin/role-management" className="bg-blue-500 text-white p-4 rounded-lg">
          Role Management
        </NavLink>
        <NavLink to="/admin/permission-matrix" className="bg-blue-500 text-white p-4 rounded-lg">
          Permission Matrix
        </NavLink>
      </div>
    </div>
  );
};

export default Dashboard;
