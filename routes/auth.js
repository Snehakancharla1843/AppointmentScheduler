const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");



const router = express.Router();
router.post("/register", async (req, res) => {
    console.log("📩 Incoming Data:", req.body);
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            console.error("❌ Missing Fields:", { name, email, password, role });
            return res.status(400).json({ message: "All fields (name, email, password, role) are required" });
        }

        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        console.log("✅ User Registered Successfully:", newUser);
        return res.status(201).json({ message: "User registered successfully", user: { name: newUser.name, email: newUser.email, role: newUser.role } });
    } catch (err) {
        console.error("❌ Registration Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// // ✅ Register a New User
// router.post("/register", async (req, res) => {
//     console.log("📩 Incoming Data:", req.body);
//     const { name, email, password, role } = req.body;

//     try {
//         // Ensure all required fields are provided
//         if (!name || !email || !password || !role) {
//             console.error("❌ Missing Fields:", { name,email, password, role });
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // Check if the user already exists
//         let user = await User.findOne({ email });
//         if (user) return res.status(400).json({ message: "User already exists" });

//         // Hash the password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user = new User({ email, password: hashedPassword, role });

//         // Save user in the database
//         await user.save();

//         console.log("✅ User Registered Successfully:", user);
//         return res.status(201).json({ message: "User registered successfully" });
//     } catch (err) {
//         console.error("❌ Registration Error:", err);
//         return res.status(500).json({ message: "Server error", error: err.message });
//     }
// });

// ✅ Login User & Generate JWT Token
router.post("/login", async (req, res) => {
    console.log("📩 Incoming Login Request:", req.body);
    const { email, password } = req.body;

    try {
        // Ensure email and password are provided
        if (!email || !password) {
            console.error("❌ Missing Fields:", { email, password });
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("✅ User Logged In Successfully:", user.email);
        return res.json({ name:user.name,token, role: user.role });
    } catch (err) {
        console.error("❌ Login Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
