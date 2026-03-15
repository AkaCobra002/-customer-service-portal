import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TickIcon from "../../assets/icons/Toast_Tick.svg";
import { useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../api/client";

const EditUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "Admin",
    status: "Active",
    birthMonth: "September",
    birthDay: "20",
    birthYear: "2001",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user = await getUser(userId);
        if (cancelled) return;

        const firstName =
          user.firstName || (user.name ? user.name.split(" ")[0] : "");
        const lastName =
          user.lastName ||
          (user.name ? user.name.split(" ").slice(1).join(" ") : "");

        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          role: user.role || prev.role,
          status: user.status || prev.status,
          birthMonth: user.birthMonth || prev.birthMonth,
          birthDay: user.birthDay || prev.birthDay,
          birthYear: user.birthYear || prev.birthYear,
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
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => setShowConfirmModal(true);
  const handleConfirmSave = () => {
    console.log("Save changes:", formData);
    setShowConfirmModal(false);
    showNotification("Changes saved successfully");
  };
  const handleCancelModal = () => setShowConfirmModal(false);
  const handleCancel = () => console.log("Cancel clicked");
  const handleBack = () => navigate(`/users/manage/${userId}`);
  const handleResetPassword = () =>
    showNotification("Password reset link sent to user email!");
  const handleReEnableUser = () => {
    setFormData((prev) => ({ ...prev, status: "Active" }));
    showNotification("User re-enabled successfully!");
  };

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
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  const showNotification = (message) => {
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-slideIn" : "animate-slideOut"} bg-[#636b74] text-white flex items-center gap-3 px-6 py-3 max-w-md shadow-md rounded-md`}
        >
          <img src={TickIcon} alt="tick" className="w-6 h-6" />
          <span className="text-sm">{message}</span>
        </div>
      ),
      { duration: 3000 },
    );
  };

  return (
    <div className="h-full min-h-0 bg-gray-50 p-8">
      <Toaster position="bottom-center" />

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-[24px] font-[400] text-[#0B0D0E] mb-3">
              Confirm changes
            </h2>
            <p className="text-[18px] font-[400] text-[#0B0D0E] mb-5">
              Are you sure you want to save the changes?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 px-6 py-3 bg-cyan-500 text-white font-medium rounded-md hover:bg-cyan-600 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={handleBack}
            className="hover:bg-gray-200 rounded-full p-1 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 ml-11">
          <span>Dashboard</span> <span>/</span>
          <span>User's List</span> <span>/</span>
          <span>Edit User</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-10 w-full">
        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <span className="text-xl">🇬🇧</span>
              </div>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white cursor-pointer"
                >
                  <option>Admin</option>
                  <option>User</option>
                  <option>Guest</option>
                  <option>Moderator</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white cursor-pointer"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                  <option>Disabled</option>
                  <option>Suspended</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <div className="grid grid-cols-3 gap-4">
              <select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {months.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {days.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleResetPassword}
              className="px-6 py-2.5 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors"
            >
              RESET PASSWORD
            </button>
            <button
              onClick={handleReEnableUser}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              RE-ENABLE USER
            </button>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2.5 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors"
          >
            SAVE CHANGES
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
