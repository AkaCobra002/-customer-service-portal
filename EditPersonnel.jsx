import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TickIcon from "../../assets/icons/Toast_Tick.svg";
import { useNavigate, useParams } from "react-router-dom";
import { getPersonnelMember } from "../../api/client";

const EditPersonnel = () => {
  const navigate = useNavigate();
  const { personnelId } = useParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    status: "",
    birthMonth: "September",
    birthDay: "20",
    birthYear: "2001",
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const user = await getPersonnelMember(personnelId);
        if (cancelled) return;

        const [firstName, ...rest] = (user.fullName || "").split(" ");
        const lastName = rest.join(" ");

        setFormData((prev) => ({
          ...prev,
          firstName: firstName || "",
          lastName: lastName || "",
          email: user.email || "",
          phoneNumber: user.phone || "",
          role: user.permissionLevel || "",
          status: user.status || "",
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
  }, [personnelId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => setShowConfirmModal(true);

  const handleConfirmSave = () => {
    console.log("Save changes:", formData);
    setShowConfirmModal(false);
    showNotification("Changes saved successfully");
    navigate("/personnel/manage/" + personnelId);
  };

  const handleCancelModal = () => setShowConfirmModal(false);
  const handleCancel = () => navigate("/personnel/manage/" + personnelId);
  const handleBack = () => navigate("/personnel/manage/" + personnelId);

  const handleResetPassword = () =>
    showNotification("Password reset link sent!");
  const handleReEnableUser = () => {
    setFormData((prev) => ({ ...prev, status: "Active" }));
    showNotification("User re-enabled");
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
    <div className="h-full min-h-0 bg-[#F5F7FA] p-6 lg:p-12">
      <Toaster position="bottom-center" />

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Confirm changes
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Are you sure you want to save the changes?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={24} />
          <h1 className="text-3xl font-semibold text-gray-900">
            {formData.firstName} {formData.lastName}
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
          <span className="text-gray-900 font-medium">Edit Personnel</span>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              First Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Last Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
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
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Role<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Asst. Admin</option>
                  <option>Agent</option>
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
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                  <option>Disabled</option>
                  <option>Suspended</option>
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
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleInputChange}
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
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChange}
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
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
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

          {/* Personal Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Personal Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Action Buttons - Reset & Re-enable */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleResetPassword}
              className="px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
            >
              RESET PASSWORD FOR THIS USER
            </button>
            <button
              onClick={handleReEnableUser}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              RE-ENABLE USER
            </button>
          </div>
        </div>

        {/* Bottom Action Buttons - Save & Cancel */}
        <div className="flex justify-end gap-3 mt-8 pt-6">
          <button
            onClick={handleSaveChanges}
            className="px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
          >
            SAVE CHANGES
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPersonnel;
