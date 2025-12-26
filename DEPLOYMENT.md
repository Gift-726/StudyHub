# Deployment Guide for Studyhub

This guide will help you deploy your Studyhub app so others can see it.

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended ⭐

**Frontend (Vercel) - FREE**
- Automatic deployments from GitHub
- Fast CDN
- Easy setup

**Backend (Render) - FREE tier available**
- Easy Node.js deployment
- Environment variables management
- Free tier: Spins down after 15 min inactivity (wakes up automatically)

---

## Step-by-Step Deployment

### Part 1: Set Up MongoDB Atlas (Database) - FREE

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)**
   - Sign up for a free account
   - Create a new cluster (choose FREE tier)
   - Wait for cluster to be created (~5 minutes)

2. **Get Your Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/studyhub`

3. **Set Up Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Save

---

### Part 2: Deploy Backend to Render

1. **Go to [Render](https://render.com/)**
   - Sign up with GitHub (FREE account)
   - Click "New" → "Web Service"
   - Connect your GitHub repository (StudyHub)

2. **Configure Service:**
   - **Name:** studyhub-backend (or any name you prefer)
   - **Environment:** Node
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (select FREE tier)

3. **Configure Environment Variables:**
   - Go to "Environment" tab
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=your_mongodb_atlas_connection_string_here
     JWT_SECRET=your_super_secret_jwt_key_change_this
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```
   - Replace `MONGODB_URI` with your Atlas connection string
   - Replace `FRONTEND_URL` with your Vercel URL (you'll get this after deploying frontend)

4. **Deploy:**
   - Click "Create Web Service"
   - Render will run `npm install` and `npm start`
   - Wait for deployment to complete (2-3 minutes)
   - Copy your backend URL (looks like: `https://your-app.onrender.com`)

---

### Part 3: Deploy Frontend to Vercel

1. **Go to [Vercel](https://vercel.com/)**
   - Sign up with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory:** `frontend`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

2. **Add Environment Variable:**
   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace with your Render backend URL

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your frontend URL (looks like: `https://your-app.vercel.app`)

4. **Update Backend CORS:**
   - Go back to Render dashboard
   - Click on your backend service
   - Go to "Environment" tab
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Click "Save Changes" (Render will auto-redeploy)

---

### Note About Render Free Tier

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds to wake up
- Perfect for development and showing your work
- No credit card required
- If you need always-on service, upgrade to paid plan ($7/month)

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string copied
- [ ] Backend deployed (Render)
- [ ] Backend URL copied
- [ ] Frontend deployed (Vercel)
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] Backend CORS updated with frontend URL
- [ ] Test signup/login on deployed site

---

## Troubleshooting

### Backend not connecting to database
- Check MongoDB Atlas network access (allow all IPs)
- Verify connection string is correct
- Check environment variables in Render
- Wait 30-60 seconds if service just woke up (free tier)

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly
- Check backend CORS settings
- Make sure backend is deployed and running

### CORS errors
- Update `FRONTEND_URL` in Render environment variables
- Save changes (Render will auto-redeploy)
- Wait for redeployment to complete

---

## Your URLs After Deployment

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.onrender.com`

Share your frontend URL with others to show your work! 🚀

