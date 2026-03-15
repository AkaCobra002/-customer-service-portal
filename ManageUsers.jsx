import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { getUser } from "../../api/client";

const ManageUsers = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    fullName: "",
    emailAddress: "",
    username: "",
    phoneNumber: "",
    status: "Active",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user = await getUser(userId);
        if (cancelled) return;
        setUserData({
          fullName: user.name || "",
          emailAddress: user.email || "",
          username: user.username || "",
          phoneNumber: user.phoneNumber || "",
          status: user.status || "Active",
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleBack = () => navigate("/users");
  const handleEditUser = () => navigate(`/users/edit/${userId}`);
  const handleDeleteUser = () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      navigate("/users");
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-cyan-400";

  return (
    <div className="h-full min-h-0 bg-[#F6F8FB] px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={handleBack}
            className="hover:bg-gray-200 rounded-full p-1"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        </div>
        <div className="text-sm text-gray-400 ml-10">Dashboard / Users</div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl p-10 w-full mx-auto">
        <div className="space-y-6 w-full">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={userData.fullName}
              onChange={(e) =>
                setUserData({ ...userData, fullName: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={userData.emailAddress}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  emailAddress: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userData.username}
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                🇬🇧
              </span>
              <input
                type="tel"
                value={userData.phoneNumber}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    phoneNumber: e.target.value,
                  })
                }
                className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Status — longer + dropdown arrow */}
          <div className="max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <select
                value={userData.status}
                onChange={(e) =>
                  setUserData({ ...userData, status: e.target.value })
                }
                className="w-full appearance-none px-4 py-3 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
                <option>Disabled</option>
                <option>Suspended</option>
              </select>

              {/* Active pill */}
              {userData.status === "Active" && (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md pointer-events-none">
                  Active
                </span>
              )}

              {/* Dropdown arrow */}
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-12">
          <button
            onClick={handleEditUser}
            className="px-6 py-2.5 bg-[#2FA4C7] text-white text-sm font-medium rounded-lg"
          >
            EDIT USER
          </button>
          <button
            onClick={handleDeleteUser}
            className="px-6 py-2.5 border border-gray-200 text-sm font-medium rounded-lg text-gray-700"
          >
            DELETE USER
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
