# 🌍 Setup PlanetScale Database for EDIZO

## Why PlanetScale?
- ✅ **Free tier**: 5GB storage, 1B row reads/month
- ✅ **Internet accessible**: No IP whitelisting needed
- ✅ **MySQL compatible**: Works with existing code
- ✅ **Production ready**: Built-in backups, scaling

## Step 1: Create Account

1. Go to [planetscale.com](https://planetscale.com)
2. Sign up with GitHub (recommended) or email
3. Choose **Free** plan

## Step 2: Create Database

1. Click **"New Database"**
2. **Database name**: `edizo-db`
3. **Region**: `us-east-1` (Oregon for Render)
4. Click **"Create"**

## Step 3: Get Connection String

1. Click your database name
2. Click **"Connect"** button
3. Select **"General"** application
4. Copy the connection string (looks like):
   ```
   mysql://username:password@host/database?ssl={"rejectUnauthorized":true}
   ```

## Step 4: Import Existing Data (Optional)

If you have existing data:

```bash
# Install PlanetScale CLI
npm install -g @planetscale/database

# Login
pscale auth login

# Create database
pscale database create edizo-db

# Import from MySQL
pscale shell edizo-db main < backup.sql
```

Or manually:
1. Export from current database:
   ```bash
   mysqldump -h 100.110.78.25 -u remote_user -p edizo_db > backup.sql
   ```
2. Import to PlanetScale via web UI or CLI

## Step 5: Update Render Environment Variables

Go to Render Dashboard → Your Backend → **Environment**:

```
DB_HOST=aws.connect.psdb.cloud
DB_USER=your_username_from_planetscale
DB_PASSWORD=your_password_from_planetscale
DB_NAME=edizo-db
DB_PORT=3306
```

## Step 6: Redeploy

1. Click **"Save Changes"** in Render
2. Wait for redeployment (~2 minutes)
3. Check logs for success

## Done! ✅

Your backend is now connected to PlanetScale!

## Useful Commands

```bash
# Install CLI
npm install -g @planetscale/cli

# Login
pscale auth login

# List databases
pscale database list

# Open database shell
pscale shell edizo-db main

# Create branch
pscale branch create edizo-db feature-branch

# Deploy branch
pscale deploy edizo-db feature-branch
```

## Links

- [PlanetScale Docs](https://planetscale.com/docs)
- [PlanetScale Pricing](https://planetscale.com/pricing)
- [Render + PlanetScale Guide](https://planetscale.com/docs/deploy-to-render)
