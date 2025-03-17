# Personal Blog with React and Neon Database

A modern blog application built with React, Tailwind CSS, and Neon Database. Features include Google authentication, markdown editing, and dark/light theme support.

## Features

- **Authentication**: Login with Google via Auth0
- **Role-based Access Control**: Admin privileges for content management
- **Markdown Support**: Live markdown editor and renderer
- **Comments**: Authenticated users can comment on posts
- **Theming**: Dark and light mode support with theme toggle
- **Responsive Design**: Built with Tailwind CSS

## Tech Stack

- **Frontend**: React with TypeScript and Vite
- **Styling**: Tailwind CSS
- **Database**: Neon Serverless Postgres
- **Authentication**: Auth0
- **Markdown**: react-markdown, @uiw/react-md-editor
- **Forms**: react-hook-form with zod validation
- **Utilities**: date-fns, clsx, nanoid

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Auth0 account
- Neon database account

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd blog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment variables:
   Copy the `.env.example` file to `.env.local` and fill in your Auth0 and Neon credentials:

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/context` - React context providers for auth and theme
- `/src/api` - API services for data fetching
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/src/hooks` - Custom React hooks

## Deployment

This application can be deployed to any static hosting service:

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` folder to your hosting provider.

## Admin Access

Admin access is granted to the user with the email `m13971212844@gmail.com`. Only the admin can create, update, and delete blog posts.

## License

MIT
