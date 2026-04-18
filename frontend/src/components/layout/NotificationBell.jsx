import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import axiosClient from "../../api/axiosClient";
import Button from "../ui/Button";

function NotificationBell() {
  const { user, credentials, buildBasicAuthHeader } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  const authHeader = useMemo(() => {
    if (!credentials) return "";
    return buildBasicAuthHeader(credentials.email, credentials.password);
  }, [credentials, buildBasicAuthHeader]);

  const fetchUnreadCount = async () => {
    if (!user) return;

    try {
      const response = await axiosClient.get(
        `/api/notifications/${user.id}/unread-count`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      setUnreadCount(response.data);
    } catch (error) {
      console.error("Failed to load unread notification count", error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const response = await axiosClient.get(`/api/notifications/${user.id}`, {
        headers: {
          Authorization: authHeader,
        },
      });

      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);

    if (!open) {
      await fetchNotifications();
      await fetchUnreadCount();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axiosClient.put(
        `/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, read: true, isRead: true } : item
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000);

    return () => clearInterval(interval);
  }, [user, authHeader]);

  if (!user) return null;

  const formatDateTime = (value) => {
  if (!value) return "";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-slate-200 transition hover:bg-slate-800"
      >
        <span className="text-lg">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[360px] rounded-[24px] border border-slate-800 bg-slate-900/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Notifications
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Recent updates from bookings, tickets, and comments
              </p>
            </div>

            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-5 text-sm text-slate-400">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-5 text-sm text-slate-400">
                No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => {
                const readState =
                  notification.isRead ?? notification.read ?? false;

                return (
                  <div
                    key={notification.id}
                    className={`rounded-2xl border px-4 py-4 transition ${
                      readState
                        ? "border-slate-800 bg-slate-950/50"
                        : "border-orange-500/20 bg-orange-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">
                          {notification.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          {notification.type} · {formatDateTime(notification.createdAt)}
                        </p>
                      </div>

                      {!readState && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-xl border border-slate-700 px-3 py-1 text-xs text-slate-200 transition hover:bg-slate-800"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;