// API URLs
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
export const GRAPHQL_URL = `${API_URL}/graphql`;
export const REE_API_URL = process.env.REACT_APP_REE_API_URL || 'https://apidatos.ree.es/es/datos/balance/balance-electrico';

// Opciones de truncamiento temporal
export const TIME_TRUNC_OPTIONS = [
    { value: 'hour', label: 'Hora' },
    { value: 'day', label: 'Día' },
    { value: 'month', label: 'Mes' },
    { value: 'year', label: 'Año' },
];

// Indicadores disponibles para series temporales
export const INDICATORS = [
    { value: 'totalGeneration', label: 'Generación Total' },
    { value: 'totalDemand', label: 'Demanda Total' },
    { value: 'renewablePercentage', label: 'Porcentaje Renovable' },
    { value: 'balance', label: 'Balance Importación/Exportación' }
];

// Tipos de generación y sus colores
// Estos se usarán solo como fallback si no vienen definidos desde el backend
export const GENERATION_TYPES = {
    // Renovables
    'Hidráulica': {
        color: '#2E86C1',
        renewable: true
    },
    'Eólica': {
        color: '#85C1E9',
        renewable: true
    },
    'Solar fotovoltaica': {
        color: '#F4D03F',
        renewable: true
    },
    'Solar térmica': {
        color: '#F39C12',
        renewable: true
    },
    'Otras renovables': {
        color: '#58D68D',
        renewable: true
    },

    // No renovables
    'Nuclear': {
        color: '#AF7AC5',
        renewable: false
    },
    'Ciclo combinado': {
        color: '#E74C3C',
        renewable: false
    },
    'Carbón': {
        color: '#5D6D7E',
        renewable: false
    },
    'Fuel + Gas': {
        color: '#F5B041',
        renewable: false
    },
    'Cogeneración': {
        color: '#EC7063',
        renewable: false
    },
    'Residuos no renovables': {
        color: '#AAB7B8',
        renewable: false
    }
};

// Rangos de fecha predefinidos
export const DATE_RANGES = [
    { label: 'Últimos 7 días', days: 7 },
    { label: 'Último mes', days: 30 },
    { label: 'Últimos 3 meses', days: 90 },
    { label: 'Último año', days: 365 },
];

// Opciones para la visualización de gráficas
export const CHART_DISPLAY_OPTIONS = [
    { value: 'line', label: 'Líneas' },
    { value: 'bar', label: 'Barras' },
    { value: 'area', label: 'Área' },
    { value: 'pie', label: 'Circular' } // Solo para algunas gráficas
];

// Opciones de paginación
export const PAGINATION_OPTIONS = {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 50,
    PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
    ORDER_DIRECTIONS: [
        { value: 'ASC', label: 'Ascendente' },
        { value: 'DESC', label: 'Descendente' }
    ],
    ORDER_BY_OPTIONS: [
        { value: 'timestamp', label: 'Fecha' },
        { value: 'totalGeneration', label: 'Generación Total' },
        { value: 'totalDemand', label: 'Demanda Total' },
        { value: 'renewablePercentage', label: 'Porcentaje Renovable' }
    ]
};

// Configuración para análisis avanzados
export const ANALYSIS_OPTIONS = {
    DEFAULT_INCLUDE_PATTERNS: true,
    DEFAULT_INCLUDE_SUSTAINABILITY: true
};

// Formatos de fecha para distintos usos
export const DATE_FORMATS = {
    API: "yyyy-MM-dd'T'HH:mm:ss'Z'",
    DISPLAY: 'dd/MM/yyyy',
    DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
    CHART: 'dd MMM',
    FILENAME: 'yyyyMMdd'
};

// Intervalos de actualización automática (en milisegundos)
export const REFRESH_INTERVALS = {
    DASHBOARD: process.env.REACT_APP_AUTO_REFRESH_INTERVAL
        ? parseInt(process.env.REACT_APP_AUTO_REFRESH_INTERVAL, 10)
        : 60000, // 1 minuto por defecto
    LATEST_DATA: 30000 // 30 segundos
};

// Textos para etiquetas comunes
export const LABELS = {
    NO_DATA: 'No hay datos disponibles para el período seleccionado.',
    LOADING: 'Cargando datos...',
    EXPORT_CSV: 'Exportar a CSV',
    EXPORTING: 'Exportando...',
    RETRY: 'Reintentar',
    APPLY: 'Aplicar',
    CANCEL: 'Cancelar'
};
