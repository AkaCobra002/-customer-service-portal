import React, { useState, useEffect, useRef } from "react";
import { Search, FileEdit, ChevronDown, ChevronLeft, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getTickets } from "../../api/client";
import smsIcon from "../../assets/icons/sms.svg";
import smsNotificationIcon from "../../assets/icons/sms-notification.svg";
import smsTrackingIcon from "../../assets/icons/sms-tracking.svg";
import smsStarIcon from "../../assets/icons/sms-star.svg";

// Ticket Card Component
const TicketCard = ({ ticket, onClick, className = "" }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "on-going": return "bg-amber-500";
      case "resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`} />
          <h3 className="font-semibold text-gray-900">Ticket# {ticket.id}</h3>
          {ticket.priority === "high" && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-md font-medium">
              High Priority
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">Posted at {ticket.postedAt}</span>
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-gray-900 mb-2">{ticket.title}</h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.body}</p>
      </div>

      <hr className="border-gray-200 mb-4" />

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
            {ticket.customerName.split(" ").map((n) => n[0]).join("")}
          </div>
          <span className="text-sm text-gray-700">{ticket.customerName}</span>
        </div>
        <button
          onClick={() => onClick(ticket)}
          className="text-cyan-600 hover:text-cyan-700 font-medium text-sm underline underline-offset-4 decoration-cyan-600"
        >
          Open Ticket
        </button>
      </div>
    </div>
  );
};

