# Simple Habit Tracker

A full-stack web application designed to help users build and maintain positive habits. It features a secure REST API backend built with Node.js/Express and a modern React frontend.

## Features

- **User Authentication**: Secure registration and login with email/password.
- **JWT Session Management**: Uses `httpOnly` cookies with access and refresh tokens for secure, persistent user sessions.
- **Social Login**: Frontend is configured for Google Sign-In via Firebase.
- **Habit Management**: Users can create and view their personal habits.
- **Daily Check-ins**: Functionality to mark habits as completed for the day.
- **Protected API**: Backend routes are protected to ensure users can only access their own data.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Token (JWT), bcryptjs, cookie-parser
- **Frontend**: React (Vite), Firebase Authentication

## Project Structure

```
SHT/
├── backend/         # Node.js & Express REST API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   └── ...
├── frontend/        # React Client Application
│   ├── src/
│   └── ...
└── README.md
```

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn
- A running MongoDB instance (local or cloud-based like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    CLIENT_URL=http://localhost:5173
    ACCESS_TOKEN_SECRET=your_strong_access_token_secret
    REFRESH_TOKEN_SECRET=your_strong_refresh_token_secret
    ```
4.  **Start the server:**
    ```sh
    npm start
    ```
    The backend server will be running on `http://localhost:5000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Update Firebase Config** in `src/firebaseConfig.js` with your own Firebase project credentials.

4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

---

## API Endpoints

All habit-related routes are protected and require a valid JWT access token.

| Method | Endpoint                  | Description                               |
| :----- | :------------------------ | :---------------------------------------- |
| `POST` | `/api/auth/register`      | Register a new user.                      |
| `POST` | `/api/auth/login`         | Log in a user and return tokens.          |
| `POST` | `/api/auth/refresh`       | Refresh an expired access token.          |
| `GET`  | `/api/auth/me`            | Get the currently authenticated user.     |
| `GET`  | `/api/habits`             | Get all habits for the logged-in user.    |
| `POST` | `/api/habits`             | Create a new habit for the user.          |
| `POST` | `/api/habits/:id/checkin` | Mark a habit as completed for the day.    |

---

## Future Improvements

- **Full CRUD for Habits**: Implement `Update` and `Delete` functionality.
- **Input Validation**: Add robust server-side validation for all API inputs using a library like `Joi` or `express-validator`.
- **Testing**: Write a comprehensive suite of unit and integration tests for the backend using Jest and Supertest.
- **Data Visualization**: Add charts or calendars to visualize habit streaks and progress.
