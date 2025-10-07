import { format } from "date-fns";
import PropTypes from "prop-types"; // If you're using prop-types

const EventModal = ({
  isOpen,
  onClose,
  modalType, // 'add', 'edit', or 'convert'
  event,
  setEvent,
  onSave,
  modalRef,
  removeOriginalTask = false, // Default value for optional prop
  setRemoveOriginalTask = () => {}, // Default empty function for optional prop
}) => {
  // Get title based on modalType
  const getTitle = () => {
    switch (modalType) {
      case "add":
        return "Add New Event";
      case "edit":
        return "Edit Event";
      case "convert":
        return "Convert Task to Event";
      default:
        return "Event";
    }
  };

  // Get button text based on modalType
  const getButtonText = () => {
    switch (modalType) {
      case "add":
        return "Add Event";
      case "edit":
        return "Save Changes";
      case "convert":
        return "Convert to Event";
      default:
        return "Save";
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-#03030A backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all border border-purple-100 max-h-screen overflow-auto"
        ref={modalRef}
        style={{ position: "absolute" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
          {getTitle()}
        </h3>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            placeholder="Enter event title..."
            autoFocus
          />
        </div>

        <div
          className={modalType === "convert" ? "" : "grid grid-cols-2 gap-4"}
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium">
              Start Time
            </label>
            <input
              type="time"
              className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              value={format(event.start, "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":").map(Number);
                const newStart = new Date(event.start);
                newStart.setHours(hours);
                newStart.setMinutes(minutes);
                setEvent({ ...event, start: newStart });
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1 font-medium">
              End Time
            </label>
            <input
              type="time"
              className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              value={format(event.end, "HH:mm")}
              onChange={(e) => {
                const [hours, minutes] = e.target.value.split(":").map(Number);
                const newEnd = new Date(event.end);
                newEnd.setHours(hours);
                newEnd.setMinutes(minutes);
                setEvent({ ...event, end: newEnd });
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1 font-medium">Date</label>
          <input
            type="date"
            className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            value={format(event.start, "yyyy-MM-dd")}
            onChange={(e) => {
              const [year, month, day] = e.target.value.split("-").map(Number);
              const newStart = new Date(event.start);
              newStart.setFullYear(year, month - 1, day);

              const newEnd = new Date(event.end);
              newEnd.setFullYear(year, month - 1, day);

              setEvent({
                ...event,
                start: newStart,
                end: newEnd,
              });
            }}
          />
        </div>

        {modalType !== "convert" && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-1 font-medium">
              Description
            </label>
            <textarea
              className="w-full border border-purple-200 rounded-lg p-3 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              value={event.description || ""}
              onChange={(e) =>
                setEvent({ ...event, description: e.target.value })
              }
              placeholder="Add event details..."
              rows="3"
            />
          </div>
        )}

        {modalType === "convert" && (
          <div className="mb-4">
            <label className="flex items-center text-gray-700 font-medium">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-2 border-purple-300 text-purple-500 focus:ring-2 focus:ring-offset-0 focus:ring-purple-300"
                checked={removeOriginalTask}
                onChange={() => setRemoveOriginalTask(!removeOriginalTask)}
              />
              Remove original task after conversion
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 transition-opacity"
            onClick={onSave}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes if you're using them
EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalType: PropTypes.oneOf(["add", "edit", "convert"]).isRequired,
  event: PropTypes.object,
  setEvent: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  modalRef: PropTypes.object,
  removeOriginalTask: PropTypes.bool,
  setRemoveOriginalTask: PropTypes.func,
};

export default EventModal;
