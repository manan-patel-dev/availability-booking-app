import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function PublicBooking() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");

  const updateSlots = (slotsData) => {
    setData(slotsData);

    if (slotsData.length > 0) {
      setSelectedDate(slotsData[0].date);
    }
  };

  const refreshSlots = async () => {
    try {
      const res = await api.get(`/bookings/${slug}/slots`);

      updateSlots(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadSlots = async () => {
      try {
        const res = await api.get(`/bookings/${slug}/slots`);

        if (isActive) {
          updateSlots(res.data);
        }
      } catch (err) {
        if (isActive) {
          setError(err.response?.data?.message || "Something went wrong");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      isActive = false;
    };
  }, [slug]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      alert("Please select a slot");
      return;
    }

    try {
      await api.post(`/bookings/${slug}/book`, {
        date: selectedDate,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
      });

      alert("Booking Successful");

      setSelectedSlot(null);
      refreshSlots();
    } catch (err) {
      alert(err.response?.data?.message || "Booking Failed");
    }
  };

  if (loading) {
    return (
      <main className="app-page">
        <section className="page-shell narrow-shell">
          <div className="panel center-panel">
            <h1>Loading slots...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-page">
        <section className="page-shell narrow-shell">
          <div className="panel center-panel">
            <h1>Unable to load booking</h1>
            <p className="page-description">{error}</p>
          </div>
        </section>
      </main>
    );
  }

  const currentDate = data.find((item) => item.date === selectedDate);

  return (
    <main className="app-page">
      <section className="page-shell narrow-shell">
        <header className="page-header">
          <div>
            <p className="page-kicker">Public Booking</p>
            <h1>Book Appointment</h1>
            <p className="page-description">
              Choose an available date and time slot to confirm your booking.
            </p>
          </div>
        </header>

        <section className="panel">
          <div className="panel-header">
            <h2>Select Date</h2>
            <p>Available dates are listed below.</p>
          </div>

          {data.length === 0 ? (
            <p className="empty-state">No available dates found.</p>
          ) : (
            <div className="button-group">
              {data.map((item) => (
                <button
                  type="button"
                  className={
                    item.date === selectedDate
                      ? "choice-button is-active"
                      : "choice-button"
                  }
                  key={item.date}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setSelectedSlot(null);
                  }}
                >
                  {item.date}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Available Slots</h2>
            <p>Each slot is 30 minutes.</p>
          </div>

          {currentDate?.slots.length ? (
            <div className="button-group">
              {currentDate.slots.map((slot) => (
                <button
                  type="button"
                  className={
                    selectedSlot?.start === slot.start
                      ? "choice-button is-active"
                      : "choice-button"
                  }
                  key={slot.start}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot.start}
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-state">No slots available for this date.</p>
          )}
        </section>

        {selectedSlot && (
          <section className="panel confirm-panel">
            <div>
              <p className="page-kicker">Selected Slot</p>
              <strong>
                {selectedDate}, {selectedSlot.start} to {selectedSlot.end}
              </strong>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={handleBooking}
            >
              Book Appointment
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
