# Build Angular App
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production

# Serve Angular App with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/wsu-hw-ng /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
