# Neon Database API

This is a simple Go API that connects to a Neon PostgreSQL database. It provides RESTful endpoints for CRUD operations on a todo list application.

## Prerequisites

- Go 1.21 or higher
- Neon PostgreSQL database

## Setup

1. Clone the repository:

```bash
git clone https://github.com/biboy/blog.git
cd blog/api
```

2. Set up environment variables by creating a `.env.local` file in the `api` directory:

```
NEON_DATABASE_URL=your_neon_database_url
PORT=8080
```

Note: The application will also look for `VITE_NEON_DATABASE_URL` if `NEON_DATABASE_URL` is not found.

3. Install dependencies:

```bash
go mod download
```

4. Run the application:

```bash
go run main.go
```

The server will start on port 8080 (or the port specified in your `.env.local` file).

## API Endpoints

### Health Check

```
GET /api/health
```

Returns a simple health status check.

### Todos

#### Get all todos

```
GET /api/todos
```

Returns all todos from the database.

#### Get a specific todo

```
GET /api/todos/:id
```

Returns a specific todo by its ID.

#### Create a new todo

```
POST /api/todos
```

Creates a new todo. Request body should be JSON in the following format:

```json
{
  "title": "Your todo title"
}
```

#### Update a todo

```
PUT /api/todos/:id
```

Updates an existing todo. Request body should be JSON in the following format:

```json
{
  "title": "Updated title",
  "completed": true
}
```

#### Delete a todo

```
DELETE /api/todos/:id
```

Deletes a todo by its ID.

## Using with Frontend

The API includes CORS middleware, so it can be used with a frontend application running on a different domain. The API server should be running and accessible to your frontend application.

In your frontend code, you can make requests to the API like this:

```javascript
// Example: Fetching all todos
fetch("http://localhost:8080/api/todos")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// Example: Creating a new todo
fetch("http://localhost:8080/api/todos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "New Todo",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```
