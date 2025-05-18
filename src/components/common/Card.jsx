import React from 'react';

const Card = ({ children, title, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {title && <h2 className="card-title">{title}</h2>}
            {children}
        </div>
    );
};

export default Card;