// Reusable Custom Dropdown Component
const CustomDropdown = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  showDot = false,
  getColor = () => "",
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : placeholder;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <div
        onClick={() => !disabled && setOpen((prev) => !prev)}
        className={`flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg bg-white cursor-pointer ${
          disabled ? "bg-gray-50 cursor-not-allowed text-gray-700" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          {showDot && value && <div className={`w-3 h-3 rounded-full ${getColor(value)}`} />}
          <span>{displayLabel}</span>
        </div>
        {!disabled && <ChevronDown size={18} className="text-gray-500" />}
      </div>

      {open && !disabled && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-20 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-gray-900"
            >
              {showDot && <div className={`w-3 h-3 rounded-full ${opt.color || getColor(opt.value)}`} />}
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Ticket Detail View
const TicketDetailView = ({ ticket, onBack, ticketTypes, onSubmitReply }) => {
  const [reply, setReply] = useState({
    email: ticket?.email || "",
    type: ticket?.type || "",
    status: ticket?.status || "new",
    body: "",
  });

  useEffect(() => {
    setReply({
      email: ticket?.email || "",
      type: ticket?.type || "",
      status: ticket?.status || "new",
      body: "",
    });
  }, [ticket]);

  const getStatusColor = (status) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "on-going": return "bg-amber-500";
      case "resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const typeOptions = [
    { label: "Choose Type", value: "" },
    ...Array.from(
      new Set([ticket?.type, ...(Array.isArray(ticketTypes) ? ticketTypes : [])].filter(Boolean))
    ).map((t) => ({ label: t, value: t })),
  ];

  const statusOptions = [
    { label: "New", value: "new", color: "bg-blue-500" },
    { label: "On-Going", value: "on-going", color: "bg-amber-500" },
    { label: "Resolved", value: "resolved", color: "bg-green-500" },
  ];

  const bodyParagraphs = String(ticket?.body || "")
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={18} />
          Back to tickets
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`} aria-hidden="true" />
              <div className="text-sm font-semibold text-gray-900">Ticket# {ticket.id}</div>
            </div>
            <div className="text-sm text-gray-500">Posted at {ticket.postedAt}</div>
          </div>

          <h2 className="mt-10 text-2xl font-semibold text-gray-900">{ticket.title}</h2>

          <div className="mt-4 space-y-6 text-gray-600 leading-relaxed">
            {bodyParagraphs.length > 0 ? bodyParagraphs.map((p, idx) => (
              <p key={idx} className="text-sm">{p}</p>
            )) : (
              <p className="text-sm">{ticket.body}</p>
            )}
          </div>

          <div className="mt-10 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900">Reply to Ticket</h3>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Customer Email</label>
                <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                  {reply.email || "—"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Request Ticket Type</label>
                <CustomDropdown
                  value={reply.type}
                  options={typeOptions}
                  onChange={(val) => setReply((r) => ({ ...r, type: val }))}
                  placeholder="Choose Type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                <CustomDropdown
                  value={reply.status}
                  options={statusOptions}
                  onChange={(val) => setReply((r) => ({ ...r, status: val }))}
                  showDot={true}
                  getColor={getStatusColor}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">Ticket Body</label>
                <textarea
                  value={reply.body}
                  onChange={(e) => setReply((r) => ({ ...r, body: e.target.value }))}
                  placeholder="Type ticket issue here.."
                  rows={7}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none resize-none bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => onSubmitReply(reply)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!reply.body.trim()}
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Support Component
const Support = () => {
  const location = useLocation();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [page, setPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    timeframe: "all",
    search: "",
  });

  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    type: "",
    priority: "",
    body: "",
  });

  const dropdownRef = useRef();
  const timeframeRef = useRef();
  const didAutoOpenRef = useRef(false);

  const timeframeOptions = [
    { label: "This Week", value: "all" },
    { label: "Today", value: "today" },
    { label: "This Month", value: "month" },
  ];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getTickets();
        if (cancelled) return;
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        setTickets([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (didAutoOpenRef.current) return;
    const openTicketId = location?.state?.openTicketId;
    if (!openTicketId) return;
    if (selectedTicket) {
      didAutoOpenRef.current = true;
      return;
    }
    if (tickets.length === 0) return;
    const match = tickets.find((t) => t.id === openTicketId);
    didAutoOpenRef.current = true;
    if (match) {
      setSelectedTicket(match);
      setIsCreateFormOpen(false);
    }
  }, [location?.state, selectedTicket, tickets]);

  const ticketTypes = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
  const priorities = ["low", "medium", "high"];

  useEffect(() => {
    let filtered = [...tickets];
    if (filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.priority !== "all") {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }
    if (filters.search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.id.toLowerCase().includes(filters.search.toLowerCase()) ||
          t.customerName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    setFilteredTickets(filtered);
  }, [filters, tickets]);

  useEffect(() => {
    setPage(1);
  }, [filters.status, filters.priority, filters.timeframe, filters.search]);

  const perPage = 2;
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * perPage;
  const pageEnd = pageStart + perPage;
  const pagedTickets = filteredTickets.slice(pageStart, pageEnd);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPriorityOpen(false);
      }
      if (timeframeRef.current && !timeframeRef.current.contains(event.target)) {
        setIsTimeframeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusOptions = [
    { label: "All Tickets", value: "all", color: "bg-gray-400" },
    { label: "New", value: "new", color: "bg-blue-500" },
    { label: "On-Going", value: "on-going", color: "bg-amber-500" },
    { label: "Resolved", value: "resolved", color: "bg-green-500" },
  ];

  const selectedStatusLabel =
    statusOptions.find((opt) => opt.value === filters.status)?.label || "All Tickets";
  const selectedTimeframeLabel =
    timeframeOptions.find((opt) => opt.value === filters.timeframe)?.label || "This Week";

  const handleCreateTicket = () => {
    if (formData.email && formData.type && formData.priority && formData.body) {
      const newTicket = {
        id: `2023-CS${Math.floor(Math.random() * 1000)}`,
        title: formData.body.substring(0, 50) + "...",
        body: formData.body,
        email: formData.email,
        customerName: formData.email.split("@")[0],
        status: "new",
        priority: formData.priority,
        type: formData.type,
        postedAt: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        replies: [],
      };
      setTickets([newTicket, ...tickets]);
      setFormData({ email: "", type: "", priority: "", body: "" });
      setIsCreateFormOpen(false);
    }
  };

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsCreateFormOpen(false);
  };

  const handleSubmitReply = (reply) => {
    const replyText = String(reply.body || "").trim();
    if (!selectedTicket || !replyText) return;

    const next = {
      ...selectedTicket,
      status: reply.status || selectedTicket.status,
      type: reply.type || selectedTicket.type,
      replies: [
        ...(Array.isArray(selectedTicket.replies) ? selectedTicket.replies : []),
        {
          from: "Support Team",
          message: replyText,
          timestamp: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };

    setTickets((prev) => prev.map((t) => (t.id === next.id ? next : t)));
    setSelectedTicket(next);
  };

  return (
    <div className="h-full min-h-0 bg-[#F5F7FA] p-6 lg:p-12 overflow-hidden">
      {selectedTicket ? (
        <TicketDetailView
          ticket={selectedTicket}
          onBack={() => setSelectedTicket(null)}
          ticketTypes={ticketTypes}
          onSubmitReply={handleSubmitReply}
        />
      ) : (
        <div className="flex gap-6 h-full min-h-0">
          {/* Left Side - Ticket List */}
          <div
            className={`transition-all duration-300 ${
              isCreateFormOpen ? "w-2/3" : "w-full"
            } bg-white rounded-lg shadow-sm p-6 h-full min-h-0 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for ticket"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Status Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                    className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer w-48"
                  >
                    <span className="text-gray-700">{selectedStatusLabel}</span>
                    <ChevronDown size={18} className="text-gray-500" />
                  </div>
                  {isPriorityOpen && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10">
                      {statusOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setFilters({ ...filters, status: option.value });
                            setIsPriorityOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        >
                          <div className={`w-3 h-3 rounded-full ${option.color}`} />
                          <span className="text-gray-700">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timeframe Dropdown */}
                <div className="relative" ref={timeframeRef}>
                  <div
                    onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
                    className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer w-48 min-w-[140px]"
                  >
                    <span className="text-gray-700">{selectedTimeframeLabel}</span>
                    <ChevronDown size={18} className="text-gray-500" />
                  </div>
                  {isTimeframeOpen && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10">
                      {timeframeOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setFilters({ ...filters, timeframe: option.value });
                            setIsTimeframeOpen(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FileEdit size={20} />
                  New Ticket
                </button>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-20 mb-6 border-b border-gray-200 flex-shrink-0">
              <button
                onClick={() => {
                  setFilters({ ...filters, status: "all" });
                  setIsPriorityOpen(false);
                }}
                className={`pb-3 flex items-center gap-2 ${
                  filters.status === "all" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-600"
                }`}
              >
                <img src={smsIcon} className="w-5 h-5" alt="All" />
                All Tickets
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, status: "new" });
                  setIsPriorityOpen(false);
                }}
                className={`pb-3 flex items-center gap-2 ${
                  filters.status === "new" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-600"
                }`}
              >
                <img src={smsNotificationIcon} className="w-5 h-5" alt="New" />
                New
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, status: "on-going" });
                  setIsPriorityOpen(false);
                }}
                className={`pb-3 flex items-center gap-2 ${
                  filters.status === "on-going" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-600"
                }`}
              >
                <img src={smsTrackingIcon} className="w-5 h-5" alt="On-Going" />
                On-Going
              </button>
              <button
                onClick={() => {
                  setFilters({ ...filters, status: "resolved" });
                  setIsPriorityOpen(false);
                }}
                className={`pb-3 flex items-center gap-2 ${
                  filters.status === "resolved" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-600"
                }`}
              >
                <img src={smsStarIcon} className="w-5 h-5" alt="Resolved" />
                Resolved
              </button>
            </div>

            {/* Tickets Grid */}
            <div className="flex-1 min-h-0 overflow-hidden pr-2">
              {pagedTickets.length === 0 ? (
                <div className="text-sm text-gray-500 py-10 text-center">No tickets found.</div>
              ) : (
                <div className="h-full grid grid-rows-2 gap-4">
                  {pagedTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onClick={handleOpenTicket}
                      className="min-h-0"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-6 flex-shrink-0">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-600"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => {
                const n = i + 1;
                const isActive = n === safePage;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={
                      isActive
                        ? "px-4 py-2 bg-cyan-600 text-white rounded-lg"
                        : "px-4 py-2 text-gray-600 hover:text-gray-900"
                    }
                    aria-current={isActive ? "page" : undefined}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-600"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Side - Create Form */}
          {isCreateFormOpen && (
            <div className="w-1/3 bg-white rounded-lg shadow-sm p-6 h-full min-h-0 overflow-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Create Quick Ticket</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Write and address new queries and issues
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Customer Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Type Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Request Ticket Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">Choose Type</option>
                    {ticketTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Priority Status</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    <option value="">Select Status</option>
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Ticket Body</label>
                  <textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Type ticket issue here.."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none bg-white"
                  />
                </div>

                <button
                  onClick={handleCreateTicket}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Support;