# Netlify Hosting Guide for Job Card System

## Prerequisites

- GitHub account with the repository pushed (already done)
- Netlify account (free tier available)
- Supabase project with credentials

## Step 1: Create Netlify Account & Link Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up" and choose "GitHub"
3. Authorize Netlify to access your GitHub account
4. Click "New site from Git"
5. Select your repository: `suchnaconsulting26-dotcom/Job_card_system`
6. Choose branch: `main`

## Step 2: Configure Build Settings

Netlify should auto-detect Next.js. Verify these settings:

**Build Settings:**

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `20.9.0` (via .nvmrc - already configured)

If not auto-detected, manually set:

1. Go to Site settings → Build & deploy → Build settings
2. Enter build command: `npm run build`
3. Enter publish directory: `.next`

## Step 3: Set Environment Variables

1. Go to **Site settings → Build & deploy → Environment**
2. Add these variables (use your Supabase credentials):

```
NEXT_PUBLIC_SUPABASE_URL=https://ydemoxhspiudvktkuxak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW1veGhzcGl1ZHZrdGt1eGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODE1MDQsImV4cCI6MjA4NzA1NzUwNH0.r5tKPF-eMpCBjVLldGSgrZooc4zPo8DxwLcuJ97JW1Y
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZW1veGhzcGl1ZHZrdGt1eGFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ4MTUwNCwiZXhwIjoyMDg3MDU3NTA0fQ.DmPQsIsdzukDMe4JC1nH5rXKAz1FnoR9gohAYq8eCsM
```

⚠️ **SECURITY NOTE:** These are demo keys. In production:

- Rotate your Supabase keys immediately after deployment
- Consider using Netlify's environment variable UI instead of .env files
- Never commit secrets to version control

## Step 4: Configure Supabase for Netlify

1. Go to Supabase Dashboard
2. Project Settings → Authentication → Site URL
3. Add your Netlify URL: `https://your-site-name.netlify.app`
4. Enable email confirmations if required
5. Configure OAuth providers if needed

## Step 5: Deploy

1. Click "Deploy site"
2. Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to CDN

**Build typically takes 2-5 minutes**

## Step 6: Monitor the Deployment

1. Go to **Deployments** tab
2. Watch the build logs in real-time
3. Once successful, your site URL appears at the top

## Step 7: Configure Custom Domain (Optional)

1. Go to **Site settings → Domain settings**
2. Click "Add custom domain"
3. Enter your domain (e.g., jobcard.yourdomain.com)
4. Follow DNS setup instructions

SSL certificate is automatically provisioned by Netlify.

---

## Troubleshooting

### Build Fails with Node Version Error

✅ Already fixed - `.nvmrc` is set to `20.9.0`

### Build Fails with Middleware/Proxy Conflict

✅ Already fixed - `proxy.ts` removed, only `middleware.ts` present

### Environment Variables Not Found

- Check Site settings → Build & deploy → Environment
- Ensure variables are set before deploying
- Clear cache and redeploy if needed

### Supabase Connection Errors

- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Check Supabase project is active
- Verify Netlify URL is added to Supabase Site URL list

### Form Submissions Failing

- Check browser Console for errors
- Verify Supabase RLS policies allow the operation
- Ensure email verification is configured if required

---

## Post-Deployment Checklist

- [ ] Site loads and renders correctly
- [ ] Authentication (login/signup) works
- [ ] Email verification emails are sent
- [ ] Job cards can be created/updated
- [ ] Inventory management works
- [ ] Error handling displays user-friendly messages
- [ ] All forms validate input properly
- [ ] Security headers are present (check DevTools)

---

## Continuous Deployment

Once connected, every push to `main` branch automatically triggers:

1. New build
2. Automatic tests (if configured)
3. Deployment to production

To disable auto-deploy:

- Go to **Site settings → Build & deploy → Deploy settings**
- Change to manual deploy

---

## Performance Optimization

### Enable Netlify Analytics

1. Site settings → Analytics
2. Click "Enable Netlify Analytics"
3. View real-time traffic data

### Configure Caching

1. Create `netlify.toml` in repo root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "public, max-age=60, s-maxage=3600"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

1. Commit and push - Netlify will use this configuration

---

## Support & Resources

- **Netlify Docs:** <https://docs.netlify.com/>
- **Next.js on Netlify:** <https://docs.netlify.com/frameworks/next-js/overview/>
- **Supabase Docs:** <https://supabase.com/docs>
- **Netlify Support:** <support@netlify.com>
