import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SettingIcon from "../assets/icons/Setting.svg"; // Import Settings SVG
import NotificationIcon from "../assets/icons/Notification.svg"; // Import Notifications SVG

import {
  getAdsConnections,
  getMe,
  getPersonnel,
  getTickets,
  getUsers,
} from "../api/client";
import NotificationDroplist from "./SubComponents/NotificationDroplist";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Messaging", path: "/messaging" },
  { label: "Users", path: "/users" },
  { label: "Customer Support", path: "/support" },
  { label: "Ads", path: "/ads" },
  { label: "Personnel", path: "/personnel" },
  { label: "Settings", path: "/settings" },
];

function isTextInput(el) {
  if (!el) return false;
  const tag = String(el.tagName || "").toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    Boolean(el.isContentEditable)
  );
}

function includesQuery(value, q) {
  return String(value || "")
    .toLowerCase()
    .includes(q);
}

export default function Header({ title = "Dashboard Overview", children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState(null);

  const searchWrapRef = useRef(null);
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [indexLoading, setIndexLoading] = useState(false);
  const [indexLoaded, setIndexLoaded] = useState(false);
  const [indexData, setIndexData] = useState({
    users: [],
    personnel: [],
    tickets: [],
    ads: [],
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMe();
        if (cancelled) return;
        setMe(data);
      } catch {
        if (cancelled) return;
        setMe(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveIndex(-1);
  }, [location.pathname]);

  const ensureIndexLoaded = async () => {
    if (indexLoaded || indexLoading) return;
    setIndexLoading(true);
    try {
      const [users, personnel, tickets, ads] = await Promise.all([
        getUsers().catch(() => []),
        getPersonnel().catch(() => []),
        getTickets().catch(() => []),
        getAdsConnections().catch(() => []),
      ]);
      setIndexData({
        users: Array.isArray(users) ? users : [],
        personnel: Array.isArray(personnel) ? personnel : [],
        tickets: Array.isArray(tickets) ? tickets : [],
        ads: Array.isArray(ads) ? ads : [],
      });
      setIndexLoaded(true);
    } finally {
      setIndexLoading(false);
    }
  };

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!searchWrapRef.current) return;
      if (!searchWrapRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (isTextInput(e.target)) return;

      if ((e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        ensureIndexLoaded();
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key === "/") {
        e.preventDefault();
        setOpen(true);
        ensureIndexLoaded();
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexLoaded, indexLoading]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!open || !q) return [];

    const out = [];

    for (const item of NAV_ITEMS) {
      if (includesQuery(item.label, q)) {
        out.push({
          key: `nav:${item.path}`,
          kind: "Screen",
          title: item.label,
          subtitle: item.path,
          onSelect: () => navigate(item.path),
        });
      }
    }

    for (const u of indexData.users) {
      if (
        includesQuery(u.name, q) ||
        includesQuery(u.email, q) ||
        includesQuery(u.username, q)
      ) {
        out.push({
          key: `user:${u.id}`,
          kind: "User",
          title: u.name || u.username || u.email,
          subtitle: u.email,
          onSelect: () => navigate(`/users/manage/${u.id}`),
        });

        out.push({
          key: `chat:users:${u.id}`,
          kind: "Chat",
          title: `Message ${u.name || u.username || u.email}`,
          subtitle: "Messaging",
          onSelect: () =>
            navigate("/messaging", {
              state: {
                openTab: "users",
                openThreadKey: `users-${u.id}`,
              },
            }),
        });
      }
    }

    for (const p of indexData.personnel) {
      if (
        includesQuery(p.fullName, q) ||
        includesQuery(p.email, q) ||
        includesQuery(p.phone, q)
      ) {
        out.push({
          key: `personnel:${p.id}`,
          kind: "Personnel",
          title: p.fullName || p.email,
          subtitle: p.email,
          onSelect: () => navigate(`/personnel/manage/${p.id}`),
        });

        out.push({
          key: `chat:personnel:${p.id}`,
          kind: "Chat",
          title: `Message ${p.fullName || p.email}`,
          subtitle: "Messaging",
          onSelect: () =>
            navigate("/messaging", {
              state: {
                openTab: "personnel",
                openThreadKey: `personnel-${p.id}`,
              },
            }),
        });
      }
    }

    for (const t of indexData.tickets) {
      if (
        includesQuery(t.id, q) ||
        includesQuery(t.title, q) ||
        includesQuery(t.email, q) ||
        includesQuery(t.customerName, q)
      ) {
        out.push({
          key: `ticket:${t.id}`,
          kind: "Ticket",
          title: `Ticket# ${t.id}`,
          subtitle: t.title,
          onSelect: () =>
            navigate("/support", { state: { openTicketId: t.id } }),
        });
      }
    }

    for (const a of indexData.ads) {
      if (
        includesQuery(a.title, q) ||
        includesQuery(a.connectionName, q) ||
        includesQuery(a.dataSource, q)
      ) {
        out.push({
          key: `ad:${a.id}`,
          kind: "Ad",
          title: a.title,
          subtitle: a.connectionName,
          onSelect: () => navigate("/ads"),
        });
      }
    }

    return out.slice(0, 10);
  }, [indexData, navigate, open, query]);

  const commitSelection = (idx) => {
    const hit = results[idx];
    if (!hit) return;
    hit.onSelect();
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      <header className="flex-shrink-0 h-16 flex items-center justify-between bg-white border-b border-black/10 px-6">
        {/* Left side - Title */}
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        {/* Right side - Search, Icons, Profile */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative" ref={searchWrapRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={inputRef}
              type="text"
              aria-label="Search"
              placeholder=""
              value={query}
              onFocus={() => {
                setOpen(true);
                ensureIndexLoaded();
              }}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(-1);
                ensureIndexLoaded();
              }}
              onKeyDown={(e) => {
                if (!open) return;

                if (e.key === "Escape") {
                  e.preventDefault();
                  setOpen(false);
                  setActiveIndex(-1);
                  return;
                }

                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.min(results.length - 1, i + 1));
                  return;
                }

                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.max(-1, i - 1));
                  return;
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  commitSelection(activeIndex === -1 ? 0 : activeIndex);
                }
              }}
              className="pl-10 pr-4 py-2 w-[306px] bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />

            {!query && (
              <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm">
                <span className="text-gray-900 opacity-45">Search</span>
                <span className="text-gray-900 opacity-25"> - or type /</span>
              </div>
            )}

            {open && (
              <div className="absolute right-0 mt-2 w-[420px] max-w-[80vw] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="text-xs font-medium text-gray-600">
                    Global Search
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setActiveIndex(-1);
                      setQuery("");
                    }}
                    className="text-xs text-gray-500 hover:text-gray-900"
                  >
                    Clear
                  </button>
                </div>

                {indexLoading && (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    Loading…
                  </div>
                )}

                {!indexLoading && query.trim() === "" && (
                  <div className="px-4 py-4 text-sm text-gray-500">
                    Type to search users, tickets, personnel, ads, and screens.
                  </div>
                )}

                {!indexLoading &&
                  query.trim() !== "" &&
                  results.length === 0 && (
                    <div className="px-4 py-4 text-sm text-gray-500">
                      No results.
                    </div>
                  )}

                {results.length > 0 && (
                  <div className="max-h-96 overflow-auto">
                    {results.map((r, idx) => (
                      <button
                        key={r.key}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => commitSelection(idx)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                          idx === activeIndex
                            ? "bg-cyan-50"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {r.title}
                            </div>
                            {r.subtitle && (
                              <div className="text-xs text-gray-500 truncate">
                                {r.subtitle}
                              </div>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
                            {r.kind}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Settings Icon (using img tag from src/assets/icons) with bigger size */}
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img
              src={SettingIcon} // Using the imported SVG for Settings
              alt="Settings"
              className="w-10 h-22" // Increased size to w-10 and h-10 (40px)
            />
          </button>

          {/* Notifications Icon (using img tag from src/assets/icons) with bigger size */}
          <NotificationDroplist iconSrc={NotificationIcon} />

          {/* User Profile */}
          <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 transition-colors">
            {me?.avatar ? (
              <img
                src={me.avatar}
                alt={me?.yourName ? `${me.yourName} profile` : "User profile"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}
          </button>
        </div>
      </header>

      {/* Main content goes here */}
      <div className="flex-1 min-h-0 overflow-auto overscroll-contain">
        {children}
      </div>
    </div>
  );
}
