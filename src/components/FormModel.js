import React, { useEffect, useState } from "react";

const FormModel = ({
  title,
  isOpen,
  onClose,
  onSubmit,
  initialData = { roleName: "", permissions: [] },
  availablePermissions = [],
}) => {
  const [roleName, setRoleName] = useState(initialData.roleName || "");
  const [permissions, setPermissions] = useState(initialData.permissions || []);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRoleName(initialData.roleName || "");
      setPermissions(initialData.permissions || []);
    }
  }, [isOpen, initialData]);

  const handleTogglePermission = (permission) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((perm) => perm !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const handleSubmit = () => {
    if (!roleName.trim()) {
      setError("Role name is required");
      return;
    }
    onSubmit({ roleName, permissions });
    setError("");
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{title}</h2>

            {error && <p className="text-red-500 mb-3">{error}</p>}

            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {availablePermissions.map((permission) => (
                  <label
                    key={permission}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      onChange={() => handleTogglePermission(permission)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-800">{permission}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModel;
