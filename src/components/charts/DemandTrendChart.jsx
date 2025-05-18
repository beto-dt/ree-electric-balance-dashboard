import React, { useMemo } from 'react';
import {
    AreaChart,
    Area,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const DemandTrendChart = ({ data, loading, chartType = 'area', timeSeries }) => {
    // Transformamos los datos para la gráfica
    const chartData = useMemo(() => {
        // Si tenemos datos de series temporales específicos para demanda, los usamos
        if (timeSeries && timeSeries.length > 0) {
            return timeSeries.map(item => ({
                date: format(parseISO(item.timestamp), 'dd MMM', { locale: es }),
                demandaTotal: item.value
            }));
        }

        // Si no tenemos series temporales, procesamos los datos del balance general
        if (!data || data.length === 0) return [];

        return data.map(item => {
            // Aseguramos que tenemos una fecha válida
            const date = item.date ? format(parseISO(item.date), 'dd MMM', { locale: es }) : '';

            return {
                date,
                demandaTotal: item.demand?.total || 0,
                demandaPico: item.demand?.peak || null,
                demandaValle: item.demand?.valley || null
            };
        });
    }, [data, timeSeries]);

    // Calculamos estadísticas para mostrar
    const stats = useMemo(() => {
        if (chartData.length === 0) return null;

        const demandValues = chartData.map(item => item.demandaTotal).filter(Boolean);
        return {
            max: Math.max(...demandValues),
            min: Math.min(...demandValues),
            avg: demandValues.reduce((sum, val) => sum + val, 0) / demandValues.length
        };
    }, [chartData]);

    if (loading) {
        return <div className="chart-loading">Cargando datos...</div>;
    }

    if (chartData.length === 0) {
        return <div className="chart-empty">No hay datos disponibles</div>;
    }

    // Función para renderizar el tipo de gráfico adecuado
    const renderChart = () => {
        // Propiedades comunes para todos los tipos de gráficos
        const commonProps = {
            data: chartData,
            margin: { top: 10, right: 30, left: 0, bottom: 0 }
        };

        // Definimos colores para las series
        const colors = {
            demandaTotal: '#1a73e8',  // Azul
            demandaPico: '#EA4335',   // Rojo
            demandaValle: '#34A853'   // Verde
        };

        switch (chartType) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="demandaTotal"
                            name="Demanda Total"
                            stroke={colors.demandaTotal}
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                        />
                        {chartData[0].demandaPico !== null && (
                            <Line
                                type="monotone"
                                dataKey="demandaPico"
                                name="Demanda Pico"
                                stroke={colors.demandaPico}
                                strokeWidth={2}
                            />
                        )}
                        {chartData[0].demandaValle !== null && (
                            <Line
                                type="monotone"
                                dataKey="demandaValle"
                                name="Demanda Valle"
                                stroke={colors.demandaValle}
                                strokeWidth={2}
                            />
                        )}
                    </LineChart>
                );

            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
                        <Legend />
                        <Bar
                            dataKey="demandaTotal"
                            name="Demanda Total"
                            fill={colors.demandaTotal}
                        />
                        {chartData[0].demandaPico !== null && (
                            <Bar
                                dataKey="demandaPico"
                                name="Demanda Pico"
                                fill={colors.demandaPico}
                            />
                        )}
                        {chartData[0].demandaValle !== null && (
                            <Bar
                                dataKey="demandaValle"
                                name="Demanda Valle"
                                fill={colors.demandaValle}
                            />
                        )}
                    </BarChart>
                );

            case 'area':
            default:
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="demandaTotal"
                            name="Demanda Total"
                            stroke={colors.demandaTotal}
                            fill={colors.demandaTotal}
                            fillOpacity={0.6}
                        />
                        {chartData[0].demandaPico !== null && (
                            <Area
                                type="monotone"
                                dataKey="demandaPico"
                                name="Demanda Pico"
                                stroke={colors.demandaPico}
                                fill={colors.demandaPico}
                                fillOpacity={0.6}
                            />
                        )}
                        {chartData[0].demandaValle !== null && (
                            <Area
                                type="monotone"
                                dataKey="demandaValle"
                                name="Demanda Valle"
                                stroke={colors.demandaValle}
                                fill={colors.demandaValle}
                                fillOpacity={0.6}
                            />
                        )}
                    </AreaChart>
                );
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3>Tendencia de Demanda Eléctrica</h3>
                {stats && (
                    <div className="chart-stats">
                        <div className="stat-item">
                            <span className="stat-label">Máxima:</span>
                            <span className="stat-value">{stats.max.toLocaleString()} MWh</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Media:</span>
                            <span className="stat-value">{stats.avg.toLocaleString()} MWh</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Mínima:</span>
                            <span className="stat-value">{stats.min.toLocaleString()} MWh</span>
                        </div>
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height={400}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default DemandTrendChart;
