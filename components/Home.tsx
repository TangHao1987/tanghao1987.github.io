import React from 'react';
import { posts, Post } from '../blog/_posts';

// Image loading effect
const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.classList.add('loaded');
};

// Language content - moved to top level for global access
const content = {
    en: {
        userName: "Tang Hao's Tech Blog",
        userBio: "Welcome to my corner of the internet! I'm a software engineer, with a passion for all technologies. This is a bilingual tech blog where I share my thoughts, learnings, and everything in between.",
        latestUpdate: "Latest update:",
        loading: "Loading...",
        error: "Post not found.",
        readBlogPost: "Read blog post:",
        bannerImage: "Banner image for",
        lastUpdated: "Last updated:"
    },
    zh: {
        userName: "唐浩的技术博客",
        userBio: "欢迎来到我的网络角落！我是一名软件工程师，对技术充满热情。这是一个双语技术博客，我在这里分享我的想法、学习心得以及一切相关的内容。",
        latestUpdate: "最新更新：",
        loading: "加载中...",
        error: "文章未找到。",
        bannerImage: "横幅图片：",
        lastUpdated: "最后更新："
    }
};

// Language context
const LanguageContext = React.createContext('en');

// Language hook
const useLanguage = () => {
    const [lang, setLang] = React.useState(() => {
        return document.documentElement.getAttribute('data-lang') || 'en';
    });

    React.useEffect(() => {
        const handleLanguageChange = () => {
            const newLang = document.documentElement.getAttribute('data-lang') || 'en';
            setLang(newLang);
        };

        // Listen for language changes
        const observer = new MutationObserver(handleLanguageChange);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-lang']
        });

        return () => observer.disconnect();
    }, []);

    return lang;
};

