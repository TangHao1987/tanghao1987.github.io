import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';

const App: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash);

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    
    const renderPage = () => {
        const path = route.split('/');
        
        if (path[1] === 'blog') {
            const slug = path[2]; // Will be undefined for the main blog page, which is correct
            return <Home slug={slug} />;
        }
        return <Home />;
    };
    
    const currentPage = route.startsWith('#/blog') ? 'blog' : 'home';

    return (
        <>
            <NavBar currentPage={currentPage} />
            <main>
                {renderPage()}
            </main>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
