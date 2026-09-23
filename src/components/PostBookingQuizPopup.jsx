import StyleQuiz from "./StyleQuiz";

// Shown after a customer taps "Send via WhatsApp/SMS" on a completed
// booking — a while-you-wait nudge to explore (and maybe add) another
// service, rather than a homepage section.
export default function PostBookingQuizPopup({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold">While you wait...</h2>
            <p className="mt-1 text-sm text-gray-500">
              Take our quick style quiz — maybe there's something else you'd like too.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg leading-none text-gray-500 hover:bg-gray-200"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <StyleQuiz />
        </div>
      </div>
    </div>
  );
}
