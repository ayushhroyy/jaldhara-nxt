# 🚀 Cloudflare Pages Deployment Guide

This guide shows how to deploy the FarmGPT application to Cloudflare Pages using GitHub integration.

## 📋 Prerequisites

- GitHub repository with your FarmGPT code
- Cloudflare account (free tier is sufficient)
- Environment variables configured in GitHub Secrets

## 🔧 Setup Instructions

### Step 1: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

1. **VITE_OPENROUTER_API_KEY**
   ```
   your_openrouter_api_key_here
   ```
   Note: This should match the Cloudflare secret name "openrouter"

2. **VITE_PDFSHIFT_API_KEY**
   ```
   sk_09d22ed471315d28c26eb187d6eaf63ab9ee9ca7
   ```

### Step 2: Connect Cloudflare Pages to GitHub

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Navigate to Pages**: Click "Pages" in the left sidebar
3. **Create Project**: Click "Create a project" → "Connect to Git"
4. **Select GitHub**: Authorize Cloudflare to access your GitHub account
5. **Choose Repository**: Select `ayushhroyy/jaldhara-nxt`

### Step 3: Configure Build Settings

In the Cloudflare Pages setup:

```
Framework preset: Vite
Build command: npm run build
Build output directory: /dist
Root directory: /
Node.js version: 22
```

### Step 4: Add Environment Variables

In the Cloudflare Pages build settings, add:

```
VITE_OPENROUTER_API_KEY = [use Cloudflare secret named "openrouter"]
VITE_PDFSHIFT_API_KEY = [use GitHub Secret]
```

### Step 5: Deploy

Click "Save and Deploy". Cloudflare will:
1. Build your application using the GitHub Actions workflow
2. Deploy it to the global Cloudflare network
3. Provide a live URL

## 🌐 Deployment URLs

- **Production**: `https://farmgpt-app.pages.dev`
- **Preview**: `https://farmgpt-app-preview-pr-{number}.pages.dev` (for PRs)

## 🔄 Automatic Deployments

- **Main branch**: Automatically deploys to production
- **Pull Requests**: Creates preview deployments
- **Manual**: Can trigger deployments from GitHub Actions tab

## 📊 Monitoring

- **Build Status**: Check in GitHub Actions tab
- **Deployment Status**: Check in Cloudflare Pages dashboard
- **Analytics**: Available in Cloudflare dashboard

## 🐛 Troubleshooting

### Build Failures

1. **Check GitHub Secrets**: Ensure all environment variables are set correctly
2. **Check Node.js Version**: Ensure you're using Node.js 22+
3. **Check Dependencies**: Run `npm ci` locally to verify dependencies

### Deployment Issues

1. **Clear Cache**: Clear Cloudflare cache in Pages settings
2. **Check Environment Variables**: Ensure they're properly configured
3. **Check Build Logs**: Review build logs in GitHub Actions

### Environment Variables Not Working

1. **Restart Build**: Trigger a new build from GitHub
2. **Check Secret Names**: Ensure they match exactly in both GitHub and Cloudflare
3. **Verify Permissions**: Ensure GitHub Actions has access to secrets

## 🎯 Best Practices

1. **Use GitHub Secrets**: Never commit API keys to the repository
2. **Enable Preview Deployments**: Test changes before production
3. **Monitor Analytics**: Track performance and usage
4. **Regular Updates**: Keep dependencies updated
5. **Backup**: Keep your repository backed up

## 📱 Accessing Your App

Once deployed, your FarmGPT app will be available at:
- **Main App**: https://farmgpt-app.pages.dev
- **Custom Domain**: Configure in Cloudflare Pages settings if needed

## 🛠️ Local Development

For local development:
1. Copy `.env.example` to `.env`
2. Fill in your environment variables
3. Run `npm run dev`

## 📞 Support

If you encounter issues:
1. Check GitHub Actions build logs
2. Check Cloudflare Pages deployment logs
3. Review this documentation
4. Create an issue in the repository