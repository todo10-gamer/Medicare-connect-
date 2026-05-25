# Medicare-connect-
# 🏥 MediCare Connect
### Full Stack Hospital Management & Appointment System

---

## 📁 Project Structure

```
medicare-connect/
│
├── backend/                        ← Node.js + Express server
│   ├── config/
│   │   └── db.js                   ← MongoDB connection setup
│   ├── controllers/                ← Business logic for each feature
│   │   ├── authController.js       ← Register, Login, Get Profile
│   │   ├── appointmentController.js← Book, View, Cancel appointments
│   │   ├── doctorController.js     ← Doctor profile management
│   │   ├── patientController.js    ← Patient profile management
│   │   └── adminController.js      ← Admin controls & dashboard
│   ├── middleware/
│   │   └── authMiddleware.js       ← JWT verification & role check
│   ├── models/                     ← MongoDB database schemas
│   │   ├── User.js                 ← Users (patient/doctor/admin)
│   │   ├── Doctor.js               ← Doctor profile & specialization
│   │   └── Appointment.js          ← Appointment details
│   ├── routes/                     ← URL route definitions
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── adminRoutes.js
│   ├── .env                        ← Environment variables (SECRET!)
│   ├── .gitignore
│   ├── package.json                ← Node.js dependencies
│   └── server.js                   ← Main server entry point
│
└── frontend/                       ← HTML, CSS, JavaScript
    ├── assets/                     ← Images, icons
    ├── css/
    │   └── style.css               ← All styling
    ├── js/
    │   ├── api.js                  ← API call helper functions
    │   ├── auth.js                 ← Auth utilities (login/logout)
    │   └── main.js                 ← Homepage logic
    ├── pages/
    │   ├── login.html              ← Login page
    │   ├── register.html           ← Registration page
    │   ├── patient-dashboard.html  ← Patient dashboard
    │   ├── doctor-dashboard.html   ← Doctor dashboard
    │   ├── admin-dashboard.html    ← Admin dashboard
    │   └── doctors.html            ← Public doctors listing
    └── index.html                  ← Homepage
```

---

## ⚙️ Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Frontend       | HTML5, CSS3, Vanilla JavaScript     |
| Backend        | Node.js v18+, Express.js            |
| Database       | MongoDB Atlas (Cloud)               |
| Authentication | JWT (JSON Web Tokens) + bcryptjs    |
| API Style      | REST API                            |

---

## 🚀 Setup Instructions (Step by Step)

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- A code editor like [VS Code](https://code.visualstudio.com/)

---

### Step 1: Set up MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up (free)
2. Create a new project → Create a free cluster
3. Click **Connect** → Choose **Drivers** → Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xyz.mongodb.net/`
5. Replace `<password>` with your actual password

---

### Step 2: Configure Environment Variables

Open `backend/.env` and fill in your details:

```env
PORT=5000
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xyz.mongodb.net/medicare_db
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
```

⚠️ **Never share your .env file or push it to GitHub!**

---

### Step 3: Install Backend Dependencies

Open terminal, navigate to the backend folder:

```bash
cd medicare-connect/backend
npm install
```

This installs: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon

---

### Step 4: Run the Backend Server

```bash
# For development (auto-restarts on file changes):
npm run dev

# OR for production:
npm start
```

You should see:
```
✅ Server running on http://localhost:5000
✅ MongoDB Connected: cluster0.xyz.mongodb.net
```

---

### Step 5: Run the Frontend

The frontend is plain HTML/CSS/JS - no build step needed!

**Option A: Use VS Code Live Server (Recommended)**
1. Install the "Live Server" extension in VS Code
2. Right-click on `frontend/index.html`
3. Click "Open with Live Server"
4. Opens at `http://127.0.0.1:5500`

**Option B: Open directly in browser**
- Double-click `frontend/index.html` to open in browser

---

## 🔗 API Endpoints Reference

### Authentication
| Method | URL                    | Access  | Description          |
|--------|------------------------|---------|----------------------|
| POST   | /api/auth/register     | Public  | Create new account   |
| POST   | /api/auth/login        | Public  | Login, returns token |
| GET    | /api/auth/me           | Private | Get current user     |

### Appointments
| Method | URL                           | Access         | Description              |
|--------|-------------------------------|----------------|--------------------------|
| POST   | /api/appointments/book        | Patient        | Book an appointment      |
| GET    | /api/appointments/my          | Patient/Doctor | Get my appointments      |
| PUT    | /api/appointments/:id/status  | Doctor/Admin   | Update status            |
| PUT    | /api/appointments/:id/cancel  | Any logged-in  | Cancel appointment       |

### Doctors
| Method | URL                    | Access  | Description              |
|--------|------------------------|---------|--------------------------|
| GET    | /api/doctors           | Public  | Get all approved doctors |
| GET    | /api/doctors/:id       | Public  | Get doctor details       |
| PUT    | /api/doctors/profile   | Doctor  | Update doctor profile    |

### Admin
| Method | URL                           | Access | Description         |
|--------|-------------------------------|--------|---------------------|
| GET    | /api/admin/dashboard          | Admin  | Dashboard stats     |
| GET    | /api/admin/users              | Admin  | Get all users       |
| GET    | /api/admin/appointments       | Admin  | Get all appointments|
| PUT    | /api/admin/approve-doctor/:id | Admin  | Approve a doctor    |
| DELETE | /api/admin/users/:id          | Admin  | Delete a user       |

---

## 👤 User Roles

| Role    | Permissions                                                   |
|---------|---------------------------------------------------------------|
| Patient | Register, login, search doctors, book/cancel appointments     |
| Doctor  | View appointments, update status, add prescription, manage profile |
| Admin   | Full access - approve doctors, manage all users & appointments|

---

## 🔐 How Authentication Works

1. User **registers/logs in** → Server generates a **JWT token**
2. Token is saved in browser's **localStorage**
3. For every protected API call, token is sent in the **Authorization header**:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Server **verifies** the token before processing the request
5. Token **expires** after 7 days → user must login again

---

## 🧪 Testing the API (Using Postman or Thunder Client)

### Test Register:
```json
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Test Patient",
  "email": "patient@test.com",
  "password": "test123",
  "role": "patient"
}
```

### Test Login:
```json
POST http://localhost:5000/api/auth/login
Body: {
  "email": "patient@test.com",
  "password": "test123"
}
```

---

## 👥 Team
**Team Name:** TECHNOTITANS
**Project:** MediCare Connect - Full Stack Hospital Management System
#
