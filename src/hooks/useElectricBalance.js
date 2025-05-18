import { useQuery } from '@apollo/client';
import { useState } from 'react';
import {
    GET_BALANCE_BY_DATE_RANGE,
    GET_BALANCE_STATISTICS,
    GET_BALANCE_TIME_SERIES
} from '../graphql/queries';

/**
 * Hook personalizado para obtener los datos del balance eléctrico
 * @param {String} startDate - Fecha de inicio en formato ISO para GraphQL DateTime
 * @param {String} endDate - Fecha de fin en formato ISO para GraphQL DateTime
 * @param {String} timeScope - Granularidad temporal (hour, day, month, year)
 * @param {Object} paginationOptions - Opciones de paginación
 * @returns {Object} - Objeto con los datos, estado de carga, error y funciones de control
 */
export const useElectricBalance = (
    startDate,
    endDate,
    timeScope = 'day',
    paginationOptions = { page: 1, pageSize: 50, orderBy: 'timestamp', orderDirection: 'DESC' }
) => {
    const [error, setError] = useState(null);

    const {
        loading: balanceLoading,
        data: balanceData,
        refetch: refetchBalance,
        error: balanceError
    } = useQuery(GET_BALANCE_BY_DATE_RANGE, {
        variables: {
            startDate,
            endDate,
            timeScope,
            ...paginationOptions
        },
        onError: (err) => {
            console.error('Error al obtener datos del balance eléctrico:', err);
            setError(err.message);
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        skip: !startDate || !endDate
    });

    const {
        loading: statsLoading,
        data: statsData,
        refetch: refetchStats,
        error: statsError
    } = useQuery(GET_BALANCE_STATISTICS, {
        variables: {
            startDate,
            endDate,
            timeScope
        },
        onError: (err) => {
            console.error('Error al obtener estadísticas:', err);
            if (!balanceError) {
                setError(err.message);
            }
        },
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: true,
        skip: !startDate || !endDate
    });

    const {
        loading: generationSeriesLoading,
        data: generationSeriesData,
        refetch: refetchGenerationSeries
    } = useQuery(GET_BALANCE_TIME_SERIES, {
        variables: {
            startDate,
            endDate,
            timeScope,
            indicator: 'totalGeneration'
        },
        fetchPolicy: 'network-only',
        skip: !startDate || !endDate
    });

    const {
        loading: demandSeriesLoading,
        data: demandSeriesData,
        refetch: refetchDemandSeries
    } = useQuery(GET_BALANCE_TIME_SERIES, {
        variables: {
            startDate,
            endDate,
            timeScope,
            indicator: 'totalDemand'
        },
        fetchPolicy: 'network-only',
        skip: !startDate || !endDate
    });

    const {
        loading: renewableSeriesLoading,
        data: renewableSeriesData,
        refetch: refetchRenewableSeries
    } = useQuery(GET_BALANCE_TIME_SERIES, {
        variables: {
            startDate,
            endDate,
            timeScope,
            indicator: 'renewablePercentage'
        },
        fetchPolicy: 'network-only',
        skip: !startDate || !endDate
    });

    const loading = balanceLoading || statsLoading ||
        generationSeriesLoading || demandSeriesLoading ||
        renewableSeriesLoading;

    const retry = () => {
        setError(null);
        refetchBalance();
        refetchStats();
        refetchGenerationSeries();
        refetchDemandSeries();
        refetchRenewableSeries();
    };

    const processedData = balanceData?.electricBalanceByDateRange?.items?.map(item => {
        const generationDistribution = Array.isArray(item.generation)
            ? item.generation
            : [];

        return {
            id: item.id,
            date: item.timestamp,
            generation: {
                total: item.totalGeneration,
                renewable: item.totalGeneration * (item.renewablePercentage / 100),
                nonRenewable: item.totalGeneration * (1 - item.renewablePercentage / 100),
                distribution: generationDistribution
            },
            demand: {
                total: item.totalDemand,
                peak: statsData?.electricBalanceStats?.demand?.max || null,
                valley: statsData?.electricBalanceStats?.demand?.min || null
            },
            interchange: {
                balance: item.balance || 0,
                import: item.balance > 0 ? item.balance : 0,
                export: item.balance < 0 ? Math.abs(item.balance) : 0
            },
            renewablePercentage: item.renewablePercentage
        };
    }) || [];

    const timeSeries = {
        generation: generationSeriesData?.electricBalanceTimeSeries || [],
        demand: demandSeriesData?.electricBalanceTimeSeries || [],
        renewable: renewableSeriesData?.electricBalanceTimeSeries || []
    };

    const statistics = statsData?.electricBalanceStats ? {
        generation: statsData.electricBalanceStats.generation,
        demand: statsData.electricBalanceStats.demand,
        renewablePercentage: statsData.electricBalanceStats.renewablePercentage,
        count: statsData.electricBalanceStats.count,
        startDate: statsData.electricBalanceStats.startDate,
        endDate: statsData.electricBalanceStats.endDate,
        timeScope: statsData.electricBalanceStats.timeScope
    } : null;

    const pagination = balanceData?.electricBalanceByDateRange ? {
        totalCount: balanceData.electricBalanceByDateRange.totalCount,
        page: balanceData.electricBalanceByDateRange.page,
        pageSize: balanceData.electricBalanceByDateRange.pageSize,
        hasNextPage: balanceData.electricBalanceByDateRange.hasNextPage,
        hasPreviousPage: balanceData.electricBalanceByDateRange.hasPreviousPage
    } : null;

    return {
        loading,
        data: processedData,
        statistics,
        timeSeries,
        pagination,
        error,
        retry,
        refetch: retry
    };
};

export default useElectricBalance;
