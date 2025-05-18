import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { useQuery } from '@apollo/client';
import { GET_GENERATION_DISTRIBUTION } from '../../graphql/queries';

const GenerationDistributionChart = ({
                                         data,
                                         loading,
                                         startDate,
                                         endDate,
                                         timeScope = 'day',
                                         chartType = 'pie'
                                     }) => {
    // Obtenemos directamente los datos de distribución de generación
    // usando la consulta específica para ello
    const {
        loading: distLoading,
        data: distributionData,
        error: distError
    } = useQuery(GET_GENERATION_DISTRIBUTION, {
        variables: {
            startDate,
            endDate,
            timeScope
        },
        skip: !startDate || !endDate,
        fetchPolicy: 'network-only'
    });

    // Procesamos los datos para el gráfico
    const chartData = useMemo(() => {
        // Si tenemos datos directamente de la consulta de distribución
        if (distributionData?.generationDistribution && Array.isArray(distributionData.generationDistribution)) {
            return distributionData.generationDistribution.map(item => ({
                name: item.type,
                value: item.avgValue,
                percentage: item.percentage,
                color: item.color || '#cccccc' // Color por defecto si no viene definido
            })).sort((a, b) => b.value - a.value);
        }

        // Si no tenemos datos específicos, intentamos extraerlos del balance general
        if (data && Array.isArray(data) && data.length > 0) {
            // Sumamos todos los valores por tipo de generación
            const aggregatedData = data.reduce((acc, dayData) => {
                if (dayData.generation && dayData.generation.distribution && Array.isArray(dayData.generation.distribution)) {
                    dayData.generation.distribution.forEach(item => {
                        if (!acc[item.type]) {
                            acc[item.type] = {
                                total: 0,
                                count: 0,
                                color: item.color || '#cccccc'
                            };
                        }
                        acc[item.type].total += item.value || 0;
                        acc[item.type].count += 1;
                    });
                }
                return acc;
            }, {});

            // Calculamos el total para los porcentajes
            const totalGeneration = Object.values(aggregatedData).reduce(
                (sum, { total }) => sum + total, 0
            );

            // Convertimos a formato para la gráfica
            return Object.entries(aggregatedData).map(([type, data]) => ({
                name: type,
                value: data.total / data.count, // Promediamos
                percentage: totalGeneration > 0 ? (data.total / totalGeneration) * 100 : 0,
                color: data.color
            })).sort((a, b) => b.value - a.value);
        }

        return [];
    }, [distributionData, data]);

    // Estado de carga combinado
    const isLoading = loading || distLoading;

    if (isLoading) {
        return <div className="chart-loading">Cargando datos...</div>;
    }

    if (distError) {
        return <div className="chart-error">Error al cargar los datos: {distError.message}</div>;
    }

    if (chartData.length === 0) {
        return <div className="chart-empty">No hay datos disponibles</div>;
    }

    // Función para renderizar el tipo de gráfico adecuado
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value.toLocaleString()} MWh (${props.payload.percentage.toFixed(1)}%)`,
                                'Generación Media'
                            ]}
                        />
                        <Legend />
                        <Bar
                            dataKey="value"
                            name="Generación Media"
                            fill="#8884d8"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                );

            case 'pie':
            default:
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={130}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percentage }) =>
                                `${name}: ${percentage.toFixed(1)}%`
                            }
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name, props) => [
                                `${value.toLocaleString()} MWh (${props.payload.percentage.toFixed(1)}%)`,
                                name
                            ]}
                        />
                        <Legend />
                    </PieChart>
                );
        }
    };

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h3>Distribución de Generación Eléctrica</h3>
                <div className="chart-info">
                    <span>Total: {chartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} MWh</span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                {renderChart()}
            </ResponsiveContainer>

            {/* Tabla de datos adicional para mostrar detalles exactos */}
            <div className="chart-data-table">
                <table>
                    <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Valor Medio (MWh)</th>
                        <th>Porcentaje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chartData.map((item, index) => (
                        <tr key={`row-${index}`}>
                            <td>
                  <span
                      className="color-indicator"
                      style={{ backgroundColor: item.color }}
                  ></span>
                                {item.name}
                            </td>
                            <td>{item.value.toLocaleString()}</td>
                            <td>{item.percentage.toFixed(1)}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GenerationDistributionChart;
