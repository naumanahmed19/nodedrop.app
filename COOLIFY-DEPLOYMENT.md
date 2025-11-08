# Coolify Deployment Guide

## Prerequisites
- Coolify instance running
- GitHub repository connected to Coolify
- Domain name (optional)

## Deployment Steps

### 1. Create New Project in Coolify
1. Log into your Coolify dashboard
2. Click "New Project"
3. Select "Docker Compose" as deployment type
4. Connect your GitHub repository

### 2. Environment Variables
Add these environment variables in Coolify:

```env
# Database
DATABASE_URL=postgresql://nodedrop:nodedrop123@postgres:5432/nodedrop

# NextAuth
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here

# Node Environment
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Docker Compose Configuration
Coolify will use your `docker-compose.yml` file. Make sure it includes:

- PostgreSQL database service
- App service with proper environment variables
- Volume mounts for persistent data

### 4. Build Configuration
In Coolify settings:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3000
- **Dockerfile**: Use the provided Dockerfile

### 5. Database Setup
After first deployment:

1. Access the container shell in Coolify
2. Run Prisma migrations:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 6. Domain Configuration
1. In Coolify, go to your app settings
2. Add your domain
3. Enable automatic SSL (Let's Encrypt)
4. Update NEXTAUTH_URL environment variable

## Deployment Options

### Option 1: Using Docker Compose (Recommended)
Coolify will automatically detect and use your `docker-compose.yml`

### Option 2: Using Dockerfile Only
If you prefer single container deployment:
1. Remove docker-compose.yml from deployment
2. Use external PostgreSQL database
3. Update DATABASE_URL accordingly

## Post-Deployment

### Create Admin User
Access the container and run:
```bash
npx prisma studio
```
Or use the seed script to create default admin.

### Health Checks
- App: `https://your-domain.com`
- Admin: `https://your-domain.com/admin/login`
- API: `https://your-domain.com/api/nodes`

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if PostgreSQL container is running
- Ensure network connectivity between containers

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check build logs in Coolify

### Migration Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Apply migrations
npx prisma migrate deploy
```

## Updating Deployment
1. Push changes to GitHub
2. Coolify will auto-deploy (if enabled)
3. Or manually trigger deployment in Coolify dashboard

## Monitoring
- Check logs in Coolify dashboard
- Monitor resource usage
- Set up alerts for downtime
