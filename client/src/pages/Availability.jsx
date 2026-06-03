import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Availability() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookingLink, setBookingLink] = useState("");
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateAvailability = () => {
    if (!date || !startTime || !endTime) {
      return "Please select date, start time and end time.";
    }

    if (startTime >= endTime) {
      return "End time must be after start time.";
    }

    return "";
  };

  const handleSave = async () => {
    const validationMessage = validateAvailability();

    if (validationMessage) {
      setMessage(validationMessage);
      return;
    }

    try {
      setIsSaving(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/availability",
        {
          date,
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSlots((prev) => [...prev, res.data]);

      setDate("");
      setStartTime("");
      setEndTime("");
      setMessage("Availability saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to save availability.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      setIsGenerating(true);
      setMessage("");
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/booking-links/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBookingLink(`${window.location.origin}/booking/${res.data.slug}`);
      setMessage("Booking link is ready to share.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to generate link.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <main className="app-page">
      <section className="page-shell">
        <header className="page-header">
          <div>
            <p className="page-kicker">Dashboard</p>
            <h1>Availability</h1>
            <p className="page-description">
              Add available time ranges and generate a public booking link.
            </p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <div className="content-grid">
          <section className="panel">
            <div className="panel-header">
              <h2>Add Time Slot</h2>
              <p>Select a date and time range for appointments.</p>
            </div>

            <div className="form-grid">
              <label className="form-field">
                Date
                <input
                  className="app-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label className="form-field">
                Start time
                <input
                  className="app-input"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>

              <label className="form-field">
                End time
                <input
                  className="app-input"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Availability"}
            </button>

            {message && <p className="status-message">{message}</p>}
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2>Public Booking Link</h2>
              <p>Share this link with people who need to book a slot.</p>
            </div>

            <button
              type="button"
              className="secondary-button full-width"
              onClick={handleGenerateLink}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Link"}
            </button>

            {bookingLink && (
              <div className="link-box">
                <a href={bookingLink} target="_blank" rel="noreferrer">
                  {bookingLink}
                </a>
              </div>
            )}
          </section>
        </div>

        <section className="panel saved-panel">
          <div className="panel-header">
            <h2>Saved Slots</h2>
            <p>Your newly added slots for this session.</p>
          </div>

          {slots.length === 0 ? (
            <p className="empty-state">No availability added yet.</p>
          ) : (
            <div className="slot-list">
              {slots.map((slot) => (
                <div className="slot-item" key={slot.id}>
                  <span>{slot.date}</span>
                  <strong>
                    {slot.startTime} to {slot.endTime}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
