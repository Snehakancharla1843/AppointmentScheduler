# AppointmentScheduler
College Appointment Scheduler API

A Node.js/Express backend that enables secure, end-to-end appointment booking between students and professors. Professors publish available time slots, students browse and book, and professors can accept or cancel appointments. All interactions are protected by JWT-based authorization and data is stored in MongoDB.

Features

User Authentication

POST /auth/login for students and professors

JWT issued on login, validated by authMiddleware

Professor Dashboard

Publish Slots: POST /professor/dashboard/settimeslot

View Slots: GET /professor/dashboard/viewslots

Manage Appointments:

List booked/pending: GET /professor/dashboard/appointments

Filter by student: GET /professor/dashboard/appointments/:studentName

Accept booking: POST /professor/dashboard/appointments/:studentName/accept

Cancel booking: POST /professor/dashboard/appointments/:studentName/cancel

Student Dashboard

Browse Slots:

All slots: GET /student/dashboard/viewslots

By professor: GET /student/dashboard/viewslots/:professorName

Book Appointment: POST /student/dashboard/viewslots/:professorName/book

View My Appointments: GET /student/dashboard/appointments

Technologies Used

Node.js & Express for server and routing

MongoDB Atlas & Mongoose for data modeling

JSON Web Tokens (jsonwebtoken) for auth

dotenv for environment configuration

cors & cookie-parser for request handling

Postman for manual API testing

Prerequisites

Node.js (v14+)

MongoDB Atlas connection URI

Git

Installation & Setup

Clone the repository

bash
Copy
git clone https://github.com/Snehakancharla1843/AppointmentScheduler.git
cd college-appointment-scheduler
Install dependencies
npm install
Configure environment
Create a .env file in the project root:

env

MONGODB_URI=<Your MongoDB Atlas connection string>
JWT_SECRET=<Your JWT secret>
PORT=5000
Run the server
npm start
The API will be available at http://localhost:5000.





License
This project is licensed under the MIT License.
