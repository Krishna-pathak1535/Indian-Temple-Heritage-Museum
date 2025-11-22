# Deployment Guide - Indian Temple Heritage Museum

## Overview
This guide will help you deploy your complete project (frontend, backend, and database) for free using Railway.app for the backend/database and Vercel for the frontend.

## Prerequisites
- ✅ GitHub account connected to Railway.app
- ✅ Code pushed to GitHub repository (Krishna-pathak1535/Indian-Temple-Heritage-Museum)
- ✅ Railway account created
- ✅ Vercel account (sign up at https://vercel.com with your GitHub account)

## Cost Breakdown
- **Railway**: $5 free credit per month (sufficient for academic showcase)
- **Vercel**: Unlimited free tier for frontend hosting
- **Total**: FREE for your use case

---

## Part 1: Deploy Backend + Database to Railway

### Step 1: Create New Railway Project
1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Krishna-pathak1535/Indian-Temple-Heritage-Museum`
5. Railway will detect your project

### Step 2: Configure Backend Service
1. After selecting the repo, Railway will create a service
2. Click on the service to configure it
3. Go to **Settings** tab
4. Set **Root Directory** to: `backend`
5. Under **Deploy**, verify it detected the correct start command from Procfile

### Step 3: Add MySQL Database
1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"MySQL"**
3. Railway will provision a MySQL database (this uses your $5 credit)
4. Wait for the database to be ready (takes ~30 seconds)

### Step 4: Configure Environment Variables
1. Click on your backend service
2. Go to **Variables** tab
3. Railway automatically creates these MySQL variables (linked from database):
   - `MYSQL_HOST` (or `MYSQLHOST`)
   - `MYSQL_PORT` (or `MYSQLPORT`)
   - `MYSQL_USER` (or `MYSQLUSER`)
   - `MYSQL_PASSWORD` (or `MYSQLPASSWORD`)
   - `MYSQL_DATABASE` (or `MYSQLDATABASE`)

4. **Manually add these additional variables**:
   ```
   SECRET_KEY=your-super-secret-key-change-this-in-production-123456789
   ENVIRONMENT=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
   
   **Important**: 
   - Generate a strong `SECRET_KEY` (at least 32 random characters)
   - You'll update `FRONTEND_URL` after deploying frontend in Part 2

### Step 5: Deploy Backend
1. Railway will automatically deploy after you save the variables
2. Wait for deployment to complete (2-3 minutes)
3. Once deployed, click on **Settings** → **Networking**
4. Click **"Generate Domain"** to get your backend URL
5. **Copy this URL** (e.g., `https://your-backend.up.railway.app`)
6. You'll need this for frontend configuration

### Step 6: Initialize Database
The database tables will be created automatically on first run thanks to SQLAlchemy's `create_all()` function in your code.

To verify:
1. Go to your MySQL database service in Railway
2. Click **"Query"** tab or use **"Connect"** to see connection details
3. You should see tables: `users`, `temples`, `weapons`, `fossils`, `visits`, `high_scores`, `feedback`

### Step 7: Create Admin User
You need to create an admin user to access the admin dashboard.

**Option A: Using Railway CLI** (Recommended)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Open MySQL shell
railway run mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE

# In MySQL shell, run:
INSERT INTO users (email, hashed_password, is_admin, is_active, created_at)
VALUES ('admin@temple.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzYq5r1jVm', 1, 1, NOW());

# Exit MySQL
exit;
```

**Option B: Temporary Admin Creation Endpoint** (Easier)
I can add a one-time setup endpoint to your backend that creates the admin user. Would you like me to add this?

**Default Admin Credentials** (if using Option A):
- Email: `admin@temple.com`
- Password: `admin123` (the hash above is for this password)
- **⚠️ IMPORTANT**: Change this password immediately after first login!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment File
1. Open `frontend/.env.production` in your local project
2. Replace the URL with your Railway backend URL:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```
   (Use the URL you copied in Part 1, Step 5)

### Step 2: Commit and Push Changes
```bash
cd c:\Users\Krish\OneDrive\Desktop\indian-temple-museum

# Add all deployment files
git add .

# Commit changes
git commit -m "Add deployment configuration for Railway and Vercel"

# Push to GitHub
git push origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `Krishna-pathak1535/Indian-Temple-Heritage-Museum`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.up.railway.app` (your Railway backend URL)

6. Click **"Deploy"**
7. Wait for deployment (1-2 minutes)
8. Vercel will give you a URL like: `https://indian-temple-museum.vercel.app`

### Step 4: Update Backend CORS
1. Go back to Railway dashboard
2. Click on your backend service
3. Go to **Variables** tab
4. Update `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL=https://indian-temple-museum.vercel.app
   ```
5. Save - Railway will automatically redeploy with new CORS settings

---

## Part 3: Verify Deployment

### Test Backend
1. Visit: `https://your-backend.up.railway.app/`
2. Should see:
   ```json
   {
     "message": "Indian Temple Heritage Museum API",
     "version": "1.0.0",
     "status": "running",
     "environment": "production",
     "docs": "/docs"
   }
   ```

3. Visit: `https://your-backend.up.railway.app/docs`
4. Should see FastAPI Swagger documentation

### Test Frontend
1. Visit your Vercel URL: `https://indian-temple-museum.vercel.app`
2. You should see the homepage
3. Try logging in with admin credentials
4. Navigate to different rooms
5. Check admin dashboard

### Test Full Integration
1. **User Registration**: Create a new user account
2. **Authentication**: Login and verify token storage
3. **3D Rooms**: Visit Temples, Weapons, and Fossils rooms
4. **Analytics**: Check if visits are being tracked (admin dashboard)
5. **Feedback**: Submit feedback and verify it appears in admin panel
6. **Admin Functions**: 
   - Add/Edit/Delete temples, weapons, fossils
   - View analytics
   - Check leaderboard
   - Read feedback

---

## Part 4: Static Files (Images & Audio)

### Current Setup
Your static files are in `backend/app/static/` directory and served by FastAPI.

### For Production (if files are large)
If your static files are too large or causing deployment issues:

**Option A: Keep on Railway** (Current Setup)
- Files deploy with your backend
- Served from Railway
- Simple but uses more Railway resources

**Option B: Use Cloud Storage** (Recommended for large files)
1. Upload files to Cloudinary (free tier: 25GB storage)
2. Update your database with Cloudinary URLs
3. Remove local files from `backend/app/static/`

**Option C: Use Vercel for Static Files**
1. Move `backend/app/static/` to `frontend/public/static/`
2. Update media URLs in database to use Vercel URL
3. Vercel serves static files for free with CDN

---

## Troubleshooting

### Backend Issues

**Error: "Can't connect to MySQL"**
- Check Railway database is running
- Verify environment variables are set correctly
- Check logs: Railway dashboard → Backend service → Deployments → View logs

**Error: "CORS error"**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check Railway logs for CORS configuration
- Make sure both HTTP and HTTPS are correct

**Error: "Module not found"**
- Check `requirements.txt` includes all dependencies
- Force rebuild: Railway dashboard → Settings → Restart

### Frontend Issues

**Error: "Failed to fetch"**
- Check `VITE_API_URL` is set correctly in Vercel
- Verify backend is running (check Railway)
- Check browser console for CORS errors

**Error: "Environment variable undefined"**
- Vercel environment variables must start with `VITE_`
- Redeploy after adding environment variables
- Check Vercel → Settings → Environment Variables

### Database Issues

**Error: "Table doesn't exist"**
- Tables should create automatically on first run
- Check Railway logs for SQLAlchemy errors
- Manually run migrations if needed (Railway CLI)

**Error: "Admin user doesn't exist"**
- Follow Part 1, Step 7 to create admin user
- Or ask me to add a temporary admin creation endpoint

---

## Monitoring & Logs

### Railway Logs
1. Railway dashboard → Your backend service
2. Click **"Deployments"** tab
3. Click on latest deployment → **"View Logs"**
4. Monitor errors in real-time

### Vercel Logs
1. Vercel dashboard → Your project
2. Click **"Deployments"** tab
3. Click on latest deployment → **"View Function Logs"**
4. Check build logs and runtime logs

### Health Checks
- Backend health: `https://your-backend.up.railway.app/health`
- Frontend: Just visit the URL

---

## Updating Your Application

### To Update Backend
1. Make changes locally
2. Commit and push to GitHub
3. Railway automatically redeploys (takes 2-3 minutes)

### To Update Frontend
1. Make changes locally
2. Commit and push to GitHub
3. Vercel automatically redeploys (takes 1-2 minutes)

### To Update Database
1. Make changes to models in `backend/app/db/models.py`
2. Push to GitHub (Railway redeploys)
3. Database schema updates automatically with SQLAlchemy

---

## Usage Monitoring

### Railway Usage
- Dashboard → Usage tab
- Monitor: $5 credit remaining, CPU, Memory, Network
- Free tier limits:
  - 500 hours per month (enough for 24/7 running)
  - 100 GB outbound network
  - Shared CPU and 512MB RAM per service

### Vercel Usage
- Dashboard → Usage tab
- Free tier limits:
  - 100 GB bandwidth per month
  - Unlimited builds
  - Automatic SSL

---

## Security Notes

1. **Change Default Admin Password**: After first login, create a new admin user with strong password and delete the default one

2. **SECRET_KEY**: Never commit your production SECRET_KEY to GitHub
   - Use a password generator for a strong key
   - Keep it secret in Railway environment variables

3. **Database Credentials**: Automatically managed by Railway, never expose them

4. **HTTPS**: Both Railway and Vercel provide automatic HTTPS

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Change admin password
3. ✅ Add your museum content (temples, weapons, fossils)
4. ✅ Share your project URL with professors/classmates
5. ✅ Monitor Railway credit usage (should last entire semester)

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React + Vite Docs**: https://vitejs.dev

---

## Your Project URLs (Update After Deployment)

```
Backend API: https://______.up.railway.app
Frontend: https://______.vercel.app
Admin Login: https://______.vercel.app (use admin credentials)
API Docs: https://______.up.railway.app/docs
```

---

**Ready to deploy? Start with Part 1!**
