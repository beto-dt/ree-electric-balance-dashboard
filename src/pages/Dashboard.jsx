import { useState, useMemo } from 'react';
import {  subMonths } from 'date-fns';
import { useElectricBalance } from '../hooks/useElectricBalance';
import DateRangePicker from '../components/common/DateRangePicker';
import BalanceChart from '../components/charts/BalanceChart';
import GenerationDistributionChart from '../components/charts/GenerationDistributionChart';
import DemandTrendChart from '../components/charts/DemandTrendChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { TIME_TRUNC_OPTIONS, CHART_DISPLAY_OPTIONS } from '../config/constants';

const Dashboard = () => {
    const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
    const [endDate, setEndDate] = useState(new Date());
    const [timeScope, setTimeScope] = useState('day');
    const [chartType, setChartType] = useState('line');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);

    const formattedStartDate = useMemo(() => {
        return startDate ? startDate.toISOString() : null;
    }, [startDate]);

    const formattedEndDate = useMemo(() => {
        return endDate ? endDate.toISOString() : null;
    }, [endDate]);

    const paginationOptions = useMemo(() => ({
        page: currentPage,
        pageSize: itemsPerPage,
        orderBy: "timestamp",
        orderDirection: "DESC"
    }), [currentPage, itemsPerPage]);

    const {
        loading,
        data,
        statistics,
        timeSeries,
        pagination,
        error,
        retry
    } = useElectricBalance(
        formattedStartDate,
        formattedEndDate,
        timeScope,
        paginationOptions
    );

    const showPagination = pagination && pagination.totalCount > pagination.pageSize;

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setCurrentPage(1);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setCurrentPage(1);
    };

    const handleTimeScopeChange = (e) => {
        setTimeScope(e.target.value);
        setCurrentPage(1);
    };

    const handleChartTypeChange = (e) => {
        setChartType(e.target.value);
    };

    const handleNextPage = () => {
        if (pagination && pagination.hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (pagination && pagination.hasPreviousPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleLastWeek = () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1);
    };

    const handleLastMonth = () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 1);
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1);
    };

    const handleLastThreeMonths = () => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - 3);
        setStartDate(start);
        setEndDate(end);
        setCurrentPage(1);
    };

    const renderStatistics = () => {
        if (!statistics) return null;

        return (
            <Card title="Estadísticas del Período">
                <div className="statistics-grid">
                    <div className="statistic-item">
                        <h4>Generación Media</h4>
                        <p className="statistic-value">
                            {statistics.generation.average.toFixed(2)} MWh
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Generación Máxima</h4>
                        <p className="statistic-value">
                            {statistics.generation.max.toFixed(2)} MWh
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Generación Mínima</h4>
                        <p className="statistic-value">
                            {statistics.generation.min.toFixed(2)} MWh
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Demanda Media</h4>
                        <p className="statistic-value">
                            {statistics.demand.average.toFixed(2)} MWh
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Demanda Máxima</h4>
                        <p className="statistic-value">
                            {statistics.demand.max.toFixed(2)} MWh
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Demanda Mínima</h4>
                        <p className="statistic-value">
                            {statistics.demand.min.toFixed(2)} MWh
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Renovables Media</h4>
                        <p className="statistic-value">
                            {statistics.renewablePercentage.average.toFixed(2)}%
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Renovables Máximo</h4>
                        <p className="statistic-value">
                            {statistics.renewablePercentage.max.toFixed(2)}%
                        </p>
                    </div>
                    <div className="statistic-item">
                        <h4>Renovables Mínimo</h4>
                        <p className="statistic-value">
                            {statistics.renewablePercentage.min.toFixed(2)}%
                        </p>
                    </div>
                </div>
            </Card>
        );
    };

    const renderPagination = () => {
        if (!showPagination) return null;

        return (
            <div className="pagination-controls">
                <div className="pagination-info">
                    Mostrando {(pagination.page - 1) * pagination.pageSize + 1} - {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} de {pagination.totalCount} registros
                </div>
                <div className="pagination-buttons">
                    <Button
                        onClick={handlePrevPage}
                        disabled={!pagination.hasPreviousPage}
                        variant="secondary"
                    >
                        Anterior
                    </Button>
                    <span className="pagination-page">Página {pagination.page}</span>
                    <Button
                        onClick={handleNextPage}
                        disabled={!pagination.hasNextPage}
                        variant="secondary"
                    >
                        Siguiente
                    </Button>
                </div>
                <div className="pagination-size">
                    <label htmlFor="items-per-page">Elementos por página:</label>
                    <select
                        id="items-per-page"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="select-input"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard">
            <h1>Dashboard de Balance Eléctrico</h1>

            <Card>
                <div className="dashboard-controls">
                    <div className="date-filter">
                        <h3>Rango de Fechas</h3>
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onStartDateChange={handleStartDateChange}
                            onEndDateChange={handleEndDateChange}
                        />

                        <div className="date-presets">
                            <Button variant="secondary" onClick={handleLastWeek}>
                                Última Semana
                            </Button>
                            <Button variant="secondary" onClick={handleLastMonth}>
                                Último Mes
                            </Button>
                            <Button variant="secondary" onClick={handleLastThreeMonths}>
                                Últimos 3 Meses
                            </Button>
                        </div>
                    </div>

                    <div className="filter-options">
                        <div className="filter-group">
                            <label htmlFor="time-scope">Agrupación temporal:</label>
                            <select
                                id="time-scope"
                                value={timeScope}
                                onChange={handleTimeScopeChange}
                                className="select-input"
                            >
                                {TIME_TRUNC_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="chart-type">Tipo de gráfico:</label>
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
                </div>
            </Card>

            {loading && <LoadingSpinner />}

            {error && (
                <ErrorMessage
                    message={`Error al cargar los datos: ${error}`}
                    onRetry={retry}
                />
            )}

            {!loading && !error && data && (
                <>
                    <Card title="Balance Eléctrico">
                        <BalanceChart
                            data={data}
                            loading={loading}
                            chartType={chartType}
                            timeSeries={timeSeries}
                        />
                    </Card>

                    {renderPagination()}

                    <div className="dashboard-charts">
                        <Card title="Distribución de Generación">
                            <GenerationDistributionChart
                                data={data}
                                loading={loading}
                                chartType={chartType}
                                startDate={formattedStartDate}
                                endDate={formattedEndDate}
                                timeScope={timeScope}
                            />
                        </Card>

                        <Card title="Tendencia de Demanda">
                            <DemandTrendChart
                                data={data}
                                loading={loading}
                                chartType={chartType}
                                timeSeries={timeSeries?.demand}
                            />
                        </Card>
                    </div>

                    {renderStatistics()}
                </>
            )}

            {!loading && !error && (!data || data.length === 0) && (
                <Card>
                    <div className="no-data-message">
                        <p>No se encontraron datos para el período seleccionado.</p>
                        <p>Intenta cambiar el rango de fechas o la agrupación temporal.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;
