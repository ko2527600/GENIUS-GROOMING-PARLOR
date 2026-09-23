import { useEffect, useState } from "react";
import { shop, payment } from "../data/shopData";
import logo from "../assets/logo.png";

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

function Avatar({ name }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-brand">
      {initial}
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
    <section className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt={shop.name}
            className="h-14 w-14 rounded-full object-cover shadow-sm"
          />
          <h1 className="mt-4 text-xl font-bold">{shop.name}</h1>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-brand-dark">
            Admin Dashboard
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red/10 px-3 py-2 text-sm font-medium text-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink py-3 font-semibold text-white transition hover:bg-ink-soft disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={booking.name} />
          <div>
            <p className="font-semibold">{booking.name}</p>
            <a
              href={`tel:${booking.phone}`}
              className="text-sm text-gray-500 underline underline-offset-2"
            >
              {booking.phone}
            </a>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-gray-800">Service</dt>
          <dd>{booking.services}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-gray-800">Stylist</dt>
          <dd>{booking.stylist}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-gray-800">Time</dt>
          <dd>{booking.time}</dd>
        </div>
        {booking.payment && (
          <div className="flex gap-2">
            <dt className="w-24 shrink-0 font-medium text-gray-800">Fee</dt>
            <dd>{booking.payment} — check MoMo statement to confirm</dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-gray-800">Submitted</dt>
          <dd>{submittedAt}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Status
        </span>
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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={customer.name} />
          <div>
            <p className="font-semibold">{customer.name}</p>
            <a
              href={`tel:${customer.phone}`}
              className="text-sm text-gray-500 underline underline-offset-2"
            >
              {customer.phone}
            </a>
          </div>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          {customer.visits} visit{customer.visits === 1 ? "" : "s"}
        </span>
      </div>

      <dl className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-gray-800">Last visit</dt>
          <dd>{lastVisit}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 shrink-0 font-medium text-gray-800">Last service</dt>
          <dd>{customer.lastServices}</dd>
        </div>
      </dl>

      <button
        onClick={handleRemind}
        disabled={status === "sending" || status === "sent"}
        className="mt-4 w-full rounded-full border border-gray-300 py-2 text-sm font-semibold text-ink transition hover:border-ink disabled:cursor-default disabled:opacity-50 sm:w-auto sm:px-4"
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
        className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
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

function StatTile({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ?? "text-ink"}`}>{value}</p>
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

  // Revenue is the flat booking fee times every non-cancelled booking —
  // the fee is collected up front at booking time regardless of status.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const weekAgo = new Date(startOfToday.getTime() - 6 * 24 * 60 * 60 * 1000);
  const paidBookings = bookings.filter((b) => b.status !== "cancelled");
  const revenueSince = (cutoff) =>
    paidBookings.filter((b) => new Date(b.createdAt) >= cutoff).length * payment.amount;
  const revenueToday = revenueSince(startOfToday);
  const revenueWeek = revenueSince(weekAgo);
  const revenueAllTime = paidBookings.length * payment.amount;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-ink text-white shadow-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt={shop.name} className="h-9 w-9 rounded-full object-cover" />
            <div>
              <p className="font-bold leading-tight">{shop.name}</p>
              <p className="text-xs font-medium uppercase tracking-wide text-brand">
                Admin Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Log Out
          </button>
        </div>
        <div className="border-t border-white/10 bg-white/5">
          <a
            href={shop.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-sm text-gray-200 transition hover:text-brand"
          >
            <span aria-hidden="true">📍</span>
            <span className="truncate">{shop.address}</span>
            <span className="ml-auto shrink-0 font-semibold underline underline-offset-2">
              Get Directions
            </span>
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">{tab === "bookings" ? "Bookings" : "Customers"}</h1>
          {tab === "bookings" && (
            <button
              onClick={loadBookings}
              className="text-sm font-semibold text-gray-500 underline underline-offset-4"
            >
              Refresh
            </button>
          )}
        </div>

        {tab === "bookings" && (
          <>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatTile
                label="Revenue Today"
                value={`${payment.currency}${revenueToday}`}
                accent="text-green-700"
              />
              <StatTile
                label="Revenue This Week"
                value={`${payment.currency}${revenueWeek}`}
                accent="text-green-700"
              />
              <StatTile
                label="Revenue All-Time"
                value={`${payment.currency}${revenueAllTime}`}
                accent="text-green-700"
              />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              <StatTile label="Total" value={bookings.length} />
              <StatTile label="New" value={counts.new ?? 0} accent="text-brand-dark" />
              <StatTile label="Confirmed" value={counts.confirmed ?? 0} accent="text-blue-700" />
              <StatTile label="Completed" value={counts.completed ?? 0} accent="text-green-700" />
              <StatTile label="Cancelled" value={counts.cancelled ?? 0} accent="text-gray-500" />
            </div>
          </>
        )}

        <div className="mt-6 inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
          {[
            { id: "bookings", label: "Bookings" },
            { id: "customers", label: "Customers" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === t.id ? "bg-ink text-white" : "text-gray-600 hover:text-ink"
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
              className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {["all", ...STATUS_OPTIONS].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold capitalize transition ${
                    filter === s
                      ? "border-ink bg-ink text-white"
                      : "border-gray-300 bg-white text-gray-600 hover:border-ink"
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
    </div>
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return authenticated ? (
    <Dashboard onLoggedOut={() => setAuthenticated(false)} />
  ) : (
    <LoginForm onLoggedIn={() => setAuthenticated(true)} />
  );
}
