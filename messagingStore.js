// src/services/messagingStore.js

const STORAGE_KEY = "wdc.messaging.v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Shape:
 * {
 *   threads: {
 *     "users-1": { messages: [...], unread: 0, lastText: "", lastTime: 0 }
 *   }
 * }
 */
export function loadMessagingState() {
  if (typeof window === "undefined") return { threads: {} };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw ? safeParse(raw, { threads: {} }) : { threads: {} };
}

export function saveMessagingState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function ensureThread(state, threadKey) {
  if (state.threads[threadKey]) return state;
  return {
    ...state,
    threads: {
      ...state.threads,
      [threadKey]: {
        messages: [],
        unread: 0,
        lastText: "",
        lastTime: 0,
      },
    },
  };
}

export function addMessage(state, threadKey, message, { bumpUnread = false } = {}) {
  const s = ensureThread(state, threadKey);
  const prev = s.threads[threadKey];

  const messages = [...prev.messages, message];
  const lastText = message.text;
  const lastTime = message.ts;

  return {
    ...s,
    threads: {
      ...s.threads,
      [threadKey]: {
        ...prev,
        messages,
        lastText,
        lastTime,
        unread: bumpUnread ? (prev.unread || 0) + 1 : (prev.unread || 0),
      },
    },
  };
}

export function markRead(state, threadKey) {
  const s = ensureThread(state, threadKey);
  const prev = s.threads[threadKey];

  if (!prev.unread) return s;

  return {
    ...s,
    threads: {
      ...s.threads,
      [threadKey]: { ...prev, unread: 0 },
    },
  };
}

// Helpers for UI formatting
export function formatClock(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

export function formatDayLabel(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "long", year: "numeric" });
}
