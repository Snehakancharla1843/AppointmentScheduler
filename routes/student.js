const express = require("express");
const authMiddleware = require("../middleware/auth"); // Import authentication middleware
const router = express.Router();
const User = require("../models/User"); // Import User model


   
  
router.get("/dashboard", authMiddleware, async (req, res) => {
    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Access Forbidden: Students Only!" });
    }
    
    try {
        const student = await User.findById(req.user.userId).select("name");
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        res.json({ message: `Welcome back, ${student.name}` });
    } catch (err) {
        console.error("❌ Error fetching student name:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

 
module.exports = router;
