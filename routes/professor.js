const express = require("express");
const authMiddleWare = require("../middleware/auth");
const router = express.Router();
const User = require("../models/User");

// ✅ Protected Route: Professor Dashboard
router.get("/dashboard", authMiddleWare, async(req, res) => {
    if (req.user.role !== "professor") {
        return res.status(403).json({ message: "Access Forbidden: Professors Only!" });
    }
    try {
        const professor = await User.findById(req.user.userId).select("name");
        if (!professor) {
            return res.status(404).json({ message: "Professor not found" });
        }
        
        res.json({ message: `Welcome back, ${professor.name}` });
    } catch (err) {
        console.error("❌ Error fetching professor name:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }

});

module.exports = router;