// A simple markdown to JSX parser
const parseMarkdown = (markdown: string): React.ReactNode => {
    const lines = markdown.split('\n');
    const elements: React.ReactElement[] = [];
    let key = 0;
    for (const line of lines) {
        if (line.startsWith('# ')) {
            elements.push(<h1 key={key++}>{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
            elements.push(<h2 key={key++}>{line.substring(3)}</h2>);
        } else if (line.trim() !== '') {
            elements.push(<p key={key++}>{line}</p>);
        }
        // Empty lines are skipped, creating paragraph breaks
    }
    return <>{elements}</>;
};

interface HomeProps {
    slug?: string;
    lang?: string; // Add language parameter
}

export const Home: React.FC<HomeProps> = ({ slug, lang }) => {
    if (slug) {
        return <BlogPostView slug={slug} lang={lang} />;
    } else {
        return <HomeAndBlogView lang={lang} />;
    }
};

const HomeAndBlogView: React.FC<{ lang?: string }> = ({ lang }) => {
    // Use language from URL parameter, fallback to stored preference
    const [currentLang, setCurrentLang] = React.useState(() => {
        if (lang && (lang === 'en' || lang === 'zh')) {
            return lang;
        }
        return document.documentElement.getAttribute('data-lang') || 'en';
    });
    
    // Update document language when component mounts or lang changes
    React.useEffect(() => {
        if (lang && (lang === 'en' || lang === 'zh')) {
            setCurrentLang(lang);
            document.documentElement.setAttribute('data-lang', lang);
            localStorage.setItem('language', lang);
        }
    }, [lang]);
    
    // Filter posts by current language
    const filteredPosts = posts.filter(post => post.language === currentLang);
    
    // User can change these details
    const userName = content[currentLang].userName;
    const userBio = content[currentLang].userBio;
    const profileImageUrl = "/assets/profile.jpg";
    
    // Drawer state
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    
    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className="home-layout">
            {/* Mobile Drawer Toggle */}
            <button 
                className={`drawer-toggle ${isDrawerOpen ? 'open' : ''}`}
                onClick={toggleDrawer}
                aria-label="Toggle navigation menu"
            >
                <div className="hamburger"></div>
            </button>
            
            {/* Drawer Overlay */}
            <div 
                className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
                onClick={closeDrawer}
            ></div>
            
            {/* Sidebar */}
            <aside className={`blog-sidebar ${isDrawerOpen ? 'open' : ''}`}>         
                {/* Profile Section */}
                <div className="sidebar-profile">
                    <img 
                        src={profileImageUrl} 
                        alt={userName} 
                        className="sidebar-profile-img"
                        onLoad={handleImageLoad}
                    />
                    <h3 className="sidebar-profile-name"></h3>
                    <p className="sidebar-profile-bio">{userBio}</p>
                </div>
                
                <div className="sidebar-header">
                    <h3></h3>
                </div>
                <div className="sidebar-content">
                    {filteredPosts.map((postItem, index) => (
                        <span 
                            key={postItem.slug} 
                            className="sidebar-item"
                            style={{ 
                                cursor: 'pointer',
                                animationDelay: `${index * 0.1}s`,
                                animation: 'slideInFromBottom 0.6s ease-out forwards',
                                opacity: 0
                            }}
                            onClick={() => {
                                const element = document.getElementById(`post-${postItem.slug}`);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                                // Close drawer on mobile after clicking
                                if (window.innerWidth <= 768) {
                                    closeDrawer();
                                }
                            }}
                        >
                            <div className="sidebar-item-title">{postItem.title}</div>
                            <div className="sidebar-item-date">{postItem.latestUpdate}</div>
                        </span>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="home-main animate-slide-right">
                <div className="container">
                    {/* Blog Section */}
                    <section className="blog-section">
                        {filteredPosts.length === 0 ? (
                            <div className="no-posts-message">
                                <h3>{currentLang === 'zh' ? '暂无博客文章' : 'No blog posts available'}</h3>
                                <p>{currentLang === 'zh' ? '当前语言下还没有博客文章。' : 'No blog posts are available in the current language.'}</p>
                            </div>
                        ) : (
                            <div className="blog-list-single-column">
                                {filteredPosts.map((post, index) => (
                                    <div 
                                        key={`${post.slug}-${currentLang}`} // Force re-render on language change
                                        id={`post-${post.slug}`} 
                                        className="post-container animate-scale-in"
                                        style={{
                                            animationDelay: `${index * 0.2}s`,
                                            animation: 'scaleIn 0.6s ease-out forwards',
                                            opacity: 0
                                        }}
                                    >
                                        <a 
                                            href={`#/blog/${post.slug}`} 
                                            className="post-card-single"
                                            aria-label={`${content[currentLang].readBlogPost} ${post.title}`}
                                            role="article"
                                            tabIndex={0}
                                        >
                                            <img 
                                                src={post.bannerImagePath} 
                                                alt={`${content[currentLang].bannerImage} ${post.title}`}
                                                className="post-card-banner" 
                                                onLoad={handleImageLoad}
                                            />
                                            <div className="post-card-content">
                                                <h3>{post.title}</h3>
                                                <p>{post.shortDescription}</p>
                                                <div className="post-meta">
                                                    <span className="latest-update" aria-label={`${content[currentLang].lastUpdated} ${post.latestUpdate}`}>
                                                        {content[currentLang].latestUpdate} {post.latestUpdate}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

const BlogPostView: React.FC<{ slug: string; lang?: string }> = ({ slug, lang }) => {
    const [post, setPost] = React.useState<Post | undefined>(undefined);
    const [postContent, setPostContent] = React.useState<React.ReactNode | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    
    // Use language from URL parameter or post language
    const [currentLang, setCurrentLang] = React.useState(() => {
        if (lang && (lang === 'en' || lang === 'zh')) {
            return lang;
        }
        return document.documentElement.getAttribute('data-lang') || 'en';
    });

    React.useEffect(() => {
        // Find the post by slug
        const foundPost = posts.find(p => p.slug === slug);
        if (!foundPost) {
            setError(content[currentLang].error);
            setLoading(false);
            return;
        }
        
        // Set the post and update language to match post language
        setPost(foundPost);
        setCurrentLang(foundPost.language);
        
        // Update document language to match post
        document.documentElement.setAttribute('data-lang', foundPost.language);
        localStorage.setItem('language', foundPost.language);
        
        setLoading(true);
        setError(null);
        
        fetch(foundPost.markdownPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load post content: ${response.statusText}`);
                }
                return response.text();
            })
            .then(text => {
                setPostContent(parseMarkdown(text));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    }, [slug, lang]);

    if (loading) return (
        <div className="container">
            <div className="loading">{content[currentLang].loading}</div>
        </div>
    );
    if (error) return (
        <div className="container">
            <div className="error">
                <p>{error}</p>
            </div>
        </div>
    );
    if (!post) return null;

    return (
        <div className="container">
            <article className="post-view animate-scale-in">
                <h1>{post.title}</h1>
                <div className="post-meta-header">
                    <span className="latest-update">{content[currentLang].latestUpdate} {post.latestUpdate}</span>
                </div>
                <img 
                    src={post.bannerImagePath} 
                    alt="" 
                    className="post-banner" 
                    onLoad={handleImageLoad}
                />
                <div className="post-content">
                    {postContent}
                </div>
            </article>
        </div>
    );
};
