import React, { useState, useEffect, useMemo } from 'react';
import { format, subMonths, parseISO, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import DateRangePicker from '../components/common/DateRangePicker';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import BalanceChart from '../components/charts/BalanceChart';
import GenerationDistributionChart from '../components/charts/GenerationDistributionChart';
import DemandTrendChart from '../components/charts/DemandTrendChart';
import { useElectricBalance } from '../hooks/useElectricBalance';
import { TIME_TRUNC_OPTIONS, DATE_RANGES, CHART_DISPLAY_OPTIONS } from '../config/constants';
import { calculateStatistics, calculateRenewablePercentage } from '../services/utils/dataTransformers';

const HistoricalData = () => {
    // Estados para gestionar los filtros y visualizaciones
    const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState(new Date());
    const [timeTrunc, setTimeTrunc] = useState('day');
    const [chartType, setChartType] = useState('line');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'generation', 'demand'
    const [isExporting, setIsExporting] = useState(false);

    // Formateamos las fechas para la consulta GraphQL
    const formattedStartDate = useMemo(() => {
        return isValid(startDate) ? format(startDate, "yyyy-MM-dd'T'00:00") : '';
    }, [startDate]);

    const formattedEndDate = useMemo(() => {
        return isValid(endDate) ? format(endDate, "yyyy-MM-dd'T'23:59") : '';
    }, [endDate]);

    // Obtenemos los datos del balance eléctrico con el hook personalizado
    const { loading, data, error, retry } = useElectricBalance(
        formattedStartDate,
        formattedEndDate,
        timeTrunc
    );

    // Calculamos estadísticas de los datos
    const statistics = useMemo(() => {
        return data && data.length > 0 ? calculateStatistics(data) : null;
    }, [data]);

    // Calculamos el porcentaje de renovables
    const renewablePercentage = useMemo(() => {
        return data && data.length > 0 ? calculateRenewablePercentage(data) : 0;
    }, [data]);

    // Manejadores para los cambios de fecha
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    // Manejador para cambiar la granularidad de tiempo
    const handleTimeTruncChange = (e) => {
        setTimeTrunc(e.target.value);
    };

    // Manejador para los rangos predefinidos
    const handlePresetRange = (days) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        setStartDate(start);
        setEndDate(end);
    };

    // Manejador para cambiar el tipo de gráfico
    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    // Manejador para cambiar de pestaña
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Función para exportar los datos a CSV
    const handleExportData = () => {
        if (!data || data.length === 0) return;

        setIsExporting(true);

        try {
            // Transformamos los datos a formato CSV
            const headers = [
                'Fecha',
                'Generación Total (MWh)',
                'Generación Renovable (MWh)',
                'Generación No Renovable (MWh)',
                'Demanda Total (MWh)',
                'Importaciones (MWh)',
                'Exportaciones (MWh)',
                'Balance Intercambio (MWh)'
            ].join(',');

            const rows = data.map(item => {
                const date = item.date ? format(parseISO(item.date), 'dd/MM/yyyy HH:mm', { locale: es }) : '';
                const genTotal = item.generation?.total || 0;
                const genRenewable = item.generation?.renewable || 0;
                const genNonRenewable = item.generation?.nonRenewable || 0;
                const demand = item.demand?.total || 0;
                const imports = item.interchange?.import || 0;
                const exports = item.interchange?.export || 0;
                const balance = (imports - exports) || 0;

                return [
                    date,
                    genTotal.toFixed(2),
                    genRenewable.toFixed(2),
                    genNonRenewable.toFixed(2),
                    demand.toFixed(2),
                    imports.toFixed(2),
                    exports.toFixed(2),
                    balance.toFixed(2)
                ].join(',');
            });

            const csvContent = [headers, ...rows].join('\n');

            // Creamos un blob y un link para descargar
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `balance-electrico-${format(startDate, 'yyyyMMdd')}-${format(endDate, 'yyyyMMdd')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error al exportar datos:', err);
        } finally {
            setIsExporting(false);
        }
    };

    // Renderizamos la sección adecuada según la pestaña activa
    const renderTabContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }

        if (error) {
            return (
                <ErrorMessage
                    message={`Error al cargar los datos históricos: ${error}`}
                    onRetry={retry}
                />
            );
        }

        if (!data || data.length === 0) {
            return (
                <div className="no-data-message">
                    <p>No hay datos disponibles para el período seleccionado.</p>
                    <p>Intenta cambiar el rango de fechas o la agrupación temporal.</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <Card title="Balance Eléctrico Histórico">
                            <BalanceChart data={data} loading={loading} chartType={chartType} />
                        </Card>

                        {statistics && (
                            <Card title="Estadísticas del Período">
                                <div className="statistics-grid">
                                    <div className="statistic-item">
                                        <h4>Generación Renovable Media</h4>
                                        <p className="statistic-value">{statistics.renewableMean.toFixed(2)} MWh</p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Demanda Media</h4>
                                        <p className="statistic-value">{statistics.demandMean.toFixed(2)} MWh</p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Balance Importación/Exportación</h4>
                                        <p className="statistic-value">{statistics.importExportBalance.toFixed(2)} MWh</p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Demanda Máxima</h4>
                                        <p className="statistic-value">{statistics.maxDemand.toFixed(2)} MWh</p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Demanda Mínima</h4>
                                        <p className="statistic-value">{statistics.minDemand.toFixed(2)} MWh</p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Porcentaje Renovable</h4>
                                        <p className="statistic-value">{renewablePercentage.toFixed(2)}%</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </>
                );

            case 'generation':
                return (
                    <>
                        <Card title="Distribución de Generación Eléctrica">
                            <GenerationDistributionChart data={data} loading={loading} />
                        </Card>

                        <Card title="Evolución de Generación por Tipo">
                            <div className="info-box">
                                <p>
                                    <strong>Período analizado:</strong> {format(startDate, 'dd/MM/yyyy', { locale: es })} al {format(endDate, 'dd/MM/yyyy', { locale: es })}
                                </p>
                                <p>
                                    <strong>Porcentaje renovable medio:</strong> {renewablePercentage.toFixed(2)}%
                                </p>
                            </div>

                            {/* Aquí iría un gráfico adicional de evolución de generación por tipo */}
                            <div className="chart-placeholder">
                                <p>Gráfico de evolución temporal de generación por tecnología</p>
                            </div>
                        </Card>
                    </>
                );

            case 'demand':
                return (
                    <>
                        <Card title="Tendencia de Demanda Eléctrica">
                            <DemandTrendChart data={data} loading={loading} chartType={chartType} />
                        </Card>

                        <Card title="Análisis de Demanda">
                            <div className="info-box">
                                <p>
                                    <strong>Demanda media:</strong> {statistics?.demandMean.toFixed(2)} MWh
                                </p>
                                <p>
                                    <strong>Demanda máxima:</strong> {statistics?.maxDemand.toFixed(2)} MWh
                                </p>
                                <p>
                                    <strong>Demanda mínima:</strong> {statistics?.minDemand.toFixed(2)} MWh
                                </p>
                            </div>

                            {/* Aquí iría un gráfico o tabla adicional sobre la demanda */}
                            <div className="chart-placeholder">
                                <p>Gráfico de distribución horaria de demanda</p>
                            </div>
                        </Card>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="historical-data">
            <div className="page-header">
                <h1>Datos Históricos del Balance Eléctrico</h1>
                <p className="page-description">
                    Explora y analiza los datos históricos del balance eléctrico español en diferentes períodos de tiempo.
                </p>
            </div>

            <Card>
                <div className="filter-controls">
                    <div className="date-controls">
                        <h3>Selecciona el período</h3>
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={handleStartDateChange}
                            onEndDateChange={handleEndDateChange}
                        />

                        <div className="preset-ranges">
                            {DATE_RANGES.map((range) => (
                                <Button
                                    key={range.days}
                                    variant="secondary"
                                    onClick={() => handlePresetRange(range.days)}
                                >
                                    {range.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="time-trunc-control">
                        <h3>Agrupación temporal</h3>
                        <select
                            id="time-trunc"
                            value={timeTrunc}
                            onChange={handleTimeTruncChange}
                            className="select-input"
                        >
                            {TIME_TRUNC_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="chart-type-control">
                        <h3>Tipo de gráfico</h3>
                        <select
                            id="chart-type"
                            value={chartType}
                            onChange={handleChartTypeChange}
                            className="select-input"
                        >
                            {CHART_DISPLAY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="filter-actions">
                    <Button
                        onClick={handleExportData}
                        disabled={loading || !data || data.length === 0 || isExporting}
                    >
                        {isExporting ? 'Exportando...' : 'Exportar a CSV'}
                    </Button>
                </div>
            </Card>

            <div className="content-tabs">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => handleTabChange('overview')}
                    >
                        Vista General
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'generation' ? 'active' : ''}`}
                        onClick={() => handleTabChange('generation')}
                    >
                        Generación
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'demand' ? 'active' : ''}`}
                        onClick={() => handleTabChange('demand')}
                    >
                        Demanda
                    </button>
                </div>

                <div className="tab-content">
                    {renderTabContent()}
                </div>
            </div>

            <div className="data-source-note">
                <p>
                    <strong>Fuente de datos:</strong> API de Red Eléctrica de España (REE) -
                    <a
                        href="https://apidatos.ree.es/es/datos/balance/balance-electrico"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://apidatos.ree.es/es/datos/balance/balance-electrico
                    </a>
                </p>
            </div>
        </div>
    );
};

export default HistoricalData;
