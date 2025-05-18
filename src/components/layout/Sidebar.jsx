import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/latest"
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Ultimo Balance
                    </NavLink>
                    <NavLink
                        to="/historical"
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Datos históricos
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                        onClick={() => setIsOpen(false)}
                    >
                        Acerca de
                    </NavLink>
                </nav>
            </aside>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? 'X' : '☰'}
            </button>
        </>
    );
};

export default Sidebar;
