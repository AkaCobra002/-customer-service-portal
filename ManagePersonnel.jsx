import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getPersonnelMember } from "../../api/client";

const ManagePersonnel = () => {
  const navigate = useNavigate();
  const { personnelId } = useParams();
  const isNew = personnelId === "new";

  // Mock user data - in real app, fetch based on personnelId
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    role: "Admin",
    status: "Active",
    birthMonth: "September",
    birthDay: "20",
    birthYear: "2001",
    workEmail: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isNew) return;
      try {
        const p = await getPersonnelMember(personnelId);
        if (cancelled) return;
        setFormData((prev) => ({
          ...prev,
          fullName: p.fullName || "",
          phoneNumber: p.phone || "",
          role: p.permissionLevel || prev.role,
          status: p.status || prev.status,
          workEmail: p.email || "",
        }));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isNew, personnelId]);

  const roles = ["Admin", "Manager", "Agent", "Asst. Admin"];
  const statuses = ["Active", "Inactive"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 80 }, (_, i) => 2024 - i);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePrimaryAction = () => {
    if (isNew) {
      // No create endpoint wired yet; keep flow consistent with other mock screens.
      navigate("/personnel");
      return;
    }

    navigate(`/personnel/edit/${personnelId}`);
  };

  const handleDeleteUser = () => {
    if (isNew) return;
    // Handle delete user logic here
    if (window.confirm("Are you sure you want to delete this user?")) {
      console.log("Deleting user:", personnelId);
      navigate("/personnel");
    }
  };

  return (
    <div className="h-full min-h-0 bg-[#F5F7FA] p-6 lg:p-12">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/personnel")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={24} />
          <h1 className="text-3xl font-semibold text-gray-900">
            {isNew ? "Add New Admin" : formData.fullName || "Manage Personnel"}
          </h1>
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hover:text-gray-700 cursor-pointer">Dashboard</span>
          <span>/</span>
          <span className="hover:text-gray-700 cursor-pointer">
            Personnel List
          </span>
          <span>/</span>
          <span className="text-gray-900 font-medium">Manage Personnel</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-xl">🇬🇧</span>
              </div>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Role and Status - Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />

                {/* Status Badge Preview */}
                {formData.status === "Active" && (
                  <div className="absolute right-16 top-1/2 -translate-y-1/2">
                    <span className="inline-block px-4 py-1 rounded-md text-xs font-medium bg-[#ADD0AE] text-[#135D47] border border-[#135D47]">
                      Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Birth Date
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* Month */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Month<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => handleChange("birthMonth", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Day */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Day<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.birthDay}
                    onChange={(e) => handleChange("birthDay", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Year<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.birthYear}
                    onChange={(e) => handleChange("birthYear", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Work Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.workEmail}
              onChange={(e) => handleChange("workEmail", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            {!isNew && (
              <button
                onClick={handleDeleteUser}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                DELETE USER
              </button>
            )}
            <button
              onClick={handlePrimaryAction}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
            >
              {isNew ? "CREATE USER" : "EDIT USER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePersonnel;
