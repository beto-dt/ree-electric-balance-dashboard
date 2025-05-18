import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState(new Date());
    const [timeTrunc, setTimeTrunc] = useState('day');
    const [chartType, setChartType] = useState('line');
    const [activeTab, setActiveTab] = useState('overview');
    const [isExporting, setIsExporting] = useState(false);

    const formattedStartDate = useMemo(() => {
        return isValid(startDate)
            ? startDate.toISOString()
            : null;
    }, [startDate]);

    const formattedEndDate = useMemo(() => {
        return isValid(endDate)
            ? endDate.toISOString()
            : null;
    }, [endDate]);

    const {
        loading,
        data,
        error,
        retry,
        statistics: apiStatistics,
        generationDistribution
    } = useElectricBalance(
        formattedStartDate,
        formattedEndDate,
        timeTrunc
    );


    const statistics = useMemo(() => {
        if (apiStatistics) return apiStatistics;
        return data && data.length > 0 ? calculateStatistics(data) : null;
    }, [data, apiStatistics]);

    const renewablePercentage = useMemo(() => {
        if (statistics?.renewablePercentage?.average) {
            return statistics.renewablePercentage.average;
        }
        return data && data.length > 0 ? calculateRenewablePercentage(data) : 0;
    }, [data, statistics]);

    const handleStartDateChange = useCallback((date) => {
        if (date && isValid(date)) {
            setStartDate(date);
        }
    }, []);

    const handleEndDateChange = useCallback((date) => {
        if (date && isValid(date)) {
            setEndDate(date);
        }
    }, []);

    const handleTimeTruncChange = useCallback((e) => {
        setTimeTrunc(e.target.value);
    }, []);

    const handlePresetRange = useCallback((days) => {
        if (!days || isNaN(days) || days <= 0) return;

        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        setStartDate(start);
        setEndDate(end);
    }, []);

    const handleChartTypeChange = useCallback((e) => {
        setChartType(e.target.value);
    }, []);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

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

        if (!data || !Array.isArray(data) || data.length === 0) {
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
                            <BalanceChart
                                data={data}
                                loading={loading}
                                chartType={chartType}
                            />
                        </Card>

                        {statistics && (
                            <Card title="Estadísticas del Período">
                                <div className="statistics-grid">
                                    <div className="statistic-item">
                                        <h4>Generación Renovable Media</h4>
                                        <p className="statistic-value">
                                            {(statistics.generation?.average || statistics.renewableMean || 0).toFixed(2)} MWh
                                        </p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Demanda Media</h4>
                                        <p className="statistic-value">
                                            {(statistics.demand?.average || statistics.demandMean || 0).toFixed(2)} MWh
                                        </p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Balance Importación/Exportación</h4>
                                        <p className="statistic-value">
                                            {(statistics.importExportBalance || 0).toFixed(2)} MWh
                                        </p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Demanda Máxima</h4>
                                        <p className="statistic-value">
                                            {(statistics.demand?.max || statistics.maxDemand || 0).toFixed(2)} MWh
                                        </p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Demanda Mínima</h4>
                                        <p className="statistic-value">
                                            {(statistics.demand?.min || statistics.minDemand || 0).toFixed(2)} MWh
                                        </p>
                                    </div>
                                    <div className="statistic-item">
                                        <h4>Porcentaje Renovable</h4>
                                        <p className="statistic-value">
                                            {renewablePercentage.toFixed(2)}%
                                        </p>
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
                            <GenerationDistributionChart
                                data={data}
                                generationDistribution={generationDistribution}
                                loading={loading}
                            />
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
                            <DemandTrendChart
                                data={data}
                                loading={loading}
                                chartType={chartType}
                            />
                        </Card>

                        <Card title="Análisis de Demanda">
                            <div className="info-box">
                                <p>
                                    <strong>Demanda media:</strong> {
                                    (statistics?.demand?.average ||
                                        statistics?.demandMean || 0).toFixed(2)
                                } MWh
                                </p>
                                <p>
                                    <strong>Demanda máxima:</strong> {
                                    (statistics?.demand?.max ||
                                        statistics?.maxDemand || 0).toFixed(2)
                                } MWh
                                </p>
                                <p>
                                    <strong>Demanda mínima:</strong> {
                                    (statistics?.demand?.min ||
                                        statistics?.minDemand || 0).toFixed(2)
                                } MWh
                                </p>
                            </div>

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
                            {Array.isArray(DATE_RANGES) && DATE_RANGES.map((range) => (
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
                            {Array.isArray(TIME_TRUNC_OPTIONS) && TIME_TRUNC_OPTIONS.map((option) => (
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
                            {Array.isArray(CHART_DISPLAY_OPTIONS) && CHART_DISPLAY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="content-tabs">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => handleTabChange('overview')}
                        type="button"
                    >
                        Vista General
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'generation' ? 'active' : ''}`}
                        onClick={() => handleTabChange('generation')}
                        type="button"
                    >
                        Generación
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'demand' ? 'active' : ''}`}
                        onClick={() => handleTabChange('demand')}
                        type="button"
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
                    <strong>Fuente de datos:</strong> API de Red Eléctrica de España (REE) - {' '}
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
