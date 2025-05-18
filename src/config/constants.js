

export const TIME_TRUNC_OPTIONS = [
    { value: 'day', label: 'Día' },
];


export const DATE_RANGES = [
    { label: 'Últimos 7 días', days: 7 },
    { label: 'Último mes', days: 30 },
    { label: 'Últimos 3 meses', days: 90 },
    { label: 'Último año', days: 365 },
];

export const CHART_DISPLAY_OPTIONS = [
    { value: 'line', label: 'Líneas' },
    { value: 'bar', label: 'Barras' },
    { value: 'area', label: 'Área' },
    { value: 'pie', label: 'Circular' }
];


export const DATE_FORMATS = {
    API: "yyyy-MM-dd'T'HH:mm:ss'Z'",
    DISPLAY: 'dd/MM/yyyy',
    DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
    CHART: 'dd MMM',
    FILENAME: 'yyyyMMdd'
};

export const REFRESH_INTERVALS = {
    DASHBOARD: process.env.REACT_APP_AUTO_REFRESH_INTERVAL
        ? parseInt(process.env.REACT_APP_AUTO_REFRESH_INTERVAL, 10)
        : 60000,
    LATEST_DATA: 30000
};

