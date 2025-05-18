FROM node:20-alpine AS build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
# Usar npm install en lugar de npm ci para resolver dependencias
RUN npm install --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Establecer variable de entorno para la API
ARG REACT_APP_API_URL=http://localhost:4000/graphql
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Construir la aplicación
RUN npm run build

# Segunda etapa: Nginx para servir la aplicación
FROM nginx:alpine

# Copiar la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos de construcción desde la primera etapa
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
