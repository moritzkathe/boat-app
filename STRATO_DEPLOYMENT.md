# 🚀 Strato.de Deployment Guide

## Overview
Your boat app is built with Next.js, which requires Node.js hosting. Strato.de typically offers shared hosting with PHP support, but we have several options to deploy your app.

## 🎯 **Deployment Options**

### **Option 1: Strato VPS/Dedicated Server (Recommended)**
If you have a Strato VPS or dedicated server with Node.js support:

1. **SSH into your server**
2. **Install Node.js** (if not already installed):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone your repository**:
   ```bash
   git clone https://github.com/moritzkathe/boat-app.git
   cd boat-app
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Build the app**:
   ```bash
   npm run build
   ```

6. **Start the app**:
   ```bash
   npm start
   ```

7. **Set up PM2** (for production):
   ```bash
   npm install -g pm2
   pm2 start npm --name "boat-app" -- start
   pm2 startup
   pm2 save
   ```

### **Option 2: Strato Cloud Hosting**
If you have Strato Cloud hosting with Node.js support:

1. **Upload your code** via FTP/SFTP
2. **Set up environment variables** in your hosting panel
3. **Configure the start command**: `npm start`

### **Option 3: Alternative Hosting (Recommended)**
Since Strato.de shared hosting doesn't support Node.js, consider:

#### **A. Vercel (Free)**
- Already deployed ✅
- Automatic deployments from GitHub
- Free tier available

#### **B. Netlify (Free)**
- Similar to Vercel
- Easy deployment from GitHub

#### **C. Railway (Free)**
- Node.js support
- Easy deployment

#### **D. Render (Free)**
- Node.js support
- Automatic deployments

### **Option 4: Static Version (Limited Functionality)**
If you must use Strato.de shared hosting, I can create a static version, but it will lose:
- ❌ Database functionality
- ❌ API routes
- ❌ Dynamic features

## 🔧 **Required Environment Variables**

If deploying to a Node.js-capable server:

```env
DATABASE_URL="your_postgresql_connection_string"
NODE_ENV="production"
PORT="3000"
```

## 📋 **Deployment Checklist**

### **For VPS/Dedicated Server:**
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] PM2 installed (for production)
- [ ] Environment variables set
- [ ] Firewall configured (port 3000)
- [ ] Domain pointing to server IP

### **For Cloud Hosting:**
- [ ] Node.js support confirmed
- [ ] Environment variables configured
- [ ] Build command set: `npm run build`
- [ ] Start command set: `npm start`

## 🌐 **Domain Configuration**

1. **Point your domain** to your server IP
2. **Set up reverse proxy** (nginx/Apache) if needed
3. **Configure SSL certificate**

## 🚨 **Important Notes**

- **Strato.de shared hosting** does NOT support Node.js applications
- Your app requires a **Node.js environment** to run
- **Vercel deployment** is already working and recommended
- **Database functionality** requires PostgreSQL connection

## 💡 **Recommendation**

Since your app is already successfully deployed on **Vercel**, I recommend:

1. **Keep using Vercel** (free, reliable, automatic deployments)
2. **Point your Strato.de domain** to your Vercel app
3. **Use Strato.de for email/other services** if needed

This gives you the best of both worlds: reliable hosting and your existing domain!

## 🆘 **Need Help?**

If you want to proceed with Strato.de deployment, let me know:
1. What type of Strato.de hosting you have
2. Whether you have SSH access
3. If you have Node.js support

I can then provide specific instructions for your setup!
