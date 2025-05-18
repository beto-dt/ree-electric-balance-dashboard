/**
 * Transforma los datos recibidos de la API GraphQL para su visualización
 * @param {Array} data - Datos recibidos de la API GraphQL
 * @returns {Array} - Datos transformados para las gráficas
 */
export const transformBalanceData = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
    }

    return data.map((item) => ({
        date: item.date,
        generacionTotal: item.generation?.total || 0,
        generacionRenovable: item.generation?.renewable || 0,
        generacionNoRenovable: item.generation?.nonRenewable || 0,
        demandaTotal: item.demand?.total || 0,
        importaciones: item.interchange?.import || 0,
        exportaciones: item.interchange?.export || 0,
    }));
};

/**
 * Calcula el porcentaje de energía renovable
 * @param {Object} data - Objeto con datos de generación
 * @returns {Number} - Porcentaje de renovables
 */
export const calculateRenewablePercentage = (data) => {
    if (!data || !data.length) return 0;

    const totalSum = data.reduce((sum, item) => sum + (item.generation?.total || 0), 0);
    const renewableSum = data.reduce((sum, item) => sum + (item.generation?.renewable || 0), 0);

    if (totalSum === 0) return 0;

    return (renewableSum / totalSum) * 100;
};

/**
 * Agrupa los datos de generación por tipo
 * @param {Array} data - Datos recibidos de la API
 * @returns {Object} - Datos agrupados por tipo de generación
 */
export const aggregateGenerationByType = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return {};
    }

    const aggregated = {};

    data.forEach(dayData => {
        if (dayData.generation && dayData.generation.distribution) {
            dayData.generation.distribution.forEach(item => {
                if (!aggregated[item.type]) {
                    aggregated[item.type] = 0;
                }
                aggregated[item.type] += item.value || 0;
            });
        }
    });

    return Object.entries(aggregated).map(([type, value]) => ({
        name: type,
        value: value / data.length,
    })).sort((a, b) => b.value - a.value);
};

/**
 * Calcula estadísticas básicas a partir de los datos
 * @param {Array} data - Datos recibidos de la API
 * @returns {Object} - Objeto con estadísticas calculadas
 */
export const calculateStatistics = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return {
            renewableMean: 0,
            demandMean: 0,
            importExportBalance: 0,
            maxDemand: 0,
            minDemand: 0,
        };
    }

    const renewableMean = data.reduce((sum, item) => sum + (item.generation?.renewable || 0), 0) / data.length;
    const demandMean = data.reduce((sum, item) => sum + (item.demand?.total || 0), 0) / data.length;

    const importExportBalance = data.reduce((sum, item) => {
        const importValue = item.interchange?.import || 0;
        const exportValue = item.interchange?.export || 0;
        return sum + (importValue - exportValue);
    }, 0) / data.length;

    const demandValues = data.map(item => item.demand?.total || 0);
    const maxDemand = Math.max(...demandValues);
    const minDemand = Math.min(...demandValues);

    return {
        renewableMean,
        demandMean,
        importExportBalance,
        maxDemand,
        minDemand,
    };
};
