import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPersonnel, getUsers } from "../../api/client";
import { formatClock, loadMessagingState } from "../../services/messagingStore";

function buildUnreadThreads() {
  const store = loadMessagingState();
  return Object.entries(store.threads || {})
    .map(([key, t]) => ({ key, ...t }))
    .filter((t) => (Number(t.unread) || 0) > 0)
    .sort((a, b) => (Number(b.lastTime) || 0) - (Number(a.lastTime) || 0));
}

export default function NotificationDroplist({
  iconSrc,
  iconAlt = "Notifications",
  buttonClassName = "p-2 hover:bg-gray-100 rounded-lg transition-colors relative",
  imgClassName = "w-10 h-10",
}) {
  const navigate = useNavigate();
  const ref = useRef(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [directory, setDirectory] = useState({
    usersById: {},
    personnelById: {},
  });

  const unreadTotal = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.unread) || 0), 0),
    [items],
  );

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onMouseDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open]);

  async function refresh() {
    setLoading(true);
    try {
      const threads = buildUnreadThreads();
      if (threads.length === 0) {
        setItems([]);
        return;
      }

      let usersById = directory.usersById;
      let personnelById = directory.personnelById;
      if (!usersById || Object.keys(usersById).length === 0) {
        const [users, personnel] = await Promise.all([
          getUsers(),
          getPersonnel(),
        ]);
        usersById = Object.fromEntries(
          (Array.isArray(users) ? users : []).map((u) => [String(u.id), u]),
        );
        personnelById = Object.fromEntries(
          (Array.isArray(personnel) ? personnel : []).map((p) => [
            String(p.id),
            p,
          ]),
        );
        setDirectory({ usersById, personnelById });
      }

      const next = threads.slice(0, 8).map((t) => {
        const m = String(t.key).match(/^(users|personnel)-(\d+)$/);
        const type = m ? m[1] : "users";
        const id = m ? m[2] : "";
        const record = type === "users" ? usersById[id] : personnelById[id];
        const name = record?.name || record?.fullName || `(${type} ${id})`;

        return {
          key: t.key,
          name,
          lastText: t.lastText || "",
          lastTime: Number(t.lastTime) || 0,
          unread: Number(t.unread) || 0,
        };
      });

      setItems(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={iconAlt}
        aria-expanded={open}
        className={buttonClassName}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) refresh();
        }}
      >
        <img src={iconSrc} alt={iconAlt} className={imgClassName} />
        {unreadTotal > 0 && (
          <span className="absolute top-1 right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
            <div className="text-sm font-semibold text-gray-900">
              Notifications
            </div>
            <button
              type="button"
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
              onClick={refresh}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-sm text-gray-500">Loading…</div>
          ) : items.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">Up to date.</div>
          ) : (
            <div className="max-h-80 overflow-auto">
              {items.map((n) => (
                <button
                  key={n.key}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setOpen(false);
                    navigate("/messaging");
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {n.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {n.lastText || "New message"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="text-xs text-gray-400">
                        {n.lastTime ? formatClock(n.lastTime) : ""}
                      </div>
                      <div className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-50 px-2 text-[11px] font-semibold text-red-700">
                        {n.unread}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-black/10 px-4 py-3">
            <button
              type="button"
              className="text-sm font-medium text-cyan-700 hover:text-cyan-800"
              onClick={() => {
                setOpen(false);
                navigate("/messaging");
              }}
            >
              View messages
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
