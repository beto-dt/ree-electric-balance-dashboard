import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <Link to="/">Balance Eléctrico España - BetoDT</Link>
            </div>
            <div className="header-spacer"></div>
            <nav className="header-nav">
                <a
                    href="https://apidatos.ree.es/es/datos/balance/balance-electrico?start_date=2019-01-01T00:00&end_date=2019-01-31T23:59&time_trunc=day"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-link"
                >
                    API REE
                </a>
            </nav>
        </header>
    );
};

export default Header;
