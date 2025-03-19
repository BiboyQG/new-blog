# Full-Stack Blog Application

A modern, responsive blog application built with React and Go. This project features a React frontend with Tailwind CSS for styling and a Go backend using Gin framework with PostgreSQL (Neon) database. You can preview the live site [here](https://banghao.live).

![preview.png](https://s2.loli.net/2025/03/19/nXi9HrTVgdysZ2q.png)

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

The project can be easily deployed using Docker with separate containerization for frontend and backend:

### Docker Deployment

#### Frontend

The frontend uses Nginx to serve static files:

```bash
# Build the Docker image
docker build -t blog-frontend:tag \                                    
  --build-arg VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com \
  --build-arg VITE_AUTH0_CLIENT_ID=your-auth0-client-id \
  --build-arg VITE_AUTH0_CALLBACK_URL=your-auth0-callback-url \
  --build-arg VITE_API_URL=your-backend-url/api \
  -f frontend.Dockerfile .

# Run the container
docker run -p 80:80 blog-frontend
```

#### Backend

The backend compiles the Go application and runs the binary:

```bash
# Build the Docker image
docker build -f backend.Dockerfile -t blog-backend .

# Run the container
docker run -d -p 8080:8080 --name blog-backend-container \             
  -e PORT=8080 \                                                   
  -e NEON_DATABASE_URL="your-neon-database-connection-string" \
  blog-backend:tag
```

### Cloud Deployment

- **Google Cloud Run**: The live preview at [https://banghao.live](https://banghao.live) is deployed using Google Cloud Run
- **PaaS Options**: For simpler deployment, you can choose platforms like Netlify (frontend) and Render (backend), which provide streamlined CI/CD pipelines

## License

[MIT License](LICENSE)
