import { useEffect, useState } from "react";
import { shop } from "../data/shopData";

const STATUS_OPTIONS = ["new", "confirmed", "completed", "cancelled"];

const STATUS_STYLES = {
  new: "bg-brand/20 text-brand-dark",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-200 text-gray-500",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function LoginForm({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        return;
      }
      onLoggedIn();
    } catch {
      setError("Network error - please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-[70svh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="text-center text-2xl font-bold">{shop.name} Admin</h1>
      <p className="mt-2 text-center text-sm text-gray-500">
        Sign in to view and manage bookings.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-ink py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}

function BookingCard({ booking, onStatusChange }) {
  const submittedAt = new Date(booking.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{booking.name}</p>
          <a href={`tel:${booking.phone}`} className="text-sm text-gray-500 underline underline-offset-2">
            {booking.phone}
          </a>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <dl className="mt-3 space-y-1 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="font-medium text-gray-800">Service:</dt>
          <dd>{booking.services}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-800">Stylist:</dt>
          <dd>{booking.stylist}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-800">Time:</dt>
          <dd>{booking.time}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-800">Submitted:</dt>
          <dd>{submittedAt}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(booking.id, s)}
            disabled={booking.status === s}
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize transition disabled:cursor-default disabled:opacity-40 ${
              booking.status === s
                ? "border-ink bg-ink text-white"
                : "border-gray-300 text-gray-600 hover:border-ink"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function CustomerCard({ customer }) {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const lastVisit = new Date(customer.lastVisit).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  async function handleRemind() {
    setStatus("sending");
    try {
      const res = await fetch("/api/customers/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: customer.phone }),
      });
      const data = await res.json();
      setStatus(res.ok && data.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{customer.name}</p>
          <a href={`tel:${customer.phone}`} className="text-sm text-gray-500 underline underline-offset-2">
            {customer.phone}
          </a>
        </div>
        <span className="text-xs text-gray-500">
          {customer.visits} visit{customer.visits === 1 ? "" : "s"}
        </span>
      </div>

      <dl className="mt-3 space-y-1 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="font-medium text-gray-800">Last visit:</dt>
          <dd>{lastVisit}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-medium text-gray-800">Last service:</dt>
          <dd>{customer.lastServices}</dd>
        </div>
      </dl>

      <button
        onClick={handleRemind}
        disabled={status === "sending" || status === "sent"}
        className="mt-4 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink disabled:cursor-default disabled:opacity-50"
      >
        {status === "sending"
          ? "Sending..."
          : status === "sent"
            ? "Reminder Sent"
            : status === "error"
              ? "Failed - Try Again"
              : "Send Reminder"}
      </button>
    </div>
  );
}

function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.error || "Failed to load customers");
          return;
        }
        setCustomers(data.customers);
      } catch {
        setError("Network error - please try again");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter((c) =>
    `${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <input
        type="search"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
      />

      {error && <p className="mt-6 text-red">{error}</p>}

      {loading ? (
        <p className="mt-8 text-center text-gray-500">Loading customers...</p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">No customers found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {filtered.map((c) => (
            <CustomerCard key={c.phone} customer={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard({ onLoggedOut }) {
  const [tab, setTab] = useState("bookings"); // bookings | customers
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings");
      if (res.status === 401) {
        onLoggedOut();
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Failed to load bookings");
        return;
      }
      setBookings(data.bookings);
    } catch {
      setError("Network error - please try again");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStatusChange(id, status) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      loadBookings();
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    onLoggedOut();
  }

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search && !`${b.name} ${b.phone}`.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const counts = bookings.reduce(
    (acc, b) => ({ ...acc, [b.status]: (acc[b.status] || 0) + 1 }),
    {},
  );

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{tab === "bookings" ? "Bookings" : "Customers"}</h1>
        <div className="flex gap-3">
          {tab === "bookings" && (
            <button
              onClick={loadBookings}
              className="text-sm font-semibold text-gray-500 underline underline-offset-4"
            >
              Refresh
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red underline underline-offset-4"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {[
          { id: "bookings", label: "Bookings" },
          { id: "customers", label: "Customers" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              tab === t.id
                ? "border-ink bg-ink text-white"
                : "border-gray-300 text-gray-600 hover:border-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "customers" ? (
        <CustomersView />
      ) : (
        <>
          <input
            type="search"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {["all", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-sm font-semibold capitalize transition ${
                  filter === s
                    ? "border-ink bg-ink text-white"
                    : "border-gray-300 text-gray-600 hover:border-ink"
                }`}
              >
                {s} {s !== "all" && counts[s] ? `(${counts[s]})` : ""}
              </button>
            ))}
          </div>

          {error && <p className="mt-6 text-red">{error}</p>}

          {loading ? (
            <p className="mt-8 text-center text-gray-500">Loading bookings...</p>
          ) : filtered.length === 0 ? (
            <p className="mt-8 text-center text-gray-500">No bookings found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {filtered.map((b) => (
                <BookingCard key={b.id} booking={b} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default function Admin() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => setAuthenticated(Boolean(data.authenticated)))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return <p className="py-16 text-center text-gray-500">Loading...</p>;
  }

  return authenticated ? (
    <Dashboard onLoggedOut={() => setAuthenticated(false)} />
  ) : (
    <LoginForm onLoggedIn={() => setAuthenticated(true)} />
  );
}
