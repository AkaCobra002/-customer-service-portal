import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronUp, ChevronDown, Upload } from "lucide-react";
import EditIcon from "../../assets/icons/Edit.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";
import UserIcon from "../../assets/icons/User.svg";
import MedalIcon from "../../assets/icons/Medal.svg";
import { getUsers } from "../../api/client";

const UsersTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Role");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getUsers();
        if (cancelled) return;
        setUsers(Array.isArray(data) ? data : []);
        setLoaded(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (cancelled) return;
        setUsers([]);
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-[#ACD0AE] text-green-900 border-2 border-[#135D47]";
      case "Inactive":
        return "bg-[#C5C3C3] text-gray-800 border-2 border-[#404040]";
      case "Disabled":
        return "bg-[#E5B4B4] text-red-900 border-2 border-[#A55870]";
      case "Pending":
        return "bg-[#B2B5BF] text-[#3958B5] border-2 border-[#3958B5]";
      case "Suspended":
        return "bg-[#FFE4C2] text-orange-900 border-2 border-[#FF8C00]";
      case "Banned":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const handleRoleSelect = (role) => {
    setRoleFilter(role);
    setRoleDropdownOpen(false);
  };
  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setStatusDropdownOpen(false);
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch = !q
        ? true
        : [u.name, u.email, u.username]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(q);

      const matchesRole = roleFilter === "Role" ? true : u.role === roleFilter;
      const matchesStatus =
        statusFilter === "Status" ? true : u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchTerm, statusFilter, users]);

  return (
    <div className="h-full min-h-0 bg-gray-50 p-6 overflow-hidden flex flex-col">
      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-2 w-60 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Dropdown */}
          <div
            className="relative"
            style={{ zIndex: roleDropdownOpen ? 50 : 10 }}
          >
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="h-10 pl-10 pr-8 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 bg-white border border-gray-300 rounded-full relative w-[180px]"
            >
              <img
                src={UserIcon}
                alt="User"
                className="absolute left-3 w-5 h-5"
              />
              <span>{roleFilter}</span>
              {roleDropdownOpen ? (
                <ChevronUp className="absolute right-3 w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="absolute right-3 w-4 h-4 text-gray-600" />
              )}
            </button>
            {roleDropdownOpen && (
              <div className="absolute top-11 left-0 w-[180px] bg-white border border-gray-300 rounded-3xl shadow-lg">
                <div className="py-2">
                  <button
                    onClick={() => handleRoleSelect("Role")}
                    className="block w-full text-center px-4 py-2.5 hover:bg-gray-50 text-sm"
                  >
                    All
                  </button>
                  {["Admin", "User", "Guest", "Moderator"].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className="block w-full text-center px-4 py-2.5 hover:bg-gray-50 text-sm"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div
            className="relative"
            style={{ zIndex: statusDropdownOpen ? 50 : 10 }}
          >
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="h-10 pl-10 pr-8 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2 bg-white border border-gray-300 rounded-full relative w-[140px]"
            >
              <img
                src={MedalIcon}
                alt="Medal"
                className="absolute left-3 w-5 h-5"
              />
              <span>{statusFilter}</span>
              {statusDropdownOpen ? (
                <ChevronUp className="absolute right-3 w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="absolute right-3 w-4 h-4 text-gray-600" />
              )}
            </button>
            {statusDropdownOpen && (
              <div className="absolute top-11 left-0 w-[140px] bg-white border border-gray-300 rounded-3xl shadow-lg">
                <div className="py-3 px-3 space-y-2">
                  <button onClick={() => handleStatusSelect("Status")}>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-xs font-medium w-full text-center border border-gray-200">
                      All
                    </span>
                  </button>
                  <button onClick={() => handleStatusSelect("Active")}>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-medium w-full text-center border-2 border-green-800">
                      Active
                    </span>
                  </button>
                  <button onClick={() => handleStatusSelect("Inactive")}>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-gray-300 text-gray-700 text-xs font-medium w-full text-center">
                      Inactive
                    </span>
                  </button>
                  <button onClick={() => handleStatusSelect("Pending")}>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-blue-900 text-white text-xs font-medium w-full text-center">
                      Pending
                    </span>
                  </button>
                  <button onClick={() => handleStatusSelect("Suspended")}>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-medium w-full text-center">
                      Suspended
                    </span>
                  </button>
                  <button onClick={() => handleStatusSelect("Banned")}>
                    <span className="inline-block px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-medium w-full text-center">
                      Banned
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
          <Upload className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Table with scrollbar */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 min-h-0">
        <div className="relative h-full min-h-0 flex flex-col">
          {!loaded && (
            <div className="p-4 text-sm text-gray-500 flex-shrink-0">
              Loading…
            </div>
          )}
          <div
            className="flex-1 min-h-0 overflow-y-auto pr-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#94a3b8 #f1f5f9",
            }}
          >
            <table className="w-full">
              <thead className="bg-[#2E4258] text-white text-xs font-medium uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 border-2 border-[#D9D9D9] rounded-none focus:ring-2 focus:ring-[#12A1BA] cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Full Name
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Email
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Username
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Status
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Role
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Joined Date
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Last Active
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="inline-flex items-center gap-1">
                      Actions
                      <span className="flex flex-col -space-y-1.5 opacity-60">
                        <ChevronUp className="w-3.5 h-3.5 fill-white" />
                        <ChevronDown className="w-3.5 h-3.5 fill-white" />
                      </span>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        className="w-4.5 h-4.5 border-2 border-[#D9D9D9] rounded-none focus:ring-2 focus:ring-[#12A1BA] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-900">{user.name}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.username}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block w-28 text-center px-3 py-1.5 text-xs font-medium rounded-md ${getStatusColor(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.role}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.joinedDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {user.lastActive}
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => navigate(`/users/manage/${user.id}`)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <img src={EditIcon} alt="Edit" className="w-10 h-10" />
                      </button>
                      <button
                        onClick={() =>
                          window.confirm("Delete?") &&
                          console.log("Delete", user.id)
                        }
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="w-10 h-10"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loaded && filteredUsers.length === 0 && (
            <div className="p-10 text-center text-sm text-gray-500 flex-shrink-0">
              No users found.
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
