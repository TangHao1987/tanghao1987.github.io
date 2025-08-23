import React from 'react';
import { posts, Post } from '../blog/_posts';

// Image loading effect
const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.classList.add('loaded');
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
}

export const Home: React.FC<HomeProps> = ({ slug }) => {
    if (slug) {
        return <BlogPostView slug={slug} />;
    } else {
        return <HomeAndBlogView />;
    }
};

const HomeAndBlogView: React.FC = () => {
    // User can change these details
    const userName = "Tang Hao's Tech Blog";
    const userBio = "Welcome to my corner of the internet! I'm a software engineer, with a passion for all technologies. This is a bilingual tech blog where I share my thoughts, learnings, and everything in between.";
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
                    {posts.map((postItem, index) => (
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
                        <div className="blog-list-single-column">
                            {posts.map((post, index) => (
                                <div 
                                    key={post.slug} 
                                    id={`post-${post.slug}`} 
                                    className="post-container animate-scale-in"
                                    style={{
                                        animationDelay: `${index * .2}s`,
                                        animation: 'scaleIn 0.6s ease-out forwards',
                                        opacity: 0
                                    }}
                                >
                                    <a 
                                        href={`#/blog/${post.slug}`} 
                                        className="post-card-single"
                                        aria-label={`Read blog post: ${post.title}`}
                                        role="article"
                                        tabIndex={0}
                                    >
                                        <img 
                                            src={post.bannerImagePath} 
                                            alt={`Banner image for ${post.title}`}
                                            className="post-card-banner" 
                                            onLoad={handleImageLoad}
                                        />
                                        <div className="post-card-content">
                                            <h3>{post.title}</h3>
                                            <p>{post.shortDescription}</p>
                                            <div className="post-meta">
                                                <span className="latest-update" aria-label={`Last updated: ${post.latestUpdate}`}>
                                                    Latest update: {post.latestUpdate}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

const BlogPostView: React.FC<{ slug: string }> = ({ slug }) => {
    const [post, setPost] = React.useState<Post | undefined>(undefined);
    const [content, setContent] = React.useState<React.ReactNode | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const currentPost = posts.find(p => p.slug === slug);
        if (!currentPost) {
            setError('Post not found.');
            setLoading(false);
            return;
        }
        
        setPost(currentPost);
        setLoading(true);
        setError(null);
        
        fetch(currentPost.markdownPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load post content: ${response.statusText}`);
                }
                return response.text();
            })
            .then(text => {
                setContent(parseMarkdown(text));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    }, [slug]);

    if (loading) return (
        <div className="container">
            <div className="loading"></div>
        </div>
    );
    if (error) return <div className="container error">{error}</div>;
    if (!post) return null;

    return (
        <div className="container">
            <article className="post-view animate-scale-in">
                <h1>{post.title}</h1>
                <div className="post-meta-header">
                    <span className="latest-update">Latest update: {post.latestUpdate}</span>
                </div>
                <img 
                    src={post.bannerImagePath} 
                    alt="" 
                    className="post-banner" 
                    onLoad={handleImageLoad}
                />
                <div className="post-content">
                    {content}
                </div>
            </article>
        </div>
    );
};
