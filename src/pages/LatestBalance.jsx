import { useEffect, useCallback, useState } from 'react';
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

const LatestBalance = () => {
    // Estado local para controlar la carga manual
    const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);

    // Configuración de consulta Apollo
    const {
        loading,
        data,
        error,
        refetch
    } = useQuery(GET_LATEST_BALANCE, {
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'network-only', // Asegura que siempre se haga una petición a la red
        errorPolicy: 'all' // Maneja errores pero sigue devolviendo datos si hay alguno en caché
    });

    // Función segura para refrescar datos, usando useCallback para memorizar
    const safeRefetch = useCallback(async () => {
        try {
            setIsManuallyRefreshing(true);
            await refetch();
        } catch (err) {
            console.error('Error al refrescar los datos:', err);
        } finally {
            setIsManuallyRefreshing(false);
        }
    }, [refetch]);

    // Configurar intervalo de refresco automático
    useEffect(() => {
        const intervalId = setInterval(() => {
            safeRefetch();
        }, REFRESH_INTERVALS.LATEST_DATA);

        return () => clearInterval(intervalId);
    }, [safeRefetch]);

    // Combina los estados de carga
    const isLoading = loading || isManuallyRefreshing;

    // Renderizado condicional para estado de carga
    if (isLoading && !data) {
        return (
            <Card title="Balance Eléctrico Actual">
                <div className="loading-container">
                    <LoadingSpinner />
                    <p>Cargando datos actuales...</p>
                </div>
            </Card>
        );
    }

    // Renderizado condicional para estado de error
    if (error && !data) {
        return (
            <Card title="Balance Eléctrico Actual">
                <ErrorMessage
                    message={`Error al cargar los datos actuales: ${error.message}`}
                    onRetry={safeRefetch}
                />
            </Card>
        );
    }

    // Renderizado condicional para estado sin datos
    if (!data || !data.latestElectricBalance) {
        return (
            <Card title="Balance Eléctrico Actual">
                <div className="no-data-message">
                    <p>No hay datos disponibles en este momento.</p>
                    <button
                        className="button"
                        onClick={() => safeRefetch()}
                        disabled={isLoading}
                    >
                        Intentar nuevamente
                    </button>
                </div>
            </Card>
        );
    }

    // Procesamiento de datos para visualización
    const balance = data.latestElectricBalance;
    let timestamp, formattedDate;

    try {
        timestamp = parseISO(balance.timestamp);
        formattedDate = format(timestamp, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (err) {
        formattedDate = 'Fecha no disponible';
        console.error('Error al procesar la fecha:', err);
    }

    // Proceso seguro de los datos de generación
    const generationData = Array.isArray(balance.generation)
        ? balance.generation.map(item => ({
            name: item.type || 'Sin especificar',
            value: typeof item.value === 'number' ? item.value : 0,
            percentage: typeof item.percentage === 'number' ? item.percentage : 0,
            color: item.color || '#cccccc'
        }))
        : [];

    const renewablePercentage = typeof balance.renewablePercentage === 'number' ? balance.renewablePercentage : 0;
    const isNetImporter = balance.balance > 0;
    const balanceText = isNetImporter
        ? `Importación neta: ${(balance.balance || 0).toLocaleString()} MWh`
        : `Exportación neta: ${Math.abs(balance.balance || 0).toLocaleString()} MWh`;

    // Renderizado final con datos
    return (
        <Card title="Balance Eléctrico Actual">
            <div className="latest-balance-widget">
                <div className="latest-balance-header">
                    <div className="timestamp">
                        <span className="label">Última actualización:</span>
                        <span className="value">{formattedDate}</span>
                        {isLoading && <span className="refreshing-indicator">⟳</span>}
                    </div>
                    <button
                        className="refresh-button"
                        onClick={() => safeRefetch()}
                        disabled={isLoading}
                        aria-label="Actualizar datos"
                        type="button"
                    >
                        Actualizar
                    </button>
                </div>

                <div className="latest-balance-metrics">
                    <div className="metric-item">
                        <h4>Generación Total</h4>
                        <div className="metric-value">{(balance.totalGeneration || 0).toLocaleString()} MWh</div>
                    </div>
                    <div className="metric-item">
                        <h4>Demanda Total</h4>
                        <div className="metric-value">{(balance.totalDemand || 0).toLocaleString()} MWh</div>
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

                {generationData.length > 0 && (
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
                                            `${value.toLocaleString()} MWh (${props.payload?.percentage?.toFixed(1) || 0}%)`,
                                            name
                                        ]}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                <div className="time-scope-info">
                    <span className="label">Granularidad:</span>
                    <span className="value">{balance.timeScope || 'No especificada'}</span>
                </div>
            </div>
        </Card>
    );
};

export default LatestBalance;
