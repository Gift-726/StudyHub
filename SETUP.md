# Setup Instructions

## Environment Variables

### Backend (.env file in `backend/` directory)

Create a `.env` file in the `backend` directory with the following content:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Replace `your_super_secret_jwt_key_here_change_this_in_production` with a strong, random string for production
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Example Atlas URI: `mongodb+srv://username:password@cluster.mongodb.net/studyhub`

### Frontend (.env file in `frontend/` directory)

Create a `.env` file in the `frontend` directory with the following content:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Step 1: Start MongoDB

If using local MongoDB:
- Make sure MongoDB is installed and running on your system
- MongoDB typically runs on `mongodb://localhost:27017`

If using MongoDB Atlas:
- No local installation needed
- Use your Atlas connection string in the `.env` file

### Step 2: Start the Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 3: Start the Frontend Development Server

Open a new terminal window:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Testing the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the Login page
3. Click "Create Account" to go to the Sign Up page
4. Create a new account with:
   - Email
   - Password (minimum 6 characters)
   - First Name
   - Last Name
5. After successful registration, you'll be redirected to the dashboard
6. You can logout and test the login functionality

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify your `.env` file exists and has correct values
- Check if port 5000 is already in use

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env` file
- Check CORS settings in backend if using different ports

### MongoDB connection errors
- Verify MongoDB is running (if local)
- Check MongoDB connection string in `.env`
- Ensure network access is configured (if using Atlas)

