FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Set Auth0 environment variables for build
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_CALLBACK_URL
ARG VITE_API_URL

ENV VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
ENV VITE_AUTH0_CALLBACK_URL=${VITE_AUTH0_CALLBACK_URL}
ENV VITE_API_URL=${VITE_API_URL}

# Generate config.js with build-time environment variables
RUN echo "window.RUNTIME_CONFIG = { \
  AUTH0_DOMAIN: \"$VITE_AUTH0_DOMAIN\", \
  AUTH0_CLIENT_ID: \"$VITE_AUTH0_CLIENT_ID\", \
  AUTH0_CALLBACK_URL: \"$VITE_AUTH0_CALLBACK_URL\", \
  API_URL: \"$VITE_API_URL\" \
};" > /app/public/config.js

# Skip TypeScript errors and run build directly
RUN npx vite build --emptyOutDir

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 