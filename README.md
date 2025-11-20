# E-Commerce Marketplace

A modern, professional e-commerce marketplace platform with .toon format data source integration.

## 🚀 Live Demo

**[View Live Demo](https://santanug5ai.github.io/demopotal2/)**

> **Note**: The live demo is a static frontend preview. For full functionality including the backend API, please run the application locally. This application uses .toon format files for data storage - **no database required**!

## Features

- 🛍️ Multi-vendor marketplace
- 📦 .toon format product catalog integration
- 🎨 Professional, responsive UI built with React + TypeScript
- 🔒 Secure authentication and authorization
- 💳 Payment processing integration ready
- 📊 Advanced analytics and reporting
- 🔍 Powerful search and filtering
- 📱 Mobile-first responsive design

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite for blazing fast builds
- Tailwind CSS + shadcn/ui for beautiful UI
- TanStack Query for data fetching
- Zustand for state management
- React Router for navigation

### Backend
- Node.js 20+ with ES Modules
- Express.js framework
- **File-based storage** using .toon format
- No database required! All data stored in JSON .toon files
- Simple REST API

## Project Structure

```
.
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utility functions
│   │   ├── services/  # API services
│   │   └── types/     # TypeScript types
│   └── package.json
│
├── backend/           # Express.js backend application
│   ├── src/
│   │   └── index.js   # Main API server (reads/writes .toon files)
│   └── package.json
│
├── data/              # Sample .toon format files
├── docs/              # GitHub Pages site (auto-generated)
└── documentation/     # Project documentation

```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

**That's it! No database installation required!** All data is stored in `.toon` format JSON files.

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd demopotal2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional):
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

4. Start the development servers:
```bash
# From root directory
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:3000`

## .toon Format

The `.toon` format is a structured JSON format for product catalogs. See [SPECIFICATION.md](./SPECIFICATION.md) for detailed format documentation.

### Example .toon File

```json
{
  "version": "1.0",
  "metadata": {
    "catalog_id": "cat_001",
    "catalog_name": "Electronics Catalog"
  },
  "products": [
    {
      "id": "prod_001",
      "sku": "LAPTOP-001",
      "name": "Professional Laptop",
      "price": {
        "amount": 1299.99,
        "currency": "USD"
      }
    }
  ]
}
```

## Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run format` - Format code with Prettier

### Frontend
- `npm run dev --workspace=frontend` - Start frontend dev server
- `npm run build --workspace=frontend` - Build frontend for production
- `npm run preview --workspace=frontend` - Preview production build

### Backend
- `npm run dev --workspace=backend` - Start backend dev server
- `npm run build --workspace=backend` - Build backend for production
- `npm run start:prod --workspace=backend` - Start production server

## Documentation

- [Full Specification](./SPECIFICATION.md) - Comprehensive system specification
- [API Documentation](./documentation/API.md) - API endpoints and usage
- [.toon Format Guide](./documentation/TOON_FORMAT.md) - .toon format specification
- [Getting Started Guide](./documentation/GETTING_STARTED.md) - Setup instructions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
