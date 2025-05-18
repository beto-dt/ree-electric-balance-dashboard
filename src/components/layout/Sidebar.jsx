import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="header-logo">
                <Link to="/">Balance Eléctrico España</Link>
            </div>
            <div className="header-spacer"></div>
            <nav className="header-nav">
                <a
                    href="https://apidatos.ree.es/es/datos/balance/balance-electrico"
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
