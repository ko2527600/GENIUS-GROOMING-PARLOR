import { useState, useEffect } from "react";

const STATUS_STYLES = {
  new: "bg-brand/20 text-brand-dark border-brand",
  confirmed: "bg-blue-100 text-blue-700 border-blue-300",
  completed: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-gray-200 text-gray-500 border-gray-300",
};

function BookingCard({ booking, onClick }) {
  return (
    <button
      onClick={() => onClick(booking)}
      className={`w-full rounded border-l-4 p-2 text-left text-xs transition hover:shadow-md ${STATUS_STYLES[booking.status]}`}
    >
      <p className="font-semibold truncate">{booking.time}</p>
      <p className="truncate">{booking.name}</p>
      <p className="text-[10px] opacity-75 truncate">{booking.stylist}</p>
    </button>
  );
}

function DayView({ bookings, onBookingClick }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const dayBookings = bookings.filter((b) => b.date === selectedDate);
  
  // Group by time slot
  const bookingsByTime = {};
  dayBookings.forEach((b) => {
    if (!bookingsByTime[b.time]) {
      bookingsByTime[b.time] = [];
    }
    bookingsByTime[b.time].push(b);
  });

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM"
  ];

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border border-gray-300 p-2 focus:border-brand focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() - 1);
              setSelectedDate(date.toISOString().split("T")[0]);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <button
            onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
            className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => {
              const date = new Date(selectedDate);
              date.setDate(date.getDate() + 1);
              setSelectedDate(date.toISOString().split("T")[0]);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <h3 className="font-semibold">
            {new Date(selectedDate).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>
          <p className="text-sm text-gray-500">{dayBookings.length} booking{dayBookings.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="divide-y divide-gray-100">
          {timeSlots.map((slot) => (
            <div key={slot} className="flex">
              <div className="w-24 shrink-0 border-r border-gray-100 p-3 text-sm font-medium text-gray-600">
                {slot}
              </div>
              <div className="flex-1 p-2">
                {bookingsByTime[slot] && bookingsByTime[slot].length > 0 ? (
                  <div className="space-y-1">
                    {bookingsByTime[slot].map((b) => (
                      <BookingCard key={b.id} booking={b} onClick={onBookingClick} />
                    ))}
                  </div>
                ) : (
                  <p className="py-2 text-center text-xs text-gray-400">Available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WeekView({ bookings, onBookingClick }) {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day; // Monday
    return new Date(today.setDate(diff)).toISOString().split("T")[0];
  });

  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    weekDates.push(date.toISOString().split("T")[0]);
  }

  const weekBookings = {};
  weekDates.forEach((date) => {
    weekBookings[date] = bookings.filter((b) => b.date === date);
  });

  function prevWeek() {
    const date = new Date(weekStart);
    date.setDate(date.getDate() - 7);
    setWeekStart(date.toISOString().split("T")[0]);
  }

  function nextWeek() {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + 7);
    setWeekStart(date.toISOString().split("T")[0]);
  }

  function thisWeek() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    setWeekStart(new Date(today.setDate(diff)).toISOString().split("T")[0]);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          {new Date(weekDates[0]).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} -{" "}
          {new Date(weekDates[6]).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevWeek} className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">
            ← Prev
          </button>
          <button onClick={thisWeek} className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">
            This Week
          </button>
          <button onClick={nextWeek} className="rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50">
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dayBookings = weekBookings[date] || [];
          const isToday = date === new Date().toISOString().split("T")[0];
          return (
            <div
              key={date}
              className={`rounded-xl border ${isToday ? "border-brand bg-brand/5" : "border-gray-200 bg-white"} overflow-hidden shadow-sm`}
            >
              <div className={`p-2 text-center ${isToday ? "bg-brand text-white" : "bg-gray-50"}`}>
                <p className="text-xs font-semibold uppercase">
                  {new Date(date).toLocaleDateString("en-GB", { weekday: "short" })}
                </p>
                <p className={`text-lg font-bold ${isToday ? "text-white" : "text-gray-800"}`}>
                  {new Date(date).getDate()}
                </p>
              </div>
              <div className="space-y-1 p-2">
                {dayBookings.length > 0 ? (
                  <>
                    {dayBookings.slice(0, 3).map((b) => (
                      <BookingCard key={b.id} booking={b} onClick={onBookingClick} />
                    ))}
                    {dayBookings.length > 3 && (
                      <p className="text-center text-xs text-gray-500">+{dayBookings.length - 3} more</p>
                    )}
                  </>
                ) : (
                  <p className="py-4 text-center text-xs text-gray-400">No bookings</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarView({ bookings, onBookingClick }) {
  const [view, setView] = useState("week"); // day | week

  return (
    <div>
      <div className="mb-4 inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
        <button
          onClick={() => setView("day")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            view === "day" ? "bg-ink text-white" : "text-gray-600 hover:text-ink"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setView("week")}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
            view === "week" ? "bg-ink text-white" : "text-gray-600 hover:text-ink"
          }`}
        >
          Week
        </button>
      </div>

      {view === "day" ? (
        <DayView bookings={bookings} onBookingClick={onBookingClick} />
      ) : (
        <WeekView bookings={bookings} onBookingClick={onBookingClick} />
      )}
    </div>
  );
}
