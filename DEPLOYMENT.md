# 🚀 CodeForge AI - Deployment Guide

This guide covers deploying CodeForge AI to production using modern cloud platforms.

---

## 📋 Pre-Deployment Checklist

### Backend Requirements
- ✅ MongoDB Atlas cluster created
- ✅ Environment variables configured
- ✅ JWT secrets generated (32+ characters)
- ✅ All tests passing
- ✅ CORS origins whitelisted
- ✅ Rate limiting configured

### Frontend Requirements
- ✅ Environment variables configured
- ✅ API URL set to production backend
- ✅ Build completes successfully
- ✅ All routes tested

---

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Visit https://www.mongodb.com/cloud/atlas
2. Sign up for free tier
3. Create a new cluster (Free M0 tier is sufficient for development)

### 2. Configure Network Access
1. Go to **Network Access** in Atlas dashboard
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0) for development
4. For production, whitelist specific IPs of your hosting provider

### 3. Create Database User
1. Go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `codeforge-admin`
5. Generate secure password
6. Grant **Atlas Admin** role (or **Read and write to any database**)

### 4. Get Connection String
1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string:
```
mongodb+srv://codeforge-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. Replace `<password>` with your database password
5. Add database name before the `?`:
```
mongodb+srv://codeforge-admin:yourpassword@cluster0.xxxxx.mongodb.net/codeforge-ai?retryWrites=true&w=majority
```

### 5. (Optional) Create Collections Manually
Collections will be created automatically by Mongoose, but you can create them manually:
- `users`
- `organizations`
- `projects`
- `issues`
- `issueactivities`

---

## 🖥️ Backend Deployment

### Option 1: Render (Recommended)

#### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `package.json` has correct scripts:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts"
  }
}
```

#### Step 2: Create Render Account
1. Visit https://render.com
2. Sign up with GitHub

#### Step 3: Create New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `codeforge-ai-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (for development)

#### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://codeforge-admin:yourpassword@cluster0.xxxxx.mongodb.net/codeforge-ai?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_here
JWT_REFRESH_SECRET=your_refresh_secret_jwt_key_min_32_characters_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Step 5: Deploy
1. Click **Create Web Service**
2. Wait for deployment (3-5 minutes)
3. Your backend will be available at: `https://codeforge-ai-backend.onrender.com`

#### Step 6: Test Backend
```bash
curl https://codeforge-ai-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Option 2: Railway

#### Step 1: Create Railway Account
1. Visit https://railway.app
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository
4. Select `server` directory as root

#### Step 3: Add Environment Variables
Same as Render (see above)

#### Step 4: Configure
Railway auto-detects Node.js and uses your `package.json` scripts.

#### Step 5: Deploy
Automatic deployment on push to main branch.

---

### Option 3: Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

#### Step 2: Login
```bash
heroku login
```

#### Step 3: Create App
```bash
cd server
heroku create codeforge-ai-backend
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
```

#### Step 5: Deploy
```bash
git push heroku main
```

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository
1. Ensure `vite.config.ts` is correctly configured
2. Push code to GitHub

#### Step 2: Create Vercel Account
1. Visit https://vercel.com
2. Sign up with GitHub

#### Step 3: Import Project
1. Click **Add New** → **Project**
2. Import your GitHub repository
3. Vercel auto-detects Vite

#### Step 4: Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

#### Step 5: Add Environment Variables
```env
VITE_API_URL=https://codeforge-ai-backend.onrender.com/api
VITE_SOCKET_URL=https://codeforge-ai-backend.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key_if_using_ai_features
```

#### Step 6: Deploy
1. Click **Deploy**
2. Wait for build (1-2 minutes)
3. Your frontend will be available at: `https://your-project.vercel.app`

#### Step 7: Custom Domain (Optional)
1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

---

### Option 2: Netlify

#### Step 1: Create Netlify Account
1. Visit https://netlify.com
2. Sign up with GitHub

#### Step 2: Add New Site
1. Click **Add new site** → **Import an existing project**
2. Connect to GitHub
3. Select your repository

#### Step 3: Configure Build Settings
- **Base directory**: `client`
- **Build command**: `npm run build`
- **Publish directory**: `client/dist`

