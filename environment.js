// Configuración del entorno para desarrollo, testing y producción
// Este archivo recoge variables de entorno y las expone para su uso en la aplicación

/**
 * Configuración para entorno de desarrollo
 */
const development = {
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:4000',
    REE_API_URL: 'https://apidatos.ree.es/es/datos/balance/balance-electrico',
};

/**
 * Configuración para entorno de test
 */
const test = {
    API_URL: 'http://localhost:4000',
    REE_API_URL: 'https://apidatos.ree.es/es/datos/balance/balance-electrico',
};

/**
 * Configuración para entorno de producción
 */
const production = {
    API_URL: process.env.REACT_APP_API_URL || '/api',
    REE_API_URL: 'https://apidatos.ree.es/es/datos/balance/balance-electrico',
};

/**
 * Configuración común para todos los entornos
 */
const common = {
    // Configuración de tiempo en milisegundos
    TIME_INTERVALS: {
        AUTO_REFRESH: 60000, // 1 minuto
        POLL_INTERVAL: 300000, // 5 minutos
    },

    // Configuración de paginación
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    },

    // Opciones de visualización
    DISPLAY_OPTIONS: {
        DATE_FORMAT: 'dd/MM/yyyy',
        TIME_FORMAT: 'HH:mm',
        DATETIME_FORMAT: 'dd/MM/yyyy HH:mm',
    },
};

/**
 * Determina el entorno actual basado en la variable NODE_ENV
 */
const getEnvironment = () => {
    switch (process.env.NODE_ENV) {
        case 'development':
            return { ...common, ...development };
        case 'test':
            return { ...common, ...test };
        case 'production':
            return { ...common, ...production };
        default:
            return { ...common, ...development };
    }
};

// Exportamos la configuración para el entorno actual
const config = getEnvironment();
export default config;
