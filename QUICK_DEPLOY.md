# 🚀 Quick Deployment Guide

Follow these steps to get your app online in 15 minutes!

## Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a FREE account
3. Create a FREE cluster (M0 - Free tier)
4. Wait for cluster to be created
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database password
8. Add `/studyhub` at the end: `mongodb+srv://user:password@cluster.mongodb.net/studyhub`
9. Go to "Network Access" → "Add IP Address" → "Allow Access from Anywhere"

**Save this connection string - you'll need it!**

---

## Step 2: Deploy Backend to Render (5 minutes)

1. Go to https://render.com/
2. Sign up with GitHub (FREE account)
3. Click "New" → "Web Service"
4. Connect your GitHub repository (StudyHub)
5. Configure:
   - **Name:** studyhub-backend (or any name)
   - **Environment:** Node
   - **Root Directory:** backend
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (select FREE tier)
6. Go to "Environment" tab and add these variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=paste_your_mongodb_connection_string_here
   JWT_SECRET=make_a_random_secret_key_here
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   (You'll update FRONTEND_URL after deploying frontend)
7. Click "Create Web Service"
8. Wait for deployment (takes 2-3 minutes)
9. **Copy your backend URL** (e.g., `https://studyhub-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your StudyHub repository
5. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
6. Go to "Environment Variables"
7. Add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   (Use the Railway URL you copied)
8. Click "Deploy"
9. **Copy your frontend URL** (e.g., `https://studyhub.vercel.app`)

---

## Step 4: Update Backend CORS (1 minute)

1. Go back to Render dashboard
2. Click on your backend service
3. Go to "Environment" tab
4. Update the `FRONTEND_URL` variable with your Vercel URL
5. Click "Save Changes" (Render will auto-redeploy)

---

## ✅ Done!

Your app is now live! Share your Vercel URL with others.

**Frontend URL:** `https://your-app.vercel.app`  
**Backend URL:** `https://your-app.onrender.com`

---

## 🐛 Troubleshooting

**Can't connect to database?**
- Check MongoDB Atlas Network Access (must allow all IPs)
- Verify connection string is correct

**Frontend shows errors?**
- Check `VITE_API_URL` is set correctly in Vercel
- Make sure backend is running (check Railway logs)

**CORS errors?**
- Update `FRONTEND_URL` in Render with your Vercel URL
- Save changes (Render will auto-redeploy)

---

## 💡 Tips

- Render FREE tier: Perfect for development (spins down after 15 min inactivity, but wakes up on first request)
- Vercel is completely free for personal projects
- MongoDB Atlas free tier is perfect for development
- All deployments auto-update when you push to GitHub!
- Render free tier may take 30-60 seconds to wake up if inactive

