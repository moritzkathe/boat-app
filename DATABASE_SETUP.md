# 🗄️ Database Setup Guide - Fix Data Loss on Deployments

## 🚨 Current Problem
Your data is disappearing on deployments because the app is using **in-memory fallback storage** instead of a real database. When Vercel deploys a new version, the serverless functions restart and all in-memory data is lost.

## ✅ Solution: Set Up PostgreSQL Database

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **Go to your Vercel project dashboard**
2. **Click "Storage" tab**
3. **Click "Create Database"**
4. **Choose "Postgres"**
5. **Select a plan (Hobby is free)**
6. **Choose a region close to you**
7. **Click "Create"**

Vercel will automatically:
- Create the database
- Set the `DATABASE_URL` environment variable
- Handle the connection

### Option 2: Neon (Free PostgreSQL)

1. **Go to [neon.tech](https://neon.tech)**
2. **Sign up for free account**
3. **Create a new project**
4. **Copy the connection string**
5. **Add to Vercel environment variables**

### Option 3: Supabase (Free PostgreSQL)

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up for free account**
3. **Create a new project**
4. **Go to Settings → Database**
5. **Copy the connection string**
6. **Add to Vercel environment variables**

## 🔧 Configure Vercel Environment Variables

### In Vercel Dashboard:
1. **Go to your project**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add new variable:**
   - **Name:** `DATABASE_URL`
   - **Value:** Your PostgreSQL connection string
   - **Environment:** Production (and Preview if you want)
5. **Click "Save"**

### Connection String Format:
```
postgresql://username:password@host:port/database
```

## 🚀 Deploy and Migrate

### 1. Deploy to Vercel
```bash
git add .
git commit -m "Ready for database setup"
git push origin main
```

### 2. Run Database Migrations
After deployment, run this command in your terminal:
```bash
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull .env
npx prisma migrate deploy
```

## ✅ Verify Database Connection

### Check if database is working:
1. **Go to your deployed app**
2. **Try adding a calendar event**
3. **Refresh the page**
4. **The event should still be there**

### If you see errors:
1. **Check Vercel function logs**
2. **Verify DATABASE_URL is set correctly**
3. **Ensure migrations ran successfully**

## 🔍 Debug Database Issues

### Check Vercel Logs:
1. **Go to Vercel dashboard**
2. **Click "Functions" tab**
3. **Look for any database connection errors**

### Test Database Connection:
Add this to your API route temporarily to debug:
```typescript
console.log('Database URL:', process.env.DATABASE_URL);
console.log('Database connection test:', await prisma.$connect());
```

## 🎯 Expected Results

After proper setup:
- ✅ **Data persists** between deployments
- ✅ **Calendar events** stay saved
- ✅ **Expenses** remain in the list
- ✅ **Wishlist items** don't disappear
- ✅ **No more data loss** on new deployments

## 🆘 Still Having Issues?

If you're still losing data after setting up the database:

1. **Check if DATABASE_URL is set correctly**
2. **Verify the database is accessible**
3. **Run migrations: `npx prisma migrate deploy`**
4. **Check Vercel function logs for errors**
5. **Test with a simple database query**

## 💡 Pro Tips

- **Use Vercel Postgres** for easiest setup
- **Always run migrations** after deployment
- **Monitor Vercel function logs** for database errors
- **Test locally** with a real database before deploying

Your data should now persist permanently! 🎉
