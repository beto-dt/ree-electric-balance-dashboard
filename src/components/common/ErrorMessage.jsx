import React, { useState } from 'react';
import Button from './Button';

/**
 * Componente mejorado para mostrar errores con información detallada y opciones para resolverlos
 * @param {Object} props - Propiedades del componente
 * @param {String} props.message - Mensaje principal de error
 * @param {Function} props.onRetry - Función para reintentar la operación
 * @param {Object} props.error - Objeto de error original (opcional)
 * @param {Boolean} props.showDetails - Mostrar detalles técnicos por defecto (opcional)
 */
const ErrorMessage = ({
                          message,
                          onRetry,
                          error,
                          showDetails = false
                      }) => {
    const [detailsVisible, setDetailsVisible] = useState(showDetails);

    // Extraemos detalles adicionales del error si están disponibles
    const hasDetails = error && (error.graphQLErrors || error.networkError || error.stack);

    // Función para alternar la visibilidad de los detalles
    const toggleDetails = () => {
        setDetailsVisible(!detailsVisible);
    };

    // Renderizamos los detalles del error
    const renderErrorDetails = () => {
        if (!error || !detailsVisible) return null;

        return (
            <div className="error-details">
                {error.graphQLErrors && error.graphQLErrors.length > 0 && (
                    <div className="error-section">
                        <h4>Errores GraphQL:</h4>
                        <ul>
                            {error.graphQLErrors.map((err, index) => (
                                <li key={index}>
                                    <p><strong>Mensaje:</strong> {err.message}</p>
                                    {err.path && (
                                        <p><strong>Ruta:</strong> {err.path.join('.')}</p>
                                    )}
                                    {err.extensions && err.extensions.code && (
                                        <p><strong>Código:</strong> {err.extensions.code}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {error.networkError && (
                    <div className="error-section">
                        <h4>Error de Red:</h4>
                        <p>{error.networkError.message}</p>
                        {error.networkError.statusCode && (
                            <p><strong>Código de Estado:</strong> {error.networkError.statusCode}</p>
                        )}
                    </div>
                )}

                {error.stack && (
                    <div className="error-section">
                        <h4>Stack Trace:</h4>
                        <pre className="error-stack">{error.stack}</pre>
                    </div>
                )}

                <div className="error-tips">
                    <h4>Posibles soluciones:</h4>
                    <ul>
                        <li>Verificar que el backend esté funcionando correctamente</li>
                        <li>Comprobar la conexión a internet</li>
                        <li>Verificar los parámetros de la consulta (fechas, formato, etc.)</li>
                        <li>Consultar la documentación del API para más información</li>
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
                <div className="error-header">
                    <h3 className="error-title">Error</h3>
                    <p className="error-text">{message}</p>
                </div>

                <div className="error-actions">
                    {onRetry && (
                        <Button onClick={onRetry} className="retry-button">
                            Reintentar
                        </Button>
                    )}

                    {hasDetails && (
                        <Button
                            onClick={toggleDetails}
                            variant="secondary"
                            className="details-button"
                        >
                            {detailsVisible ? 'Ocultar detalles' : 'Mostrar detalles'}
                        </Button>
                    )}
                </div>

                {renderErrorDetails()}
            </div>
        </div>
    );
};

export default ErrorMessage;
