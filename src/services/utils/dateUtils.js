import { format, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha para la API de REE
 * @param {Date} date - Fecha a formatear
 * @param {String} timeOfDay - Momento del día ('start' o 'end')
 * @returns {String} - Fecha formateada
 */
export const formatDateForAPI = (date, timeOfDay = 'start') => {
    if (!date || !isValid(date)) return '';

    const time = timeOfDay === 'end' ? '23:59' : '00:00';
    return format(date, `yyyy-MM-dd'T'${time}`);
};

/**
 * Formatea una fecha ISO para mostrar en la UI
 * @param {String} isoDate - Fecha en formato ISO
 * @param {String} formatStr - Formato deseado
 * @returns {String} - Fecha formateada
 */
export const formatDisplayDate = (isoDate, formatStr = 'dd/MM/yyyy') => {
    if (!isoDate) return '';

    try {
        const date = parseISO(isoDate);
        return format(date, formatStr, { locale: es });
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return isoDate;
    }
};

/**
 * Obtiene presets de rangos de fechas comunes
 * @returns {Array} - Array de objetos con rangos predefinidos
 */
export const getDateRangePresets = () => [
    { label: 'Última semana', days: 7 },
    { label: 'Último mes', days: 30 },
    { label: 'Últimos 3 meses', days: 90 },
    { label: 'Último año', days: 365 },
];

/**
 * Valida un rango de fechas
 * @param {Date} startDate - Fecha de inicio
 * @param {Date} endDate - Fecha de fin
 * @returns {Object} - Objeto con información de validación
 */
export const validateDateRange = (startDate, endDate) => {
    const isValid = startDate && endDate && startDate <= endDate;
    const error = !isValid ? 'La fecha de inicio debe ser anterior a la fecha de fin' : '';

    return { isValid, error };
};
