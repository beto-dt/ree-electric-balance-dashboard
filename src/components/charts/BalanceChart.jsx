import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const BalanceChart = ({ data, loading, chartType = 'line', timeSeries }) => {
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) return [];

        if (timeSeries && timeSeries.generation && Array.isArray(timeSeries.generation) && timeSeries.generation.length > 0) {
            return timeSeries.generation.map((genItem, index) => {
                const demandItem = timeSeries.demand && Array.isArray(timeSeries.demand) && timeSeries.demand.length > index ?
                    timeSeries.demand[index] : null;
                const renewableItem = timeSeries.renewable && Array.isArray(timeSeries.renewable) && timeSeries.renewable.length > index ?
                    timeSeries.renewable[index] : null;

                return {
                    date: genItem.timestamp ? format(parseISO(genItem.timestamp), 'dd MMM', { locale: es }) : `Punto ${index + 1}`,
                    generacionTotal: genItem.value || 0,
                    demandaTotal: demandItem ? demandItem.value : 0,
                    porcentajeRenovable: renewableItem ? renewableItem.value : 0
                };
            });
        }

        return data.map(item => {
            const date = item.date ? format(parseISO(item.date), 'dd MMM', { locale: es }) : '';

            const generationTotal = item.generation && typeof item.generation.total === 'number' ? item.generation.total : 0;
            const generationRenovable = item.generation && typeof item.generation.renewable === 'number' ? item.generation.renewable : 0;
            const generationNoRenovable = item.generation && typeof item.generation.nonRenewable === 'number' ? item.generation.nonRenewable : 0;

            const demandaTotal = item.demand && typeof item.demand.total === 'number' ? item.demand.total : 0;

            const balance = item.interchange && typeof item.interchange.balance === 'number' ? item.interchange.balance : 0;

            return {
                date,
                generacionTotal: generationTotal,
                generacionRenovable: generationRenovable,
                generacionNoRenovable: generationNoRenovable,
                demandaTotal: demandaTotal,
                balance: balance,
                porcentajeRenovable: item.renewablePercentage || 0
            };
        });
    }, [data, timeSeries]);

    if (loading) {
        return <div className="chart-loading">Cargando datos...</div>;
    }

    if (chartData.length === 0) {
        return <div className="chart-empty">No hay datos disponibles</div>;
    }

    const colors = {
        generacionTotal: '#1a73e8',
        generacionRenovable: '#34a853',
        generacionNoRenovable: '#ea4335',
        demandaTotal: '#fbbc04',
        balance: '#9c27b0',
        porcentajeRenovable: '#00c853'
    };

    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 5, right: 30, left: 20, bottom: 5 }
        };

        // Series de datos a mostrar
        const series = [
            { dataKey: 'generacionTotal', name: 'Generación Total', color: colors.generacionTotal },
            { dataKey: 'generacionRenovable', name: 'Generación Renovable', color: colors.generacionRenovable },
            { dataKey: 'demandaTotal', name: 'Demanda Total', color: colors.demandaTotal },
            { dataKey: 'balance', name: 'Balance (Imp/Exp)', color: colors.balance }
        ];

        switch (chartType) {
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
                        <Legend />
                        {series.map(s => (
                            <Bar
                                key={s.dataKey}
                                dataKey={s.dataKey}
                                name={s.name}
                                fill={s.color}
                                stackId={s.dataKey === 'balance' ? '2' : '1'}
                            />
                        ))}
                    </BarChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
                        <Legend />
                        {series.map(s => (
                            <Area
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                name={s.name}
                                fill={s.color}
                                stroke={s.color}
                                fillOpacity={0.6}
                            />
                        ))}
                    </AreaChart>
                );

            case 'line':
            default:
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `${value.toLocaleString()} MWh`} />
                        <Legend />
                        {series.map(s => (
                            <Line
                                key={s.dataKey}
                                type="monotone"
                                dataKey={s.dataKey}
                                name={s.name}
                                stroke={s.color}
                                activeDot={{ r: 8 }}
                                dot={{ r: 3 }}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                );
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3>Evolución del Balance Eléctrico</h3>
                <div className="chart-metadata">
          <span className="chart-info">
            <strong>Periodo:</strong> {chartData.length > 0 ? `${chartData[0].date} - ${chartData[chartData.length - 1].date}` : ''}
          </span>
                    <span className="chart-info">
            <strong>Datos:</strong> {chartData.length} puntos
          </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

export default BalanceChart;
