# Docker PostgreSQL Setup

## Quick Start

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your Windows machine.

### 2. Start PostgreSQL Container
```bash
docker-compose up -d
```

This will:
- Download PostgreSQL 16 Alpine image (if not already downloaded)
- Create a container named `nodedrop-postgres`
- Start PostgreSQL on port 5432
- Create database `nodedrop` with user `nodedrop`

### 3. Verify Container is Running
```bash
docker ps
```

You should see `nodedrop-postgres` in the list.

### 4. Check Container Logs
```bash
docker-compose logs postgres
```

### 5. Initialize Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

### 6. Start Development Server
```bash
npm run dev
```

## Docker Commands

### Stop PostgreSQL
```bash
docker-compose down
```

### Stop and Remove Data (WARNING: Deletes all data)
```bash
docker-compose down -v
```

### Restart PostgreSQL
```bash
docker-compose restart
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL CLI
```bash
docker exec -it nodedrop-postgres psql -U nodedrop -d nodedrop
```

Common psql commands:
- `\l` - List databases
- `\dt` - List tables
- `\d table_name` - Describe table
- `\q` - Quit

## Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** nodedrop
- **Username:** nodedrop
- **Password:** nodedrop123
- **Connection String:** `postgresql://nodedrop:nodedrop123@localhost:5432/nodedrop?schema=public`

## Troubleshooting

### Port Already in Use
If port 5432 is already in use, edit `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Change host port to 5433
```

Then update `.env`:
```env
DATABASE_URL="postgresql://nodedrop:nodedrop123@localhost:5433/nodedrop?schema=public"
```

### Container Won't Start
```bash
# Check logs
docker-compose logs postgres

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Connection Refused
1. Ensure Docker Desktop is running
2. Check container is running: `docker ps`
3. Check container health: `docker-compose ps`
4. Verify port mapping: `docker port nodedrop-postgres`

## Using Prisma Studio

View and edit your database with a GUI:
```bash
npx prisma studio
```

Opens at `http://localhost:5555`

## Production Notes

For production, use:
- Strong passwords
- Environment variables for credentials
- Managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
- Regular backups
- SSL connections
