import React, { useEffect, useState } from "react";
import { Search, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import move from "../../assets/icons/Move.svg";
import edit from "../../assets/icons/Draw.svg";
import remove from "../../assets/icons/Bin.svg";
import { getPersonnel } from "../../api/client";

const Personnel = () => {
  const [personnel, setPersonnel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getPersonnel();
        if (cancelled) return;
        setPersonnel(Array.isArray(data) ? data : []);
        setLoaded(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (cancelled) return;
        setPersonnel([]);
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...personnel].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setPersonnel(sorted);
  };

  // Filter personnel based on search
  const filteredPersonnel = personnel.filter(
    (person) =>
      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm),
  );

  // Sort icon component
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <div className="flex flex-col ml-1">
          <ChevronUp size={12} className="text-gray-400 -mb-1" />
          <ChevronDown size={12} className="text-gray-400" />
        </div>
      );
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={14} className="text-gray-600 ml-1" />
    ) : (
      <ChevronDown size={14} className="text-gray-600 ml-1" />
    );
  };

  const handleDelete = (id) => {
    setPersonnel(personnel.filter((p) => p.id !== id));
  };

  return (
    <div className="h-full min-h-0 bg-[#F5F7FA] p-6 lg:p-12 overflow-hidden">
      <div className="bg-white rounded-lg shadow-sm p-8 h-full min-h-0 flex flex-col">
        {!loaded && <div className="pb-6 text-sm text-gray-500">Loading…</div>}
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Add New Button */}
          <button
            onClick={() => navigate("/personnel/manage/new")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add New
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm w-12 border-r border-gray-200">
                  #
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm border-r border-gray-200">
                  <button
                    onClick={() => handleSort("fullName")}
                    className="flex items-center hover:text-gray-900"
                  >
                    Full Name
                    <SortIcon columnKey="fullName" />
                  </button>
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm border-r border-gray-200">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center hover:text-gray-900"
                  >
                    E-Mail
                    <SortIcon columnKey="email" />
                  </button>
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm border-r border-gray-200">
                  <button
                    onClick={() => handleSort("phone")}
                    className="flex items-center hover:text-gray-900"
                  >
                    Phone Number
                    <SortIcon columnKey="phone" />
                  </button>
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm border-r border-gray-200 w-32">
                  Status
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm border-r border-gray-200">
                  Permission Level
                </th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 text-sm w-36"></th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonnel.map((person, index) => (
                <tr
                  key={person.id}
                  className={`border-b border-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-2 px-3 text-gray-600 text-sm border-r border-gray-200">
                    {person.id}
                  </td>
                  <td className="py-2 px-3 text-gray-900 text-sm border-r border-gray-200">
                    {person.fullName}
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-sm border-r border-gray-200">
                    {person.email}
                  </td>
                  <td className="py-2 px-3 text-gray-600 text-sm border-r border-gray-200">
                    {person.phone}
                  </td>
                  <td className="py-2 px-3 border-r border-gray-200">
                    <span
                      className={`inline-block px-8 py-1 rounded-md text-xs font-medium min-w-[110px] text-center ${
                        person.status === "Active"
                          ? "bg-[#ADD0AE] text-[#135D47] border border-[#135D47]"
                          : "bg-[#C5C3C3] text-[#404040] border border-[#404040]"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-gray-900 text-sm border-r border-gray-200">
                    {person.permissionLevel}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1">
                      {/* Move Button */}
                      <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
                        <img
                          src={move}
                          alt="Move"
                          style={{ width: "30px", height: "30px" }}
                        />
                      </button>
                      {/* Edit Button */}
                      <button
                        onClick={() =>
                          navigate(`/personnel/manage/${person.id}`)
                        }
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <img
                          src={edit}
                          alt="Edit"
                          style={{ width: "30px", height: "30px" }}
                        />
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <img
                          src={remove}
                          alt="Delete"
                          style={{ width: "30px", height: "30px" }}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPersonnel.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No personnel found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Personnel;
