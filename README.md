- **Consulta de datos históricos**: Permite visualizar y analizar datos en diferentes rangos temporales
- **Filtrado por fecha**: Selección de períodos específicos para análisis
- **Responsive**: Diseño adaptable a diferentes dispositivos
- **Manejo de errores**: Gestión robusta de errores y estados de carga

## Principales componentes

### Páginas

- **Dashboard**: Muestra una visión general del balance eléctrico actual
- **HistoricalData**: Permite analizar datos históricos con filtros
- **About**: Información sobre el proyecto y sus tecnologías

### Componentes de visualización

- **BalanceChart**: Gráfico de líneas que muestra la evolución del balance eléctrico
- **GenerationDistributionChart**: Gráfico circular que muestra la distribución de generación por tipo
- **DemandTrendChart**: Gráfico de área que muestra las tendencias de demanda

### Componentes comunes

- **DateRangePicker**: Selector de rango de fechas
- **Card**: Contenedor con estilo para mostrar información
- **Button**: Botón reutilizable con diferentes variantes
- **LoadingSpinner**: Indicador de carga
- **ErrorMessage**: Componente para mostrar mensajes de error

## Integración con el backend

La aplicación se comunica con el backend a través de una API GraphQL. Utilizamos Apollo Client para gestionar las consultas y el estado de los datos.

### Consultas principales

```graphql
# Obtener balance eléctrico por rango de fechas
query GetBalanceByDateRange($startDate: String!, $endDate: String!, $timeTrunc: String) {
  electricBalance(startDate: $startDate, endDate: $endDate, timeTrunc: $timeTrunc) {
    date
    generation {
      total
      renewable
      nonRenewable
      distribution {
        type
        value
        percentage
      }
    }
    demand {
      total
      peak
      valley
    }
    interchange {
      import
      export
      balance
    }
  }
}
```

## Hooks personalizados

- **useElectricBalance**: Gestiona la obtención de datos del balance eléctrico
- **useDateRange**: Facilita el manejo de rangos de fechas y su formateo

## Estilos

Los estilos están organizados en archivos CSS modulares:

- **global.css**: Estilos globales, variables CSS, reset
- Variables CSS para mantener consistencia en colores, tamaños, etc.
- Diseño responsive con media queries

## Docker

### Dockerfile para el frontend

```dockerfile
FROM node:16-alpine as build

WORKDIR /app

# Instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código fuente
COPY . .

# Construimos la aplicación
RUN npm run build

# Configuramos el servidor de producción
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Pruebas

Se incluyen pruebas unitarias y de integración utilizando Jest y React Testing Library:

- Pruebas de componentes
- Pruebas de hooks personalizados
- Pruebas de integración con Apollo Client

## Extensibilidad

La arquitectura está diseñada para ser fácilmente extensible:

- Agregar nuevos tipos de gráficos
- Incorporar nuevas páginas o vistas
- Conectar con diferentes endpoints o APIs
- Añadir nuevas funcionalidades sin afectar a las existentes

## Guía de desarrollo

### Añadir un nuevo componente

1. Crear el componente en la carpeta correspondiente
2. Implementar los tests necesarios
3. Importar y utilizar el componente donde sea necesario

### Añadir una nueva consulta GraphQL

1. Definir la consulta en `graphql/queries.js`
2. Crear un hook personalizado si es necesario
3. Utilizar la consulta en los componentes correspondientes

## Optimización de rendimiento

- Uso de useMemo para cálculos costosos
- Memoización de componentes cuando sea necesario
- Optimización de re-renderizados
- Carga perezosa de componentes grandes
