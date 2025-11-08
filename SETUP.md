# Admin Panel Setup Guide

## Prerequisites
- Node.js 16+ installed
- PostgreSQL database

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nodedrop?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

Replace the database credentials with your PostgreSQL connection string.

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database
```bash
npx prisma db seed
```

This will create:
- An admin user with credentials:
  - Email: `admin@nodedrop.com`
  - Password: `admin123`
- Sample nodes in the marketplace

### 6. Start the Development Server
```bash
npm run dev
```

## Access the Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@nodedrop.com`
   - Password: `admin123`
3. You'll be redirected to the admin dashboard

## Features

### Admin Dashboard
- View all nodes in a table format
- Create new nodes
- Edit existing nodes
- Delete nodes
- Toggle publish/unpublish status

### Node Management
Each node has:
- Title, description, and icon
- Category and version
- Author information
- Download count and rating
- Tags for searchability
- Long description
- Features list
- Requirements list
- Published status

### Marketplace
- Public-facing marketplace at `/marketplace`
- Search functionality
- Category filtering
- Only shows published nodes
- Click any node to see full details

## Database Schema

### User Model
- id, email, password, name, role
- Roles: USER, ADMIN

### Node Model
- All node information
- Published status for visibility control
- Timestamps for tracking

## Security Notes

1. **Change the default admin password** after first login
2. **Update NEXTAUTH_SECRET** in production with a secure random string
3. **Use environment variables** for sensitive data
4. **Enable SSL** for database connections in production

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Clear browser cookies
- Check NEXTAUTH_URL matches your domain

### Migration Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Then run migrations again
npx prisma migrate dev
```

## Production Deployment

1. Set environment variables on your hosting platform
2. Run migrations: `npx prisma migrate deploy`
3. Build the application: `npm run build`
4. Start the server: `npm start`

## Additional Commands

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# View database
npx prisma db pull

# Format schema
npx prisma format
```
