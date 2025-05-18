import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { GET_LATEST_BALANCE } from '../graphql/queries';
import { REFRESH_INTERVALS } from '../config/constants';

const LatestBalanceWidget = () => {
    // Consulta para obtener el último balance eléctrico
    const {
        loading,
        data,
        error,
        refetch
    } = useQuery(GET_LATEST_BALANCE, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only'
    });

    // Configuramos una actualización automática cada 30 segundos
    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, REFRESH_INTERVALS.LATEST_DATA);

        return () => clearInterval(intervalId);
    }, [refetch]);

    if (loading && !data) {
        return (
            <Card title="Balance Eléctrico Actual">
                <div className="loading-container">
                    <LoadingSpinner />
                    <p>Cargando datos actuales...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Balance Eléctrico Actual">
                <ErrorMessage
                    message={`Error al cargar los datos actuales: ${error.message}`}
                    onRetry={refetch}
                />
            </Card>
        );
    }

    if (!data || !data.latestElectricBalance) {
        return (
            <Card title="Balance Eléctrico Actual">
                <div className="no-data-message">
                    <p>No hay datos disponibles en este momento.</p>
                    <button className="button" onClick={refetch}>
                        Intentar nuevamente
                    </button>
                </div>
            </Card>
        );
    }

    const balance = data.latestElectricBalance;
    const timestamp = parseISO(balance.timestamp);
    const formattedDate = format(timestamp, 'dd/MM/yyyy HH:mm', { locale: es });

    // Preparamos los datos para el gráfico circular
    const generationData = balance.generation.map(item => ({
        name: item.type,
        value: item.value,
        percentage: item.percentage,
        color: item.color || '#cccccc' // Color por defecto si no viene definido
    }));

    // Calculamos el porcentaje de renovables para el medidor
    const renewablePercentage = balance.renewablePercentage;
    const isNetImporter = balance.balance > 0;
    const balanceText = isNetImporter
        ? `Importación neta: ${balance.balance.toLocaleString()} MWh`
        : `Exportación neta: ${Math.abs(balance.balance).toLocaleString()} MWh`;

    return (
        <Card title="Balance Eléctrico Actual">
            <div className="latest-balance-widget">
                <div className="latest-balance-header">
                    <div className="timestamp">
                        <span className="label">Última actualización:</span>
                        <span className="value">{formattedDate}</span>
                        {loading && <span className="refreshing-indicator">⟳</span>}
                    </div>
                    <button
                        className="refresh-button"
                        onClick={refetch}
                        disabled={loading}
                    >
                        Actualizar
                    </button>
                </div>

                <div className="latest-balance-metrics">
                    <div className="metric-item">
                        <h4>Generación Total</h4>
                        <div className="metric-value">{balance.totalGeneration.toLocaleString()} MWh</div>
                    </div>
                    <div className="metric-item">
                        <h4>Demanda Total</h4>
                        <div className="metric-value">{balance.totalDemand.toLocaleString()} MWh</div>
                    </div>
                    <div className="metric-item">
                        <h4>Energía Renovable</h4>
                        <div className="metric-value">{renewablePercentage.toFixed(1)}%</div>
                        <div className="renewable-gauge">
                            <div
                                className="renewable-gauge-fill"
                                style={{ width: `${renewablePercentage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="metric-item">
                        <h4>Balance</h4>
                        <div className={`metric-value ${isNetImporter ? 'import' : 'export'}`}>
                            {balanceText}
                        </div>
                    </div>
                </div>

                <div className="generation-distribution">
                    <h4>Distribución de Generación</h4>
                    <div className="chart-container" style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={generationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={1}
                                    dataKey="value"
                                >
                                    {generationData.map((entry, index) => (
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
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="time-scope-info">
                    <span className="label">Granularidad:</span>
                    <span className="value">{balance.timeScope}</span>
                </div>
            </div>
        </Card>
    );
};

export default LatestBalanceWidget;