#### Step 4: Add Environment Variables
Go to **Site settings** → **Environment variables** and add:
```env
VITE_API_URL=https://codeforge-ai-backend.onrender.com/api
VITE_SOCKET_URL=https://codeforge-ai-backend.onrender.com
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### Step 5: Deploy
Click **Deploy site**

---

### Option 3: AWS Amplify

#### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

#### Step 2: Configure Amplify
```bash
amplify configure
```

#### Step 3: Initialize Amplify
```bash
cd client
amplify init
```

#### Step 4: Add Hosting
```bash
amplify add hosting
```

#### Step 5: Publish
```bash
amplify publish
```

---

## 🔐 Security Checklist for Production

### Backend Security
- [ ] JWT secrets are strong (32+ chars) and unique
- [ ] MongoDB connection uses strong password
- [ ] Rate limiting is enabled
- [ ] CORS is restricted to frontend domain only
- [ ] Helmet.js is enabled for security headers
- [ ] Input validation on all endpoints
- [ ] HTTPS is enforced (automatic on Render/Railway/Heroku)
- [ ] Error messages don't leak sensitive info
- [ ] Database backups are enabled (MongoDB Atlas)

### Frontend Security
- [ ] API keys are in environment variables (not committed)
- [ ] HTTPS is enforced (automatic on Vercel)
- [ ] Content Security Policy (CSP) headers configured
- [ ] XSS protection enabled
- [ ] Sensitive data not logged to console in production

### Update Client URL in Backend
After deploying frontend, update `CLIENT_URL` in backend environment:
```env
CLIENT_URL=https://your-actual-frontend-domain.vercel.app
```

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd server && npm ci
      - name: Run tests
        run: cd server && npm test
      - name: Build
        run: cd server && npm run build
      # Deploy step depends on your hosting provider

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd client && npm ci
      - name: Build
        run: cd client && npm run build
      # Vercel/Netlify auto-deploys on push
```

---

## 📊 Monitoring & Logging

### Backend Monitoring

#### 1. Render Logs
- Access logs in Render dashboard
- View real-time logs: Click **Logs** tab

#### 2. Error Tracking (Optional)
Install Sentry:
```bash
npm install @sentry/node
```

Configure in `server/src/index.ts`:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Frontend Monitoring

#### 1. Vercel Analytics
Built-in analytics in Vercel dashboard.

#### 2. Google Analytics (Optional)
Add to `client/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend.onrender.com/health
```

### 2. Test Registration
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!","role":"Developer"}'
```

### 3. Test Login
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### 4. Visit Frontend
Navigate to `https://your-frontend.vercel.app` and test:
- [ ] Login page loads
- [ ] Registration works
- [ ] Dashboard loads after login
- [ ] Dark/light mode toggle works
- [ ] Create organization works
- [ ] Create project works
- [ ] Create issue works
- [ ] Real-time notifications work
- [ ] All pages are accessible

---

## 🚨 Troubleshooting

### Backend Issues

#### "Cannot connect to MongoDB"
- Check MongoDB Atlas whitelist includes Render/Railway IP
- Verify connection string is correct
- Ensure database user has correct permissions

#### "CORS Error"
- Verify `CLIENT_URL` in backend `.env` matches frontend domain
- Ensure CORS middleware is configured correctly

#### "500 Internal Server Error"
- Check backend logs in Render/Railway dashboard
- Verify all environment variables are set
- Check for missing dependencies

### Frontend Issues

#### "Network Error"
- Verify `VITE_API_URL` points to correct backend
- Check backend is running and accessible
- Ensure CORS is configured on backend

#### "Build Failed"
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check Node.js version compatibility

#### "Environment Variables Not Working"
- Ensure variables start with `VITE_`
- Rebuild after adding new variables
- Check variables are set in Vercel dashboard

---

## 📈 Scaling Considerations

### Database
- MongoDB Atlas auto-scales storage
- Upgrade to M10+ for production
- Enable backups and point-in-time recovery

### Backend
- Render/Railway scale automatically
- Consider load balancer for high traffic
- Use Redis for session storage (future enhancement)

### Frontend
- Vercel CDN handles global distribution
- Implement lazy loading for routes
- Optimize bundle size with code splitting

---

## 💰 Cost Estimates

### Free Tier (Development)
- **MongoDB Atlas**: M0 Free (512MB storage)
- **Render/Railway**: Free tier (750 hours/month)
- **Vercel**: Free (100GB bandwidth/month)
- **Total**: $0/month

### Production (Low Traffic)
- **MongoDB Atlas**: M10 (~$57/month)
- **Render**: Starter (~$7/month)
- **Vercel**: Pro (~$20/month)
- **Total**: ~$84/month

### Production (High Traffic)
- **MongoDB Atlas**: M30+ (~$267/month)
- **Render**: Pro+ (~$85/month)
- **Vercel**: Pro (~$20/month)
- **Total**: ~$372/month

---

## 📞 Support

For deployment issues:
- Check deployment platform docs
- Review application logs
- Contact platform support
- Open GitHub issue

---

## 🎉 Congratulations!

Your CodeForge AI application is now deployed and ready for production use!

**Next Steps:**
1. Set up custom domain
2. Configure SSL certificate (automatic on most platforms)
3. Enable monitoring and analytics
4. Set up automated backups
5. Plan scaling strategy

---

**Last Updated**: January 2024
