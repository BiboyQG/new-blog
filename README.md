# Full-Stack Blog Application

A modern, responsive blog application built with React and Go. This project features a React frontend with Tailwind CSS for styling and a Go backend using Gin framework with PostgreSQL (Neon) database.

## Features

- Modern, responsive UI with dark mode support
- Markdown-based blog post editor
- Authentication using Auth0
- Admin dashboard for content management
- Comments system
- Tag-based categorization
- PostgreSQL database using Neon
- Cache system for posts and comments

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Headless UI
- Hero Icons
- React Markdown
- React Hook Form
- Zod for validation

### Backend

- Go
- Gin framework
- PostgreSQL (Neon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Go 1.20+
- PostgreSQL database (or Neon account)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/blog.git
cd blog
```

2. Install frontend dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env.local` and fill in your values

4. Run the backend server:

```bash
cd api
go mod download
go run main.go
```

5. Run the frontend development server:

```bash
npm run dev
```

6. Open your browser and navigate to: `http://localhost:5173`

## Project Structure

- `/api` - Go backend code
  - `/db` - Database initialization and configuration
  - `/handlers` - API route handlers
  - `/models` - Data models for the application
- `/src` - React frontend code
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/pages` - Application pages
  - `/api` - API client code
  - `/utils` - Utility functions
  - `/types` - TypeScript type definitions

## API Endpoints

- `/api/health` - Health check endpoint
- `/api/posts` - Blog post CRUD operations
- `/api/comments` - Comment operations
- `/api/tags` - Tag management

## Development

### Frontend

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend

```bash
cd api

# Run server
go run main.go
```

## Deployment

The application is designed to be easily deployed to platforms like Vercel for the frontend and Railway/Render for the backend.

## License

[MIT License](LICENSE)
