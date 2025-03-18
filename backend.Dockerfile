FROM golang:1.22-alpine AS build

WORKDIR /app

COPY api/go.mod api/go.sum ./
RUN go mod download

COPY api/ ./
RUN go build -o blog-api .

FROM alpine:latest

WORKDIR /app

# Install needed dependencies
RUN apk --no-cache add ca-certificates

# Copy backend binary
COPY --from=build /app/blog-api .

# Copy any needed environment variables
# (In production, use proper secrets management)
COPY api/.env.example .env

EXPOSE 8080

CMD ["./blog-api"] 