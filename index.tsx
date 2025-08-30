import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';

const App: React.FC = () => {
    const [route, setRoute] = useState(window.location.hash);
    const [urlParams, setUrlParams] = useState(new URLSearchParams(window.location.search));

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        
        const handleUrlChange = () => {
            setUrlParams(new URLSearchParams(window.location.search));
        };
        
        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleUrlChange);
        
        // Override history methods to catch programmatic changes
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
        
        window.history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleUrlChange();
        };
        
        window.history.replaceState = function(...args) {
            originalReplaceState.apply(this, args);
            handleUrlChange();
        };
        
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleUrlChange);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);
    
    const renderPage = () => {
        const path = route.split('/');
        
        // Parse language parameter from URL
        const lang = urlParams.get('lang');
        
        if (path[1] === 'blog') {
            const slug = path[2]; // Will be undefined for the main blog page, which is correct
            return <Home slug={slug} lang={lang || undefined} />;
        }
        return <Home lang={lang || undefined} />;
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
