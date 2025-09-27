// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [appointmentType, setAppointmentType] = useState("Regular Check-up");
  const [date, setDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const appointmentDurations = {
    "Regular Check-up": 30,
    "Specific Treatment": 60,
    Operation: 120,
  };

  // Fetch available slots from backend
  const fetchSlots = async () => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/allAvailableSlots?date=${formattedDate}&type=${appointmentType}`
      );
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [date, appointmentType]);

  const handleBooking = async () => {
    if (!selectedSlot || !name || !contact) {
      alert("Please fill all fields and select a slot.");
      return;
    }

    const formattedDate = date.toISOString().split("T")[0];

    const appointmentData = {
      patient_name: name,
      contact_info: contact,
      appointment_type: appointmentType,
      duration: appointmentDurations[appointmentType],
      date: formattedDate,
      time: selectedSlot,
    };

    try {
      await axios.post("http://127.0.0.1:8000/appointments", appointmentData);
      setMessage(`Appointment booked successfully at ${selectedSlot}!`);
      setSelectedSlot("");
      setName("");
      setContact("");
      fetchSlots();
    } catch (error) {
      console.error("Booking failed:", error);
      setMessage("Booking failed. Try again!");
    }
  };

  return (
    <div className="app-container">
      <div className="calendar-section">
        <h2>Select Date</h2>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
          inline
        />
        <div className="type-selection">
          <h3>Appointment Type</h3>
          <select
            value={appointmentType}
            onChange={(e) => setAppointmentType(e.target.value)}
          >
            <option>Regular Check-up</option>
            <option>Specific Treatment</option>
            <option>Operation</option>
          </select>
        </div>
      </div>

      <div className="booking-section">
        <h2>Available Slots</h2>
        {slots.length > 0 ? (
          <div className="slots-container">
            {slots.map((slot) => (
              <button
                key={slot}
                className={selectedSlot === slot ? "slot selected" : "slot"}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <p className="no-slots">No slots available</p>
        )}

        <h2>Enter Your Details</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Contact Number / Email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <button className="book-btn" onClick={handleBooking}>
          Book Appointment
        </button>

        {message && <p className="confirmation">{message}</p>}
      </div>
    </div>
  );
}

export default App;
