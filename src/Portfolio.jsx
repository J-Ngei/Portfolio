import React, { useState, useEffect } from 'react';
import { MapPin, Code, Brain, User, FileText, Mail, ChevronRight, ChevronLeft, ExternalLink, Github, Linkedin, X, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import ProjectViewer from './components/ProjectViewer';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import { PortableText } from '@portabletext/react';

// Sanity client configuration
const SANITY_CONFIG = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: import.meta.env.VITE_SANITY_USE_CDN !== 'false',
};

console.log('Sanity Config:', SANITY_CONFIG);

const sanityClient = {
  fetch: async (query) => {
    if (!SANITY_CONFIG.projectId || SANITY_CONFIG.projectId === 'your-project-id') {
      console.error('Sanity project ID is not configured. Please set VITE_SANITY_PROJECT_ID in your .env file');
      return [];
    }
    
    const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Sanity API error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Sanity fetch error:', error);
      return [];
    }
  }
};

const imageUrlBuilder = (source, width = null, height = null) => {
  // If URL is already provided from Sanity, use it directly with optimizations
  if (source?.asset?.url) {
    const url = new URL(source.asset.url);
    if (width) url.searchParams.set('w', width);
    if (height) url.searchParams.set('h', height);
    url.searchParams.set('auto', 'format');
    url.searchParams.set('q', '80');
    return url.toString();
  }
  
  // Fallback to building URL from _ref if available
  if (source?.asset?._ref) {
    const ref = source.asset._ref;
    const [, id, dimensions, format] = ref.split('-');
    let url = `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`;
    
    // Add optimization parameters
    const urlObj = new URL(url);
    if (width) urlObj.searchParams.set('w', width);
    if (height) urlObj.searchParams.set('h', height);
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('q', '80');
    
    return urlObj.toString();
  }

  // Default placeholder
  return '/api/placeholder/400/300';
};

// Helper function for optimized profile images
const optimizedProfileImage = (source) => {
  return imageUrlBuilder(source, 300, 300);
};

