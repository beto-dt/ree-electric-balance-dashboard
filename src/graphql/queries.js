import { gql } from '@apollo/client';

// Consulta para obtener el balance eléctrico por rango de fechas (con paginación)
export const GET_BALANCE_BY_DATE_RANGE = gql`
    query GetElectricBalanceByDateRange(
        $startDate: DateTime!,
        $endDate: DateTime!,
        $timeScope: String!,
        $page: Int,
        $pageSize: Int,
        $orderBy: String,
        $orderDirection: String
    ) {
        electricBalanceByDateRange(
            dateRange: {
                startDate: $startDate,
                endDate: $endDate,
                timeScope: $timeScope
            },
            pagination: {
                page: $page,
                pageSize: $pageSize,
                orderBy: $orderBy,
                orderDirection: $orderDirection
            }
        ) {
            items {
                id
                timestamp
                totalGeneration
                totalDemand
                renewablePercentage
                balance
            }
            totalCount
            page
            pageSize
            hasNextPage
            hasPreviousPage
        }
    }
`;

// Consulta para obtener estadísticas del balance eléctrico
export const GET_BALANCE_STATISTICS = gql`
    query GetElectricBalanceStats($startDate: DateTime!, $endDate: DateTime!, $timeScope: String!) {
        electricBalanceStats(
            dateRange: {
                startDate: $startDate,
                endDate: $endDate,
                timeScope: $timeScope
            }
        ) {
            generation {
                average
                max
                min
            }
            demand {
                average
                max
                min
            }
            renewablePercentage {
                average
                max
                min
            }
            count
            startDate
            endDate
            timeScope
        }
    }
`;

// Consulta para obtener la distribución de generación por tipo
export const GET_GENERATION_DISTRIBUTION = gql`
    query GetGenerationDistribution($startDate: DateTime!, $endDate: DateTime!, $timeScope: String!) {
        generationDistribution(
            dateRange: {
                startDate: $startDate,
                endDate: $endDate,
                timeScope: $timeScope
            }
        ) {
            type
            totalValue
            avgValue
            maxValue
            minValue
            percentage
            color
            count
        }
    }
`;

// Consulta para obtener series temporales de un indicador específico
export const GET_BALANCE_TIME_SERIES = gql`
    query GetElectricBalanceTimeSeries(
        $startDate: DateTime!,
        $endDate: DateTime!,
        $timeScope: String!,
        $indicator: String!
    ) {
        electricBalanceTimeSeries(
            dateRange: {
                startDate: $startDate,
                endDate: $endDate,
                timeScope: $timeScope
            },
            indicator: $indicator
        ) {
            timestamp
            value
        }
    }
`;

// Consulta para obtener el último balance eléctrico
export const GET_LATEST_BALANCE = gql`
    query GetLatestElectricBalance {
        latestElectricBalance {
            id
            timestamp
            timeScope
            totalGeneration
            totalDemand
            renewablePercentage
            balance
            generation {
                type
                value
                percentage
                color
            }
            demand {
                type
                value
                percentage
            }
        }
    }
`;

// Consulta para obtener un balance eléctrico específico por ID
export const GET_BALANCE_BY_ID = gql`
    query GetElectricBalanceById($id: ID!) {
        electricBalance(id: $id) {
            id
            timestamp
            timeScope
            totalGeneration
            totalDemand
            renewablePercentage
            balance
            generation {
                type
                value
                percentage
                color
            }
        }
    }
`;

// Consulta para comparar dos períodos de balance eléctrico
export const COMPARE_BALANCE_PERIODS = gql`
    query CompareElectricBalancePeriods(
        $currentStartDate: DateTime!,
        $currentEndDate: DateTime!,
        $previousStartDate: DateTime!,
        $previousEndDate: DateTime!,
        $timeScope: String!
    ) {
        compareElectricBalancePeriods(
            periods: {
                currentStartDate: $currentStartDate,
                currentEndDate: $currentEndDate,
                previousStartDate: $previousStartDate,
                previousEndDate: $previousEndDate,
                timeScope: $timeScope
            }
        )
    }
`;

// Consulta para un análisis completo del balance eléctrico
export const GET_BALANCE_ANALYSIS = gql`
    query GetElectricBalanceAnalysis(
        $startDate: DateTime!,
        $endDate: DateTime!,
        $timeScope: String!,
        $includePatterns: Boolean,
        $includeSustainability: Boolean
    ) {
        electricBalanceAnalysis(
            dateRange: {
                startDate: $startDate,
                endDate: $endDate,
                timeScope: $timeScope
            },
            options: {
                includePatterns: $includePatterns,
                includeSustainability: $includeSustainability
            }
        ) {
            stats {
                generation {
                    average
                    max
                    min
                }
                demand {
                    average
                    max
                    min
                }
                renewablePercentage {
                    average
                    max
                    min
                }
                count
            }
            generationDistribution {
                type
                totalValue
                percentage
                color
            }
            generationSeries {
                timestamp
                value
            }
            demandSeries {
                timestamp
                value
            }
            renewableSeries {
                timestamp
                value
            }
            balanceSeries {
                timestamp
                value
            }
            trends
        }
    }
`;
