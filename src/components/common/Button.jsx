import React from 'react';

const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'primary',
                    className = '',
                    disabled = false,
                    ...props
                }) => {
    const baseClass = 'button';
    const variantClass = variant !== 'primary' ? `button-${variant}` : '';
    const buttonClass = `${baseClass} ${variantClass} ${className}`.trim();

    return (
        <button
            type={type}
            className={buttonClass}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
