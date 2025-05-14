const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    date: { type: String, required: true }, // Storing date as a string (e.g., "2024-04-01")
    time: { type: String, required: true }, // Storing time as a string (e.g., "10:00 AM")
    status: { 
        type: String, 
        enum: ["available", "booked", "pending", "accepted", "cancelled"], 
        default: "available" 
    }
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
