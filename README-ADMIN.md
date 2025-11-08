# NodeDrop Admin Panel

A complete admin panel for managing marketplace nodes with authentication and PostgreSQL database.

## 🚀 Quick Start

### 1. Setup Database
```bash
# Copy environment variables
cp .env.example .env

# Edit .env and add your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/nodedrop?schema=public"
```

### 2. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with admin user and sample nodes
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Admin Panel
- URL: `http://localhost:3000/admin/login`
- Email: `admin@nodedrop.com`
- Password: `admin123`

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx          # Admin login page
│   │   ├── page.tsx                # Admin dashboard
│   │   └── layout.tsx              # Admin layout with toaster
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API routes
│   │   ├── admin/nodes/            # Admin node management API
│   │   └── nodes/                  # Public nodes API
│   └── marketplace/page.tsx        # Public marketplace
├── components/
│   ├── admin/
│   │   ├── admin-dashboard.tsx     # Main admin dashboard
│   │   ├── admin-header.tsx        # Admin navigation header
│   │   └── node-dialog.tsx         # Node create/edit dialog
│   └── blocks/
│       └── marketplace.tsx         # Public marketplace component
├── lib/
│   ├── auth.ts                     # NextAuth configuration
│   ├── prisma.ts                   # Prisma client
│   └── marketplace-data.ts         # Type definitions
├── middleware.ts                   # Route protection
└── types/
    └── next-auth.d.ts              # NextAuth type extensions

prisma/
├── schema.prisma                   # Database schema
└── seed.ts                         # Database seeding script
```

## 🔐 Authentication

- **NextAuth v5** (beta) for authentication
- **bcryptjs** for password hashing
- **JWT** session strategy
- Role-based access control (USER, ADMIN)

### Protected Routes
- `/admin/*` - Requires ADMIN role
- Middleware automatically redirects unauthorized users

## 💾 Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Node Model
```prisma
model Node {
  id              String   @id @default(cuid())
  title           String
  description     String
  icon            String
  category        String
  version         String
  author          String
  downloads       Int      @default(0)
  rating          Float    @default(0)
  tags            String[]
  longDescription String   @db.Text
  features        String[]
  requirements    String[]
  published       Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 🎨 Features

### Admin Dashboard
- ✅ View all nodes in a table
- ✅ Create new nodes
- ✅ Edit existing nodes
- ✅ Delete nodes
- ✅ Toggle publish/unpublish status
- ✅ Real-time updates
- ✅ Toast notifications

### Node Management
Each node includes:
- Title, description, and emoji icon
- Category and version tracking
- Author information
- Download count and rating
- Searchable tags
- Detailed description
- Features list
- Requirements list
- Published status

### Public Marketplace
- ✅ Search by title, description, or tags
- ✅ Filter by category
- ✅ View node details in dialog
- ✅ Only shows published nodes
- ✅ Responsive design
- ✅ Loading states

## 🛠️ API Endpoints

### Public API
- `GET /api/nodes` - Get all published nodes

### Admin API (Protected)
- `GET /api/admin/nodes` - Get all nodes
- `POST /api/admin/nodes` - Create new node
- `PUT /api/admin/nodes/[id]` - Update node
- `PATCH /api/admin/nodes/[id]` - Partial update
- `DELETE /api/admin/nodes/[id]` - Delete node

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Open Prisma Studio (database GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🚢 Production Deployment

1. **Set environment variables:**
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="generate-a-secure-random-string"
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Build application:**
   ```bash
   npm run build
   ```

4. **Start server:**
   ```bash
   npm start
   ```

## 🔒 Security Best Practices

1. **Change default admin password** immediately after first login
2. **Use strong NEXTAUTH_SECRET** - generate with: `openssl rand -base64 32`
3. **Enable SSL** for database connections in production
4. **Use environment variables** for all sensitive data
5. **Implement rate limiting** for API endpoints
6. **Regular security audits** with `npm audit`

## 📝 Environment Variables

```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Optional
NODE_ENV="development"
```

## 🐛 Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Authentication Not Working
- Clear browser cookies
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

### Prisma Client Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset and reseed database
npx prisma migrate reset
npx prisma db seed
```

## 📚 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth v5
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** Sonner

## 📄 License

MIT License - See LICENSE file for details