const Portfolio = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('about');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarExpanded(false);
    setMobileMenuOpen(false);
    
    // Scroll the main content area to top
    setTimeout(() => {
      const mainContent = document.querySelector('main.flex-1');
      if (mainContent) {
        mainContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 50);
  };
  
  // Scroll to top when active section changes
  useEffect(() => {
    const mainContent = document.querySelector('main.flex-1');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);
  
  const [activeProjectTab, setActiveProjectTab] = useState('gis');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState({
    profile: {
      name: 'James Ngei',
      tagline: 'Geospatial Software Engineer',
      photo: '/api/placeholder/150/150',
      bio: 'Welcome to my portfolio. I am passionate about technology, research, and creating meaningful solutions. This space showcases my work across GIS, software development, AI/ML, and my perspectives on various topics.',
      resume: {
        asset: {
          url: '/path/to/resume.pdf' // This will be populated from Sanity
        },
        title: 'James_Ngei_CV.pdf'
      }
    },
    projects: {
      gis: [],
      software: [],
      aiml: []
    },
    research: [],
    contact: {}
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    
    // Fetch profile data
    const profile = await sanityClient.fetch(`*[_type == "profile"][0]{
      name,
      tagline,
      photo {
        asset->{
          _id,
          _ref,
          url
        },
        alt
      }
    }`);
    
    const about = await sanityClient.fetch(`*[_type == "about"][0]{
      profileImage{
        asset->{
          _id,
          _ref,
          url
        },
        alt
      },
      cvFile{
        asset->{
          _id,
          _ref,
          url,
          originalFilename
        }
      },
      title,
      subtitle,
      mainImage{
        asset->{
          _id,
          _ref,
          url
        },
        alt
      },
      cvFile{
        asset->{
          _id,
          _ref,
          url,
          originalFilename
        }
      },
      introduction,
      experience[]->{
        title,
        company,
        location,
        startDate,
        endDate,
        current,
        description
      },
      education[]->{
        degree,
        field,
        institution,
        startDate,
        endDate,
        description
      },
      skills[]->{
        name,
        level,
        category
      },
      name,
      email,
      github,
      linkedin
    }`);

    const projects = await sanityClient.fetch(`*[_type == "project"]{
      title,
      slug,
      description,
      category,
      coverImage{
        asset->{
          _id,
          _ref,
          url
        },
        alt
      },
      technologies,
      demoUrl,
      sourceCodeUrl,
      content,
      pages[] {
        _key,
        pageType,
        title,
        content,
        isImageOnly,
        images[] {
          asset->{
            _id,
            _ref,
            url
          },
          alt,
          caption
        },
        performanceTemplate {
          hero {
            title,
            subtitle,
            tags,
            colorTheme
          },
          metrics[] {
            value,
            label,
            color
          },
          overview,
          problem {
            title,
            description,
            points,
            theme
          },
          solution {
            sectionTitle,
            layout,
            cards[] {
              icon,
              title,
              description,
              colorTheme
            }
          },
          results {
            sectionTitle,
            displayType,
            table {
              headers,
              rows[] {
                col1,
                col2,
                col3,
                col4
              }
            },
            resultImages[] {
              asset->{
                _id,
                _ref,
                url
              },
              alt,
              caption
            }
          },
          architecture {
            sectionTitle,
            diagramType,
            image {
              asset->{
                _id,
                _ref,
                url
              },
              alt,
              caption
            },
            mermaidCode,
            description
          },
          projectLinks {
            githubUrl,
            demoUrl
          },
          keyLearnings {
            sectionTitle,
            layout,
            learnings[] {
              icon,
              title,
              description,
              colorTheme
            }
          },
          codeHighlight {
            sectionTitle,
            code,
            language
          }
        },
        technicalTemplate {
          title,
          sections[] {
            _type,
            _key,
            title,
            content,
            image {
              asset->{
                _id,
                _ref,
                url
              },
              alt,
              caption
            },
            size,
            diagram {
              asset->{
                _id,
                _ref,
                url
              },
              alt
            }
          }
        },
        galleryTemplate {
          images[] {
            asset->{
              _id,
              _ref,
              url
            },
            alt,
            caption
          }
        }
      }
    }`);
    
    // Group projects by category
    const gisProjects = projects.filter(p => p.category === 'gis');
    const softwareProjects = projects.filter(p => p.category === 'software');
    const aimlProjects = projects.filter(p => p.category === 'aiml');

    let thoughts = [];
    try {
      console.log('Fetching thoughts from Sanity...');
      thoughts = await sanityClient.fetch(`
        *[_type == "thoughts" && !(_id in path('drafts.**'))] | order(publishedAt desc) {
          _id,
          title,
          excerpt,
          content,
          publishedAt,
          slug {
            current
          },
          "authorName": "James Ngei",
          "authorImage": "", // We'll update this later with the actual profile image
          coverImage {
            asset->{
              _id,
              url,
              metadata {
                dimensions {
                  width,
                  height,
                  aspectRatio
                }
              }
            },
            alt,
            caption
          },
          tags,
          isPinned,
          mood,
          "body": content
        }
      `);
      console.log('Fetched thoughts:', thoughts);
    } catch (error) {
      console.error('Error fetching thoughts:', error);
      thoughts = [];
    }

    const research = await sanityClient.fetch(`*[_type == "research"] | order(publishedAt desc){
      title, abstract, authors, journal, year, link
    }`);

    if (about || projects || research || thoughts || profile) {
      setContent({
        profile: {
          name: profile?.name || 'James Ngei',
          tagline: profile?.tagline || 'Geospatial Software Engineer',
          photo: profile?.photo?.asset?.url || '/api/placeholder/150/150',
          ...about,
          // For backward compatibility
          bio: about?.introduction?.[0]?.children?.[0]?.text || '',
          resume: about?.cvFile
        },
        projects: {
          gis: gisProjects || [],
          software: softwareProjects || [],
          aiml: aimlProjects || []
        },
        research: research || [],
        thoughts: thoughts || [],
        contact: {
          email: about?.email,
          github: about?.github,
          linkedin: about?.linkedin,
          name: about?.name
        }
      });
    }
    setIsLoading(false);
  };

  const navItems = [
    { id: 'about', label: 'About', icon: User },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'research', label: 'Research', icon: FileText },
    { id: 'thoughts', label: 'Thoughts', icon: Brain },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  const projectTabs = [
    { id: 'gis', label: 'Featured', icon: MapPin },
    // { id: 'software', label: 'Software Solutions', icon: Code },
    // { id: 'aiml', label: 'AI/ML', icon: Brain }
  ];

  const ProjectCard = ({ project }) => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 w-[300px]">
        <div className="h-[140px] bg-gradient-to-br from-teal-500 to-cyan-600 overflow-hidden">
          {project.coverImage && (
            <img 
              src={imageUrlBuilder(project.coverImage)} 
              alt={project.coverImage.alt || project.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4 pb-3">
          <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-1">{project.title}</h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 mb-3.5 line-clamp-2 leading-relaxed">{project.description}</p>
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className="px-2 py-0.5 bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-200 text-[10px] leading-none">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-[10px] leading-none">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={(e) => {
                e.preventDefault();
                // Use the pages from Sanity if available, otherwise create a default page
                const projectPages = project.pages && project.pages.length > 0 
                  ? project.pages 
                  : [
                      {
                        title: project.title,
                        content: project.content,
                        images: project.coverImage ? [project.coverImage] : []
                      }
                    ];
                
                setSelectedProject({
                  ...project,
                  pages: projectPages
                });
              }}
              className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors text-sm px-3 py-1.5 -mx-1.5 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-md"
            >
              View Details
            </button>
            {project.sourceCodeUrl && (
              <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1.5 text-slate-600 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 font-medium transition-colors text-sm px-3 py-1.5 -mx-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-md">
                <Github className="w-3.5 h-3.5" /> Code
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors text-sm px-3 py-1.5 -mx-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                Demo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Portable Text Components
  const portableTextComponents = {
    block: {
      h1: ({children}) => <h1 className="text-3xl font-bold my-4">{children}</h1>,
      h2: ({children}) => <h2 className="text-2xl font-bold my-3">{children}</h2>,
      h3: ({children}) => <h3 className="text-xl font-bold my-2">{children}</h3>,
      normal: ({children}) => <p className="my-4">{children}</p>,
      blockquote: ({children}) => <blockquote className="border-l-4 border-teal-500 pl-4 italic my-4">{children}</blockquote>,
    },
    list: {
      bullet: ({children}) => <ul className="list-disc pl-6 my-4">{children}</ul>,
      number: ({children}) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
    },
    listItem: {
      bullet: ({children}) => <li className="mb-2">{children}</li>,
      number: ({children}) => <li className="mb-2">{children}</li>,
    },
    marks: {
      link: ({value, children}) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
        return (
          <a href={value?.href} target={target} className="text-teal-600 hover:underline">
            {children}
          </a>
        );
      },
    },
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <AboutPage 
            profile={content.profile}
            onContactClick={() => setActiveSection('contact')}
            onDownloadCV={() => {
              if (content.profile.cvFile?.asset?.url) {
                window.open(content.profile.cvFile.asset.url, '_blank');
              }
            }}
            onViewProjects={() => setActiveSection('projects')}
            onCollapseSidebar={() => setSidebarExpanded(false)}
          />
        );

      case 'projects':
        return (
          <div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">Projects</h2>
            
            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-gray-700 pb-2">
              {projectTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProjectTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 font-medium rounded-t-lg transition-all ${
                      activeProjectTab === tab.id
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border-b-2 border-teal-600 dark:border-teal-500'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading state
                <div className="col-span-3 text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
                  <p className="text-slate-600 dark:text-gray-400">Loading projects...</p>
                </div>
              ) : content.projects[activeProjectTab]?.length > 0 ? (
                // Projects list - sort by date (newest first) and map
                [...content.projects[activeProjectTab]]
                  .sort((a, b) => new Date(b.date || b._createdAt) - new Date(a.date || a._createdAt))
                  .map((project, i) => (
                    <ProjectCard key={i} project={project} />
                  ))
              ) : (
                // Empty state
                <div className="col-span-2 text-center py-16 text-slate-500 dark:text-gray-400">
                  <Code className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-gray-600" />
                  <p className="text-lg">No projects yet in this category.</p>
                  <p className="text-sm">Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'research':
        return (
          <div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">Research</h2>
            <div className="space-y-6">
              {content.research.length > 0 ? (
                content.research.map((paper, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-teal-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{paper.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-gray-300 mb-3 font-medium">{paper.authors} • {paper.journal} ({paper.year})</p>
                    <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed">{paper.abstract}</p>
                    {paper.link && (
                      <a href={paper.link} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">
                        Read Paper <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-500 dark:text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-gray-600" />
                  <p className="text-lg">No research publications yet.</p>
                  <p className="text-sm">Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'thoughts':
        return (
          <div className="w-full">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">Thoughts & Perspectives</h2>
            <div className="space-y-4 w-full">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
                  <p className="text-slate-600 dark:text-gray-400">Loading thoughts...</p>
                </div>
              ) : content.thoughts && content.thoughts.length > 0 ? (
                content.thoughts.map((post, i) => (
                  <div key={i} className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-md shadow-teal-100/50 hover:shadow-lg hover:shadow-teal-100/70 transition-shadow duration-200 border border-amber-100 dark:border-gray-700 overflow-hidden">
                    <button 
                      onClick={() => {
                        const updatedThoughts = [...content.thoughts];
                        updatedThoughts[i] = {
                          ...updatedThoughts[i],
                          isExpanded: !updatedThoughts[i].isExpanded
                        };
                        setContent({...content, thoughts: updatedThoughts});
                      }}
                      className="w-full text-left p-4 flex justify-between items-center hover:bg-amber-100/50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white">{post.title}</h3>
                      <span className={`transform transition-transform ${post.isExpanded ? 'rotate-45' : 'rotate-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </button>
                    
                    {post.isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-amber-100 dark:border-gray-700 max-w-[793px] mx-auto w-full lg:px-8">
                        <div className="flex items-center gap-3 mb-4">
                          {post.authorImage && (
                            <img 
                              src={post.authorImage} 
                              alt={post.authorName || 'Author'} 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-gray-200">{post.authorName || 'Author'}</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400">
                              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {post.body ? (
                          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-gray-300 mb-4">
                            <PortableText 
                              value={post.body}
                              components={portableTextComponents}
                            />
                          </div>
                        ) : (
                          <p className="text-slate-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                        )}
                        
                        {post.coverImage && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img 
                              src={imageUrlBuilder(post.coverImage)} 
                              alt={post.title}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center justify-end mt-6">
                          <div className="flex gap-2">
                            {post.tags?.map((tag, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-500 dark:text-gray-400">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-gray-600" />
                  <p className="text-lg">No articles yet.</p>
                  <p className="text-sm">Check back soon for new thoughts and perspectives!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return <ContactPage />;

      default:
        return null;
    }
  };

  if (!content || !content.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  const { profile, projects = [], blogPosts = [], research = [] } = content;

  return (
    <div className={`flex h-screen transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 to-teal-900 text-white p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400 bg-gradient-to-br from-teal-500 to-emerald-600">
            <img 
              src="/images/profile.jpg" 
              alt={profile.name || 'Profile'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.profile-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="profile-fallback hidden w-full h-full items-center justify-center text-white text-xs font-bold">
              {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg">James Ngei</h1>
            <p className="text-teal-300 text-xs">{profile.tagline}</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-16 right-0 bottom-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                      isActive 
                        ? 'bg-teal-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-700">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 border-t border-slate-700">
              <div className="flex justify-center gap-6">
                {content.contact?.github && (
                  <a href={content.contact.github} target="_blank" rel="noopener noreferrer" 
                     className="text-slate-400 hover:text-teal-400 transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {content.contact?.linkedin && (
                  <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer"
                     className="text-slate-400 hover:text-teal-400 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Hidden on mobile, always visible on desktop */}
      <aside className={`hidden lg:flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white transition-all duration-300 ease-in-out h-screen overflow-y-auto ${
        sidebarExpanded ? 'w-72' : 'w-20'
      }`}>
        {/* Profile Section */}
        <div className={`flex flex-col items-center transition-all duration-300 ${
          sidebarExpanded ? 'p-8 pt-12' : 'p-4 pt-8'
        }`}>
          <div className={`relative rounded-full overflow-hidden border-4 border-teal-400 shadow-xl transition-all duration-300 ${
            sidebarExpanded ? 'w-28 h-28 mb-4' : 'w-12 h-12 mb-6'
          } bg-gradient-to-br from-teal-500 to-emerald-600`}>
            <img 
              src="/images/profile.jpg" 
              alt={profile.name || 'Profile'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.profile-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="profile-fallback hidden w-full h-full items-center justify-center text-white font-bold">
              {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
          </div>
          
          {sidebarExpanded && (
            <div className="text-center w-full">
              <h1 className="text-2xl font-bold mb-1 text-white">James Ngei</h1>
              <p className="text-teal-300 text-sm font-medium">{profile.tagline}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center px-3 mt-6">
          <div className="w-full flex flex-col items-center space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <div key={item.id} className="w-full flex justify-center">
                  <button
                    onClick={() => {
                      setActiveSection(item.id);
                      if (item.id !== 'about') {
                        setSidebarExpanded(false);
                      }
                    }}
                    className={`relative flex flex-col items-center py-2 px-4 transition-all duration-200 w-full max-w-[180px] ${
                      isActive ? 'text-teal-400' : 'text-slate-400 hover:text-white'
                    }`}
                    title={!sidebarExpanded ? item.label : ''}
                  >
                    <div className="flex items-center gap-3 pb-1">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarExpanded && (
                        <span className={`font-medium ${isActive ? 'text-teal-400' : 'text-slate-300'}`}>
                          {item.label}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <div className="w-full border-b-2 border-teal-400 mt-0.25"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            {sidebarExpanded && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>

        {/* Social Links */}
        {sidebarExpanded && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex justify-center gap-4">
              {content.contact?.github && (
                <a href={content.contact.github} target="_blank" rel="noopener noreferrer" 
                   className="text-slate-400 hover:text-teal-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {content.contact?.linkedin && (
                <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer"
                   className="text-slate-400 hover:text-teal-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Collapse/Expand Button */}
        <div className="mt-auto">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="flex items-center justify-center w-full py-4 bg-slate-800 hover:bg-slate-700 transition-colors border-t border-slate-700 text-slate-300 hover:text-white shadow-lg"
            aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-200 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-12">
          {renderContent()}
        </div>
      </main>

      {/* Project Viewer - Rendered as an overlay */}
      {selectedProject && (
        <ProjectViewer 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};

export default Portfolio;