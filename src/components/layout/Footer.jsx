import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>© {currentYear} Balance Eléctrico España. Datos proporcionados por Red Eléctrica de España (REE). Luis Alberto De La Torre</p>
            </div>
        </footer>
    );
};

export default Footer;
