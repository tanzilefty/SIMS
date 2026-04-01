# 🎓 Student Information Management System (SIMS)

A simple, browser-based **Student Information Management System (SIMS)** built using **HTML, CSS, and Vanilla JavaScript**. This project is designed for educational purposes and demonstrates how to manage student data without any backend or database.


## 📌 Project Overview

SIMS is a lightweight web application that allows:

- **Admins** to manage student records
- **Students** to view their academic results

The system runs entirely in the browser using **localStorage**, so no server or database is required.


## 🚀 Features

### 🔐 Authentication System
- Role-based login (Admin / Student)
- Admin login with username & password
- Student login using Student ID
- Session handling using `localStorage`

### 👨‍💼 Admin Dashboard
- ➕ Add new students
- 📝 Assign marks & auto-generate grades
- 📋 View all students
- ❌ Delete student records

### 👨‍🎓 Student Dashboard
- View personal information
- View marks and grades
- "No Result Found" message if not assigned


## 🧮 Grade System

| Marks Range | Grade | Performance |
|------------|------|------------|
| 80 - 100   | A+   | Excellent  |
| 70 - 79    | A    | Very Good  |
| 60 - 69    | B    | Good       |
| 50 - 59    | C    | Satisfactory |
| Below 50   | F    | Needs Improvement |


## 🛠️ Technology Stack

- **HTML5** – Structure
- **CSS3** – Styling (No frameworks)
- **JavaScript** – Logic
- **localStorage** – Data storage

## 📁 Project Structure

student-information-system/
├── index.html      # Landing page
├── login.html      # Login page
├── admin.html      # Admin dashboard
├── student.html    # Student dashboard
├── styles.css      # Styling
└── app.js          # Main JavaScript logic



## 🔄 User Flow

### Admin Flow

Landing Page → Login → Admin Dashboard
↓
Manage Students
↓
Logout


### Student Flow

Landing Page → Login → Student Dashboard
↓
View Result
↓
Logout



## 🔒 Security Features

- Role-based access control
- Session validation using localStorage
- Students can only view their own data
- Input validation for forms
- Basic XSS protection


## 📦 How to Run

1. Download or clone the repository:
   ```bash
   git clone https://github.com/tanzilefty/SIMS.git

2. Open `index.html` in your browser.

> ✅ No installation required
> ✅ Works offline


## 🧪 Testing

* Admin login (valid/invalid)
* Student login
* Add/Edit/Delete students
* Grade calculation
* Role-based access restriction


## 🎯 Benefits

### For Admins

* Easy student management
* Automatic grade calculation
* No paperwork

### For Students

* Instant result access
* Simple interface

### For Institutions

* Zero cost
* No server needed
* Easy deployment


## ⚠️ Limitations

* Data stored in browser (can be cleared)
* No multi-user sync
* No cloud backup


## 🔮 Future Improvements

* Export data (CSV)
* Printable reports
* Search functionality
* Multi-subject support
* Attendance tracking
* Email notifications
* Cloud sync
* Parent portal


## 👨‍💻 Author

**Group E Development Team**
📅 April 2026


## 📄 License

This project is for educational purposes only.

