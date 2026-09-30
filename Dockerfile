# Multi-stage build para SPA ITKit
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copia dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm ci

# Copia o código fonte e compila
COPY . .
RUN npm run build

# Stage 2: Servidor Web Nginx
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copia configuração customizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados do Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
