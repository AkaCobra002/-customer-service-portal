import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, ChevronUp, ChevronDown, X } from "lucide-react";
import EditIcon from "../../assets/icons/Edit.svg";
import DeleteIcon from "../../assets/icons/Delete.svg";

import { getAdsConnections } from "../../api/client";

const Advertising = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    connectionName: "",
    dataSource: "API",
    status: "Authenticated",
  });

  const [connections, setConnections] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const dataSourceOptions = useMemo(() => {
    const fromData = connections.map((c) => c?.dataSource).filter(Boolean);
    const defaults = [
      "API",
      "Google Analytics",
      "Google Ads",
      "Google Big Query",
      "Facebook",
      "Salesforce",
      "Jira",
      "MongoDB",
      "Github",
      "QuickBooksOnline",
      "NetSuite",
    ];

    return Array.from(new Set([...defaults, ...fromData]));
  }, [connections]);

  const statusOptions = ["Authenticated", "Not Authenticated", "Conditional"];

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getAdsConnections();
        if (cancelled) return;
        setConnections(Array.isArray(data) ? data : []);
        setLoaded(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (cancelled) return;
        setConnections([]);
        setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Authenticated":
        return "bg-[#ACD0AE] text-green-900 border-2 border-[#135D47]";
      case "Not Authenticated":
        return "bg-[#E5B4B4] text-red-900 border-2 border-[#A55870]";
      case "Conditional":
        return "bg-[#C5C3C3] text-gray-800 border-2 border-[#404040]";
      default:
        return "bg-gray-300 text-gray-800 border-2 border-gray-500";
    }
  };

  const filteredConnections = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return connections;

    return connections.filter((c) => {
      const haystack = [c.title, c.connectionName, c.dataSource, c.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [connections, searchTerm]);

  const handleCreateAd = () => {
    const title = formData.title.trim();
    const connectionName = formData.connectionName.trim();
    const dataSource = formData.dataSource;
    const status = formData.status;

    if (!title || !connectionName || !dataSource || !status) return;

    const next = {
      id: `${Date.now()}`,
      title,
      connectionName,
      dataSource,
      status,
      lastModified: "just now",
    };

    setConnections((prev) => [next, ...prev]);
    setFormData({
      title: "",
      connectionName: "",
      dataSource: dataSourceOptions[0] || "API",
      status: "Authenticated",
    });
    setIsCreateAdOpen(false);
  };

  return (
    <div className="h-full min-h-0 bg-[#F5F7FA] overflow-hidden p-6 lg:p-8">
      <div className="h-full min-h-0 flex gap-6">
        {/* Left Panel */}
        <div
          className={`transition-all duration-300 ${isCreateAdOpen ? "w-2/3" : "w-full"} h-full min-h-0 bg-white rounded-3xl shadow-sm overflow-hidden`}
        >
          <div className="p-8 lg:p-10 h-full min-h-0 flex flex-col">
            {!loaded && (
              <div className="pb-6 text-sm text-gray-500">Loading…</div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between gap-5 mb-5 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#12A1BA] transition"
                />
              </div>
              <button
                onClick={() => setIsCreateAdOpen((v) => !v)}
                className="flex items-center gap-2.5 bg-[#12A1BA] hover:bg-[#0e8aa0] text-white px-8 py-3 rounded-md text-sm font-medium transition shadow-sm whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                New Ad
              </button>
            </div>

            {/* Table */}
            <div className="relative flex-1 min-h-0">
              <div
                className="h-full overflow-y-auto pr-4"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#94a3b8 #f1f5f9",
                }}
              >
                <table className="w-full">
                  <thead className="bg-[#2E4258] text-white text-xs font-medium uppercase tracking-wider sticky top-0 z-10">
                    <tr>
                      <th className="px-7 py-3 text-left">
                        <input
                          type="checkbox"
                          className="w-4.5 h-4.5 border-2 border-[#D9D9D9] rounded-none focus:ring-2 focus:ring-[#12A1BA] cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="inline-flex items-center gap-1">
                          Ad Title
                          <span className="flex flex-col -space-y-1.5 opacity-60">
                            <ChevronUp className="w-3.5 h-3.5 fill-white" />
                            <ChevronDown className="w-3.5 h-3.5 fill-white" />
                          </span>
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="inline-flex items-center gap-1">
                          Connection Name
                          <span className="flex flex-col -space-y-1.5 opacity-60">
                            <ChevronUp className="w-3.5 h-3.5 fill-white" />
                            <ChevronDown className="w-3.5 h-3.5 fill-white" />
                          </span>
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left">Data Source</th>
                      <th className="px-6 py-3 text-left">
                        <span className="inline-flex items-center gap-1">
                          Status
                          <span className="flex flex-col -space-y-1.5 opacity-60">
                            <ChevronUp className="w-3.5 h-3.5 fill-white" />
                            <ChevronDown className="w-3.5 h-3.5 fill-white" />
                          </span>
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left">
                        <span className="inline-flex items-center gap-1">
                          Last Modified
                          <span className="flex flex-col -space-y-1.5 opacity-60">
                            <ChevronUp className="w-3.5 h-3.5 fill-white" />
                            <ChevronDown className="w-3.5 h-3.5 fill-white" />
                          </span>
                        </span>
                      </th>
                      <th className="px-6 py-3 text-left">
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
                  <tbody className="text-sm">
                    {filteredConnections.map((conn, index) => (
                      <tr
                        key={conn.id}
                        className={`hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? "bg-[#F9FAFB]" : "bg-[#F3F8FF]"
                        }`}
                      >
                        <td className="px-7 py-2.5">
                          <input
                            type="checkbox"
                            className="w-4.5 h-4.5 border-2 border-[#D9D9D9] rounded-none focus:ring-2 focus:ring-[#12A1BA] cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-2.5 font-medium text-gray-900">
                          {conn.title}
                        </td>
                        <td className="px-6 py-2.5 text-gray-600">
                          {conn.connectionName}
                        </td>
                        <td className="px-6 py-2.5 text-gray-600">
                          {conn.dataSource}
                        </td>
                        <td className="px-6 py-2.5">
                          <span
                            className={`inline-block px-3.5 py-0.5 text-xs font-medium rounded-md ${getStatusClass(conn.status)}`}
                          >
                            {conn.status}
                          </span>
                        </td>
                        <td className="px-6 py-2.5 text-gray-500 text-xs">
                          {conn.lastModified}
                        </td>
                        <td className="px-6 py-2.5">
                          <div className="flex items-center gap-3">
                            <button className="p-1.5 hover:bg-gray-200 rounded transition">
                              <img
                                src={EditIcon}
                                alt="Edit"
                                className="w-7 h-7"
                              />
                            </button>
                            <button className="p-1.5 hover:bg-gray-200 rounded transition">
                              <img
                                src={DeleteIcon}
                                alt="Delete"
                                className="w-7 h-7"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Right Panel (Create Ad) */}
        <div
          className={`transition-all duration-300 ${
            isCreateAdOpen ? "w-1/3" : "w-0"
          } h-full min-h-0 overflow-hidden ${
            isCreateAdOpen ? "bg-white rounded-3xl shadow-sm" : ""
          }`}
        >
          <div
            className={`h-full min-h-0 p-8 lg:p-10 overflow-auto transform transition-transform duration-300 ${
              isCreateAdOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Create New Ad
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add a new advertising connection
                </p>
              </div>
              <button
                onClick={() => setIsCreateAdOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Ad Title
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Type ad title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12A1BA] focus:border-transparent outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Connection Name
                </label>
                <input
                  value={formData.connectionName}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      connectionName: e.target.value,
                    }))
                  }
                  placeholder="Type connection name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12A1BA] focus:border-transparent outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Data Source
                </label>
                <select
                  value={formData.dataSource}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, dataSource: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12A1BA] focus:border-transparent outline-none appearance-none bg-white"
                >
                  {dataSourceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, status: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12A1BA] focus:border-transparent outline-none appearance-none bg-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCreateAd}
                disabled={
                  !formData.title.trim() || !formData.connectionName.trim()
                }
                className="w-full bg-[#12A1BA] hover:bg-[#0e8aa0] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertising;
