# Getting Started

This guide will help you set up and run the E-Commerce Marketplace application.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher
- **npm** 10.x or higher
- **PostgreSQL** 15.x or higher
- **Git**

Optional:
- **Docker** and **Docker Compose** (for containerized setup)
- **Redis** (for caching)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd demopotal2
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
npm install
```

This will install dependencies for the root project and all workspaces (frontend and backend).

### 3. Set Up Environment Variables

#### Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and update the following:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your-super-secret-key"
```

#### Frontend

```bash
cd frontend
cp .env.example .env
```

The default values should work for local development.

### 4. Set Up the Database

#### Option A: Using Docker (Recommended)

```bash
docker-compose up -d postgres redis
```

#### Option B: Local PostgreSQL

Create a PostgreSQL database:

```bash
createdb ecommerce
```

#### Run Database Migrations

```bash
cd backend
npm run prisma:migrate
```

#### Seed the Database (Optional)

```bash
npm run prisma:seed
```

## Running the Application

### Option 1: Run All Services (Recommended)

From the root directory:

```bash
npm run dev
```

This will start both frontend and backend concurrently.

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

### Option 2: Run Services Separately

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm run dev
```

### Option 3: Using Docker Compose

```bash
docker-compose up
```

This will start all services (PostgreSQL, Redis, Backend, Frontend).

## Importing .toon Format Data

### Using the Sample Data

Import the sample catalog:

```bash
curl -X POST http://localhost:3000/api/v1/toon/import \
  -H "Content-Type: application/json" \
  -d @data/sample-catalog.toon
```

### Using the API

1. Open the API documentation: http://localhost:3000/api/docs
2. Navigate to the `toon` endpoints
3. Use the `/api/v1/toon/import` endpoint
4. Upload your `.toon` file

## Verify Installation

1. Open http://localhost:5173 in your browser
2. You should see the homepage with featured products
3. Navigate to the Products page
4. Check the backend health: http://localhost:3000/api/v1/health

## Common Issues

### Database Connection Error

If you see `Can't reach database server`:

1. Make sure PostgreSQL is running
2. Verify the `DATABASE_URL` in `backend/.env`
3. Check PostgreSQL is listening on port 5432

### Port Already in Use

If port 3000 or 5173 is already in use:

1. Stop the service using that port
2. Or change the port in the respective `.env` file

### Prisma Client Errors

If you see Prisma client errors:

```bash
cd backend
npm run prisma:generate
```

## Next Steps

- Read the [SPECIFICATION.md](../SPECIFICATION.md) for system architecture
- Check [TOON_FORMAT.md](./TOON_FORMAT.md) for .toon format details
- Review [API.md](./API.md) for API documentation
- Start developing features!

## Development Workflow

1. Create a new branch for your feature
2. Make changes to the code
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Format code: `npm run format`
6. Commit and push changes
7. Create a pull request

## Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with details
- Contact the development team

Happy coding!
