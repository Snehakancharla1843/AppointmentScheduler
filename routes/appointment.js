const express = require("express");
const authMiddleware = require("../middleware/auth");
const Appointment = require("../models/Appointment");
const router = express.Router();
const User = require("../models/User");

/**
 * ✅ Step 1: Professor Creates Available Time Slots
 * Professors can set their available time slots for appointments.
 */
router.post("/dashboard/settimeslot", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can Create Time Slots!" });
    }

    const { date, time } = req.body;
    console.log("🔍 Creating appointment with data:", { date, time, professorId: req.user.userId });

    try {
        if (!date || !time) {
            console.log("❌ Missing required fields: date or time");
            return res.status(400).json({ message: "Date and time are required" });
        }

        const newAppointment = new Appointment({
            professorId: req.user.userId,
            date,
            time,
            status: "available"
        });

        await newAppointment.save();
        console.log("✅ Time slot created successfully:", newAppointment);
        res.status(201).json({ message: "Time slot created successfully", appointment: newAppointment });
    } catch (err) {
        console.error("❌ Error creating time slot:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//Professor View their appointments

router.get("/professor/dashboard/appointments", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can View Their Appointments!" });
    }

    try {
        console.log("🔍 Fetching appointments for professor:", req.user.userId);
        
        const appointments = await Appointment.find({ professorId: req.user.userId, status: { $in: ["booked", "pending"] } }).populate("studentId", "name email");
        
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }
        
        res.status(200).json({ appointments });
    } catch (err) {
        console.error("❌ Error fetching professor appointments:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
//Professor view their appointments by student name

router.get("/professor/dashboard/appointments/:studentName", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can View Appointments!" });
    }

    try {
        const { studentName } = req.params;
        console.log("🔍 Fetching appointments for student:", studentName, "by professor:", req.user.userId);
        
        const student = await User.findOne({ name: studentName, role: "student" });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const appointments = await Appointment.find({ professorId: req.user.userId, studentId: student._id }).populate("studentId", "name email");
        
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found for this student" });
        }
        
        res.status(200).json({ appointments });
    } catch (err) {
        console.error("❌ Error fetching student appointments:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

/**
 * ✅ Professors Accept an Appointment Using Student Name
 */
router.post("/professor/dashboard/appointments/:studentName/accept", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can Accept Appointments!" });
    }

    try {
        const { studentName } = req.params;
        console.log("✅ Accepting appointment for student:", studentName, "by professor:", req.user.userId);
        
        const student = await User.findOne({ name: studentName, role: "student" });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const appointment = await Appointment.findOne({ professorId: req.user.userId, studentId: student._id, status: "booked" });
        
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or already processed" });
        }

        appointment.status = "accepted";
        await appointment.save();

        console.log("✅ Appointment accepted successfully:", appointment);
        res.status(200).json({ message: "Appointment accepted successfully", appointment });
    } catch (err) {
        console.error("❌ Error accepting appointment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//professor canacel the appointment using student name

router.post("/professor/dashboard/appointments/:studentName/cancel", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can Cancel Appointments!" });
    }

    try {
        const { studentName } = req.params;
        console.log("❌ Cancelling accepted appointment for student:", studentName, "by professor:", req.user.userId);
        
        const student = await User.findOne({ name: studentName, role: "student" });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const appointment = await Appointment.findOne({ professorId: req.user.userId, studentId: student._id, status: { $in: ["accepted", "booked", "pending"] } });
        
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or already processed" });
        }

        appointment.status = "cancelled";
        await appointment.save();

        console.log("❌ Appointment cancelled successfully:", appointment);
        res.status(200).json({ message: "Appointment cancelled successfully", appointment });
    } catch (err) {
        console.error("❌ Error cancelling appointment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
/**
 * 
 * ✅ Professors Accept an Appointment Using Student Name
 */
// router.post("/professor/dashboard/appointments/:studentName/accept", authMiddleware, async (req, res) => {
//     if (req.user.role !== "professor") {
//         return res.status(403).json({ message: "Access Forbidden: Only Professors Can Accept Appointments!" });
//     }

//     try {
//         const { studentName } = req.params;
//         console.log("✅ Accepting appointment for student:", studentName, "by professor:", req.user.userId);
        
//         const student = await User.findOne({ name: studentName, role: "student" });
//         if (!student) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         const appointment = await Appointment.findOne({ professorId: req.user.userId, studentId: student._id, status: "booked" });
        
//         if (!appointment) {
//             return res.status(404).json({ message: "Appointment not found or already processed" });
//         }

//         appointment.status = "accepted";
//         await appointment.save();

//         console.log("✅ Appointment accepted successfully:", appointment);
//         res.status(200).json({ message: "Appointment accepted successfully", appointment });
//     } catch (err) {
//         console.error("❌ Error accepting appointment:", err);
//         res.status(500).json({ message: "Server error", error: err.message });
//     }
// });

/**
 * ✅ Professor Views Available Time Slots
 * Professors can see all their available time slots.
 */
router.get("/dashboard/viewslots", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can View Time Slots!" });
    }

    try {
        const slots = await Appointment.find({ professorId: req.user.userId });
        res.status(200).json({ appointments: slots });
    } catch (err) {
        console.error("❌ Error fetching professor's time slots:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    } 
});
router.post("/professor/dashboard/appointments/:studentName/cancel", authMiddleware, async (req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Only Professors Can Cancel Appointments!" });
    }

    try {
        const { studentName } = req.params;
        console.log("❌ Cancelling appointment for student:", studentName, "by professor:", req.user.userId);
        
        const student = await User.findOne({ name: studentName, role: "student" });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const appointment = await Appointment.findOne({ professorId: req.user.userId, studentId: student._id, status: { $in: ["booked", "pending"] } });
        
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found or already processed" });
        }

        appointment.status = "cancelled";
        await appointment.save();

        console.log("❌ Appointment cancelled successfully:", appointment);
        res.status(200).json({ message: "Appointment cancelled successfully", appointment });
    } catch (err) {
        console.error("❌ Error cancelling appointment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//studnet can view the available time slots of all professors
router.get("/student/dashboard/viewslots", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Access Forbidden: Only Students Can View Available Slots!" });
    }

    try {  
        console.log("🔍 Fetching available slots for students");
        
        const slots = await Appointment.find({ status: "available" }).populate("professorId", "name email _id");
        
        if (!slots || slots.length === 0) {
            console.log("⚠️ No available slots found");
            return res.status(404).json({ message: "No available slots found" });
        }
        
        // Formatting the response
        const formattedSlots = slots.map(slot => ({
            professor: {
                name: slot.professorId.name,
                
                
                email: slot.professorId.email,
                id: slot.professorId._id
            },
            availability: {
                date: slot.date,
                time: slot.time,
                status: slot.status
            }
        }));
        
        console.log("✅ Available slots fetched successfully:", formattedSlots);
        res.status(200).json({ appointments: formattedSlots });
    } catch (err) {
        console.error("❌ Error fetching available slots for students:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


/**
 * ✅ Students View Specific Professor's Available Time Slots by Name
 */
router.get("/student/dashboard/viewslots/:professorName", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Access Forbidden: Only Students Can View Available Slots!" });
    }

    try {  
        const { professorName } = req.params;
        console.log("🔍 Fetching available slots for professor:", professorName);
        
        const professor = await User.findOne({ name: professorName, role: "professor" });
        if (!professor) {
            console.log("⚠️ No professor found with that name");
            return res.status(404).json({ message: "No professor found with that name" });
        }
        
        const slots = await Appointment.find({ professorId: professor._id, status: "available" }).populate("professorId", "name email _id");
        
        if (!slots || slots.length === 0) {
            console.log("⚠️ No available slots found for this professor");
            return res.status(404).json({ message: "No available slots found for this professor" });
        }
        
        // Formatting the response
        const formattedSlots = slots.map(slot => ({
            
            professor: {

                name: slot.professorId.name,
                email: slot.professorId.email,
                id:slot.professorId
                
                
            },
            
            availability: {
                date: slot.date,
                time: slot.time,
                status: slot.status
            }
        }));
        
        console.log("✅ Available slots for professor fetched successfully:", formattedSlots);
        res.status(200).json({ appointments: formattedSlots });
    } catch (err) {
        console.error("❌ Error fetching available slots for professor:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

//Students book the appointment of a profesor
router.post("/student/dashboard/viewslots/:professorName/book", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Access Forbidden: Only Students Can Book Appointments!" });
    }

    const { professorName } = req.params;
    console.log("🔍 Booking appointment for student:", req.user.userId, "with professor:", professorName);

    try {
        // Find professor by name
        const professor = await User.findOne({ name: professorName, role: "professor" });
        if (!professor) {
            console.log("⚠️ No professor found with that name");
            return res.status(404).json({ message: "No professor found with that name" });
        }

        // Find the earliest available slot for this professor
        const appointment = await Appointment.findOne({ professorId: professor._id, status: "available" });
        if (!appointment) {
            console.log("⚠️ No available appointment slots for this professor");
            return res.status(404).json({ message: "No available appointment slots for this professor" });
        }

        // Book the appointment
        appointment.studentId = req.user.userId;
        appointment.status = "booked";
        await appointment.save();

        console.log("✅ Appointment booked successfully:", appointment);
        res.status(200).json({ message: "Appointment booked successfully", appointment });
    } catch (err) {
        console.error("❌ Error booking appointment:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

/**
 * ✅ Student Views Their Booked or Cancelled Appointments
 */
router.get("/student/dashboard/appointments", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Access Forbidden: Only Students Can View Their Appointments!" });
    }

    try {
        console.log("🔍 Fetching appointments for student:", req.user.userId);
        
        const appointments = await Appointment.find({ studentId: req.user.userId }).populate("professorId", "name email");
        
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ message: "No appointments found" });
        }
        
        res.status(200).json({ appointments });
    } catch (err) {
        console.error("❌ Error fetching student appointments:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
module.exports = router;