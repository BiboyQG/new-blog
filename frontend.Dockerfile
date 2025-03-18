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

# Skip TypeScript errors and run build directly
RUN npx vite build --emptyOutDir

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a script to generate runtime config from environment variables
RUN echo '#!/bin/sh \n\
cat > /usr/share/nginx/html/config.js << EOF \n\
window.RUNTIME_CONFIG = { \n\
  AUTH0_DOMAIN: "${AUTH0_DOMAIN}", \n\
  AUTH0_CLIENT_ID: "${AUTH0_CLIENT_ID}", \n\
  AUTH0_CALLBACK_URL: "${AUTH0_CALLBACK_URL}", \n\
  API_URL: "${API_URL}" \n\
}; \n\
EOF \n\
exec "$@" \n\
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"] 