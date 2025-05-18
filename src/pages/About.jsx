import Card from '../components/common/Card';

const About = () => {
    return (
        <div className="about-page">
            <h1>Acerca de este proyecto</h1>

            <Card>
                <h2>Balance Eléctrico España</h2>
                <p>
                    Esta aplicación muestra datos del balance eléctrico de España obtenidos
                    a través de la API pública de Red Eléctrica de España (REE).
                </p>
                <p>
                    El objetivo es proporcionar una visualización clara e interactiva de la
                    generación, demanda e intercambios de energía eléctrica en el sistema español.
                </p>
            </Card>

            <Card title="Fuente de datos">
                <p>
                    Los datos son obtenidos directamente de la API pública de REE:
                </p>
                <a
                    href="https://apidatos.ree.es/es/datos/balance/balance-electrico"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="api-link"
                >
                    https://apidatos.ree.es/es/datos/balance/balance-electrico
                </a>
                <p>
                    Esta API proporciona información detallada sobre la generación eléctrica
                    por tecnologías, la demanda y los intercambios internacionales de energía.
                </p>
            </Card>

            <Card title="Tecnologías utilizadas">
                <div className="technologies-grid">
                    <div className="technology-item">
                        <h3>Frontend</h3>
                        <ul>
                            <li>React</li>
                            <li>Apollo Client (GraphQL)</li>
                            <li>Recharts</li>
                            <li>React Router</li>
                            <li>Date-fns</li>
                        </ul>
                    </div>

                    <div className="technology-item">
                        <h3>Backend</h3>
                        <ul>
                            <li>Node.js</li>
                            <li>Express</li>
                            <li>GraphQL</li>
                            <li>MongoDB</li>
                            <li>Mongoose</li>
                        </ul>
                    </div>

                    <div className="technology-item">
                        <h3>Despliegue</h3>
                        <ul>
                            <li>Docker</li>
                            <li>Docker Compose</li>
                        </ul>
                    </div>
                </div>
            </Card>

            <Card title="Arquitectura">
                <p>
                    El sistema sigue una arquitectura de tres capas:
                </p>
                <ol>
                    <li>
                        <strong>Capa de datos</strong>: MongoDB para almacenar los datos históricos
                        del balance eléctrico obtenidos de la API de REE.
                    </li>
                    <li>
                        <strong>Capa de servicios</strong>: API GraphQL que expone los datos
                        almacenados y proporciona resolvers para consultas específicas.
                    </li>
                    <li>
                        <strong>Capa de presentación</strong>: Frontend en React que consume
                        la API GraphQL y muestra los datos de manera visual e interactiva.
                    </li>
                </ol>
            </Card>
        </div>
    );
};

export default About;
