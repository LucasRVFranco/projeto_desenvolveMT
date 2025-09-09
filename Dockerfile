# ====== STAGE 1: Build (Node) ======
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# ====== STAGE 2: Runtime (Nginx) ======
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*

# 👇 caminho confirmado pelo seu ls
COPY --from=build /app/dist/desenvolve-mt/browser/ /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
