# Deploy EDIZO Admin Panel to Netlify

## Prerequisites
- Netlify account (free tier available)
- Git repository (GitHub, GitLab, or Bitbucket)
- Backend deployed on Render (see backend deployment guide)

## Step 1: Prepare Admin Panel for Deployment

### 1.1 Update Environment Variables
Create a `.env` file in the `admin/` directory:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

### 1.2 Build the Admin Panel
```bash
cd admin
npm run build
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify CLI (Recommended)

#### Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Login to Netlify
```bash
netlify login
```

#### Initialize Netlify in Admin Directory
```bash
cd admin
netlify init
```

Select:
- **Create & configure a new site**: Yes
- **Team**: Your team (or personal)
- **Site name**: edizo-admin (or your preferred name)
- **Build command**: `npm run build`
- **Deploy directory**: `dist`

#### Set Environment Variables
```bash
netlify env:set VITE_API_URL https://your-backend-name.onrender.com/api
```

#### Deploy
```bash
netlify deploy --prod
```

### Option B: Deploy via Netlify Dashboard

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select the repository containing your project
5. Configure build settings:
   - **Base directory**: `admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin/dist`
6. Click "Deploy site"

#### Set Environment Variables in Dashboard
1. Go to Site settings → Environment variables
2. Add variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-name.onrender.com/api`
3. Click "Save"

## Step 3: Configure Netlify Redirects (Optional)

Create `admin/netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## Step 4: Custom Domain (Optional)

1. Go to Domain settings in Netlify
2. Click "Add custom domain"
3. Enter your domain (e.g., `admin.edizo.com`)
4. Follow DNS configuration instructions

## Step 5: Verify Deployment

1. Visit your Netlify site URL
2. Test login with admin credentials
3. Verify API calls are working (check browser console)
4. Test all admin features

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

### Blank Page After Deploy
- Check browser console for errors
- Verify React app is properly mounted
- Check if environment variables are loaded

## Continuous Deployment

Netlify automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update admin panel"
git push origin main
```

Netlify will build and deploy automatically.

## Security Notes

1. **Enable Password Protection** (for staging):
   ```bash
   netlify deploy --prod --auth
   ```

2. **Restrict Admin Access**:
   - Implement proper authentication in the app
   - Use environment variables for sensitive data
   - Never commit `.env` files

3. **CORS Configuration**:
   Ensure your Render backend allows requests from your Netlify domain:
   ```javascript
   // In backend CORS configuration
   cors({
     origin: ['https://edizo-admin.netlify.app', 'https://admin.edizo.com'],
     credentials: true
   })
   ```

## Useful Commands

```bash
# View deploy logs
netlify deploy --build

# Open site in browser
netlify open

# View site details
netlify status

# Rollback to previous deploy
netlify rollback
```

## Links

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started)
- [Environment Variables Guide](https://docs.netlify.com/configure-builds/environment-variables)
