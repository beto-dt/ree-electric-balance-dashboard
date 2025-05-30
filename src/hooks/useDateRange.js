import { useState, useEffect } from 'react';
import { subMonths, format } from 'date-fns';

/**
 * Hook personalizado para manejar rangos de fechas con formato para REE API
 * @param {Number} defaultMonthsBack - Número de meses hacia atrás para la fecha de inicio predeterminada
 * @returns {Object} - Objeto con fechas y funciones para manipularlas
 */
const useDateRange = (defaultMonthsBack = 1) => {
    const [startDate, setStartDate] = useState(subMonths(new Date(), defaultMonthsBack));
    const [endDate, setEndDate] = useState(new Date());

    const [formattedStartDate, setFormattedStartDate] = useState('');
    const [formattedEndDate, setFormattedEndDate] = useState('');

    useEffect(() => {
        setFormattedStartDate(format(startDate, "yyyy-MM-dd'T'00:00"));
        setFormattedEndDate(format(endDate, "yyyy-MM-dd'T'23:59"));
    }, [startDate, endDate]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const setPresetRange = (months) => {
        setStartDate(subMonths(new Date(), months));
        setEndDate(new Date());
    };

    return {
        startDate,
        endDate,
        formattedStartDate,
        formattedEndDate,
        handleStartDateChange,
        handleEndDateChange,
        setPresetRange
    };
};

export default useDateRange;
