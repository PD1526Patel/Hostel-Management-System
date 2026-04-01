# 🏨 Hostel Management System (HMS)

A full-stack web application designed to streamline hostel operations, including student registration, complaint management, and fee tracking. Built with the **MERN** stack (using MySQL as the database).

## 🚀 Features

- **Secure Authentication:** Implemented JWT (JSON Web Tokens) for stateless session management.
- **Data Privacy:** Passwords are never stored in plain text; used **Bcrypt** for industry-standard hashing.
- **Role-Based Access Control (RBAC):**
  - **Admin:** System-wide analytics and user management.
  - **Warden:** Track, manage, and resolve student complaints.
  - **Student:** Lodge complaints, view history, and simulate fee payments.
- **Database Integrity:** Relational schema designed in MySQL with foreign key constraints.

## 🛠️ Tech Stack

- **Frontend:** React.js, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Security:** JWT, Bcrypt

## 📂 Project Structure

```text
HMS_new/
├── backend/          # Node/Express API
├── frontend/client/  # React Application
├── 1.sql             # Database Schema
└── .gitignore        # Version control exclusions
```
Done this on 1st April 2026