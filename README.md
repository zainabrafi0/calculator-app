# Full-Stack Calculator Application

## Project Overview
A complete MERN stack (MongoDB, Express, React, Node.js) monorepo application. It features a digital glassmorphism calculator capable of processing mathematical string expressions, complete with user authentication (JWT), secure password hashing (Bcrypt), and full CRUD operations to manage calculation history. 

## Technology Stack
* **Frontend:** React.js (Vite), Tailwind CSS v4, React Router, Axios
* **Backend:** Node.js, Express.js, JWT, Bcrypt
* **Database:** MongoDB Atlas
* **Architecture:** Monorepo 

## Features
- **Modern UI:** Responsive calculator interface built with React and Tailwind CSS.
- **Enterprise Security:** Authentication using `HttpOnly` cookies and strict CORS policies.
- **Data Persistence:** User accounts and mathematical histories are securely stored in MongoDB.
- **Smart Validation:** Regex-powered frontend and backend validation for user inputs.

---

## Installation Steps

### 1. Clone the repository
\`\`\`bash
git clone <your-github-repo-url>
cd calculator-app
\`\`\`

### 2. Install Backend Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Install Frontend Dependencies
\`\`\`bash
cd ../frontend
npm install
\`\`\`

---

## Environment Variables
Create a `.env` file inside the `backend/` directory with the following variables:

\`\`\`env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/calculator-app?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret
\`\`\`

---

## Running the Application
To run the full-stack application locally, you will need two separate terminal windows.

**Terminal 1 (Backend):**
\`\`\`bash
cd backend
npm run dev
\`\`\`

**Terminal 2 (Frontend):**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

---

## API Endpoints

### Authentication APIs
* `POST /api/auth/register` - Create a new user account and receive secure cookie (Requires: name, email, password)
* `POST /api/auth/login` - Authenticate user and receive secure cookie (Requires: email, password)
* `POST /api/auth/logout` - Destroy secure cookie and end session (Requires: Authenticated Cookie)
* `PUT /api/auth/profile` - Update user profile credentials (Requires: Authenticated Cookie, Optional: name, password)
* `DELETE /api/auth/profile` - Delete user account and scrub PII to anonymize history (Requires: Authenticated Cookie)

### Calculator APIs
* `POST /api/calculations` - Save a new math expression and result to the database (Requires: Authenticated Cookie, expression, result)
* `GET /api/calculations` - Fetch the authenticated user's calculation history (Requires: Authenticated Cookie)
* `DELETE /api/calculations/:id` - Delete a specific calculation record (Requires: Authenticated Cookie)
* `DELETE /api/calculations` - Clear all calculation history for the user (Requires: Authenticated Cookie)

---

## Author
**Zainab Rafi**