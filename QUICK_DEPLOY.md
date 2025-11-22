# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment (COMPLETED)
- [x] Deployment files created
- [x] Code pushed to GitHub
- [x] Railway account created
- [x] GitHub connected to Railway

---

## 📋 Deployment Steps (DO THIS NOW)

### Part 1: Backend + Database (Railway) - 15 minutes

1. **Create Railway Project**
   - Go to: https://railway.app/dashboard
   - Click "New Project" → "Deploy from GitHub repo"
   - Select: `Krishna-pathak1535/Indian-Temple-Heritage-Museum`
   
2. **Configure Backend**
   - Click on the created service
   - Settings → Root Directory: `backend`
   - Verify start command detected from Procfile
   
3. **Add MySQL Database**
   - Project dashboard → "+ New" → "Database" → "MySQL"
   - Wait 30 seconds for provisioning
   
4. **Set Environment Variables**
   - Click backend service → Variables tab
   - Add these 3 variables:
     ```
     SECRET_KEY=<generate-32-char-random-string>
     ENVIRONMENT=production
     FRONTEND_URL=https://will-update-later.vercel.app
     ```
   - Save (Railway auto-deploys)
   
5. **Get Backend URL**
   - Backend service → Settings → Networking
   - Click "Generate Domain"
   - **Copy this URL** → You need it for frontend!
   - Example: `https://indian-temple-museum-production.up.railway.app`
   
6. **Create Admin User**
   - Wait for deployment to complete (2-3 min)
   - Install Railway CLI: `npm i -g @railway/cli`
   - Login: `railway login`
   - Link project: `railway link`
   - Connect to MySQL: `railway run mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE`
   - Run SQL:
     ```sql
     INSERT INTO users (email, hashed_password, is_admin, is_active, created_at)
     VALUES ('admin@temple.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzYq5r1jVm', 1, 1, NOW());
     ```
   - Exit: `exit;`
   
   **OR** ask me to add a temporary admin creation endpoint (easier!)

---

### Part 2: Frontend (Vercel) - 10 minutes

1. **Update Environment File**
   - Open: `frontend/.env.production`
   - Replace with your Railway URL:
     ```
     VITE_API_URL=https://your-railway-url.up.railway.app
     ```
   
2. **Push to GitHub**
   ```bash
   cd c:\Users\Krish\OneDrive\Desktop\indian-temple-museum
   git add frontend/.env.production
   git commit -m "Update production API URL"
   git push origin main
   ```
   
3. **Deploy to Vercel**
   - Go to: https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import: `Krishna-pathak1535/Indian-Temple-Heritage-Museum`
   - Configure:
     - Framework: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Environment Variables:
     - Name: `VITE_API_URL`
     - Value: `https://your-railway-url.up.railway.app`
   - Click "Deploy"
   
4. **Get Frontend URL**
   - After deployment, copy Vercel URL
   - Example: `https://indian-temple-museum.vercel.app`

---

### Part 3: Connect Frontend & Backend - 5 minutes

1. **Update Backend CORS**
   - Railway → Backend service → Variables
   - Update `FRONTEND_URL` with Vercel URL:
     ```
     FRONTEND_URL=https://indian-temple-museum.vercel.app
     ```
   - Save (Railway auto-redeploys in 2 min)

2. **Test Everything**
   - Visit backend: `https://your-railway-url.up.railway.app/` → Should show API info
   - Visit frontend: `https://your-vercel-url.vercel.app/` → Should load homepage
   - Try logging in with admin@temple.com / admin123
   - Visit different rooms
   - Check admin dashboard

---

## 🎯 Success Criteria

- [ ] Backend API responds at `/health` endpoint
- [ ] Backend API docs accessible at `/docs`
- [ ] Frontend loads without errors
- [ ] Can login with admin credentials
- [ ] Can navigate to all 3D rooms (Temples, Weapons, Fossils)
- [ ] Admin dashboard shows analytics
- [ ] Can add/edit content in admin panel
- [ ] Feedback system works
- [ ] Leaderboard displays correctly

---

## 📝 Important URLs to Save

```
Backend API: https://______________________________.up.railway.app
API Docs: https://______________________________.up.railway.app/docs
Frontend: https://______________________________.vercel.app
Admin Panel: https://______________________________.vercel.app (login required)

Default Admin Login:
Email: admin@temple.com
Password: admin123
⚠️ CHANGE THIS PASSWORD AFTER FIRST LOGIN!
```

---

## 🆘 If Something Goes Wrong

### Backend Issues
- Check Railway logs: Backend service → Deployments → View Logs
- Verify all environment variables are set
- Ensure MySQL database is running

### Frontend Issues
- Check Vercel logs: Project → Deployments → View Function Logs
- Verify VITE_API_URL is correct
- Check browser console for errors

### CORS Errors
- Ensure FRONTEND_URL in Railway matches Vercel URL exactly
- No trailing slashes in URLs
- Wait 2 minutes after updating FRONTEND_URL for Railway to redeploy

### Database Connection Issues
- Check Railway MySQL is running (green status)
- Environment variables auto-linked from MySQL service
- Check backend logs for connection errors

---

## 💰 Cost Monitoring

### Railway
- Dashboard → Usage tab
- You have $5 free credit per month
- Your app should use ~$3-4/month
- Sufficient for full semester showcase

### Vercel
- Completely free for your use case
- Unlimited deployments
- 100GB bandwidth/month (more than enough)

---

## 🔄 Updating Your App Later

### Backend Changes
1. Make changes locally
2. `git push origin main`
3. Railway auto-deploys in ~2 min

### Frontend Changes
1. Make changes locally
2. `git push origin main`
3. Vercel auto-deploys in ~1 min

---

## 📚 Full Documentation

- Complete guide: `DEPLOYMENT_GUIDE.md`
- Environment variables: `ENVIRONMENT_VARIABLES.md`
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs

---

## ⏱️ Estimated Time

- Part 1 (Backend): 15 minutes
- Part 2 (Frontend): 10 minutes
- Part 3 (Connect): 5 minutes
- **Total: 30 minutes** ⏰

---

**Ready? Start with Part 1! 🚀**

Need help? Ask me:
- "How do I generate a SECRET_KEY?"
- "Can you add an admin creation endpoint?"
- "How do I check Railway logs?"
- "Frontend not connecting to backend, help!"
