import React from 'react';

interface NavBarProps {
    currentPage: string;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage }) => {
    // Language content for navbar
    const content = {
        en: {
            userName: "TH's Tech Blog"
        },
        zh: {
            userName: "TH的技术博客"
        }
    };
    
    // Theme toggle functionality
    const [isDarkMode, setIsDarkMode] = React.useState(() => {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    // Language toggle functionality - check URL params first
    const [isChineseMode, setIsChineseMode] = React.useState(() => {
        // Check URL for language parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'zh' || urlLang === 'en') {
            return urlLang === 'zh';
        }
        // Fallback to saved preference
        const savedLanguage = localStorage.getItem('language');
        return savedLanguage === 'zh';
    });
    
    // Listen for URL changes to update language state
    React.useEffect(() => {
        const handleUrlChange = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            if (urlLang === 'zh' || urlLang === 'en') {
                setIsChineseMode(urlLang === 'zh');
            }
        };
        
        // Listen for popstate (back/forward navigation)
        window.addEventListener('popstate', handleUrlChange);
        
        // Listen for hash changes
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
            window.removeEventListener('popstate', handleUrlChange);
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);
    
    // Get current language for display
    const currentLang = isChineseMode ? 'zh' : 'en';
    const userName = content[currentLang].userName;
    
    React.useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        // Save preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);
    
    React.useEffect(() => {
        // Apply language to document
        document.documentElement.setAttribute('data-lang', isChineseMode ? 'zh' : 'en');
        // Save preference
        localStorage.setItem('language', isChineseMode ? 'zh' : 'en');
    }, [isChineseMode]);
    
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };
    
    const toggleLanguage = () => {
        const newLang = !isChineseMode ? 'zh' : 'en';
        
        // Update URL with language parameter and trigger navigation
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLang);
        
        // Use pushState to trigger navigation event
        window.history.pushState({}, '', url.toString());
        
        // Update local state
        setIsChineseMode(!isChineseMode);
    };
    
    return (
        <nav>
            <div className="container nav-container">
                <a href="#/" className="nav-brand">{userName}</a>
                {/* Navigation tabs removed since Home and Blog are now combined */}
                
                {/* Right side buttons container */}
                <div className="nav-buttons">
                    {/* Language toggle button */}
                    <button 
                        className="language-toggle"
                        onClick={toggleLanguage}
                        aria-label={`Switch to ${isChineseMode ? 'English' : 'Chinese'} language`}
                    >
                        {isChineseMode ? 'EN' : '中'}
                    </button>
                    
                    {/* Theme toggle button */}
                    <button 
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                        {isDarkMode ? (
                            <i className="fas fa-sun"></i>
                        ) : (
                            <i className="fas fa-moon"></i>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};
