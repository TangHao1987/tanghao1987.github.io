import React from 'react';

interface NavBarProps {
    currentPage: string;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage }) => {
    // A default name, user can change this later
    const userName = "Tang Hao's Tech Blog";
    return (
        <nav>
            <div className="container nav-container">
                <a href="#/" className="nav-brand">{userName}</a>
                {/* Navigation tabs removed since Home and Blog are now combined */}
            </div>
        </nav>
    );
};
