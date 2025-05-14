require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Import MongoDB connection
const cors = require("cors");
const authRoutes=require("./routes/auth")
const cookieParser = require("cookie-parser");
const studentRoutes = require("./routes/student");
const professorRoutes = require("./routes/professor");
const appointmentRoutes = require("./routes/appointment");


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());


//app.use("/appointment", appointmentRoutes);


// Connect to MongoDB
connectDB().then(() => {
    console.log("✅ MongoDB Atlas is Connected Successfully");
}).catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
});

app.use("/auth", authRoutes)
app.use("/student", studentRoutes);
app.use("/professor", professorRoutes);
app.use("/professor", appointmentRoutes);
app.use("/", appointmentRoutes);



app.get("/", (req, res) => {
    res.send("Welcome to the Appointment Scheduler API");
});
app.get("/register",(req,res)=>{
    console.log("HILDk")
    res.send("hidajdjfl")
})




// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
