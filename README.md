# Studyhub

A full-stack web application designed to boost academic performance by providing educational video content for students.

## Tech Stack

- **Frontend**: React.js with JavaScript
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose

## Features

- User authentication (Sign Up & Login)
- Secure password hashing
- JWT-based authentication
- Protected routes
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Environment Setup

1. **Backend**: Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000
```

2. **Frontend**: Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start MongoDB** (if running locally):
   - Make sure MongoDB is running on your system

2. **Start the Backend**:
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

3. **Start the Frontend**:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:3000`

## Project Structure

```
Studyhub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
└── assets/
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

## Future Features

- Video listing and playback
- YouTube video embedding
- Course categories
- Progress tracking
- User profiles
- Search functionality

## License

ISC

