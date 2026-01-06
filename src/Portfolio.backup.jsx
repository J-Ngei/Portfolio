import React, { useState, useEffect } from 'react';
import { MapPin, Code, Brain, User, FileText, Mail, ChevronRight, ChevronLeft, ExternalLink, Github, Linkedin, X, Moon, Sun } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import ProjectViewer from './components/ProjectViewer';
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

const imageUrlBuilder = (source) => {
  // If URL is already provided from Sanity, use it directly
  if (source?.asset?.url) {
    return source.asset.url;
  }
  
  // Fallback to building URL from _ref if available
  if (source?.asset?._ref) {
    const ref = source.asset._ref;
    const [, id, dimensions, format] = ref.split('-');
    return `https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${dimensions}.${format}`;
  }

  // Default placeholder
  return '/api/placeholder/400/300';
};

const Portfolio = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('about');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
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
    thoughts: [
      {
        id: 1,
        title: "The Future of Geographic Information Systems: Beyond Mapping",
        excerpt: "Exploring how GIS technology is evolving with AI, big data, and spatial analysis to create new possibilities we could barely imagine a decade ago.",
        date: "December 15, 2024",
        readTime: "8 min read",
        author: "James Ngei",
        content: [
          {
            type: "text",
            content: "Geographic Information Systems have evolved **far beyond simple digital maps**. As we stand at the intersection of artificial intelligence, big data, and spatial analysis, the potential applications of GIS technology are expanding into territories we could *barely imagine* a decade ago."
          },
          {
            type: "heading",
            level: 2,
            content: "The New Frontier of Spatial Intelligence"
          },
          {
            type: "text",
            content: "Modern GIS is no longer just about creating static maps. Today's systems integrate real-time data streams, machine learning algorithms, and advanced visualization techniques to provide dynamic, interactive spatial intelligence."
          }
        ],
        isExpanded: false
      },
      {
        id: 2,
        title: "Data Visualization: Telling Stories with Numbers",
        excerpt: "In an era of information overload, effective data visualization is more important than ever. Learn how to transform complex datasets into compelling visual narratives.",
        date: "November 28, 2024",
        readTime: "6 min read",
        author: "James Ngei",
        content: [
          {
            type: "text",
            content: "In today's data-driven world, the ability to effectively visualize information is no longer just a nice-to-have skill—it's a necessity. **Good data visualization** bridges the gap between complex data and human understanding."
          },
          {
            type: "heading",
            level: 2,
            content: "The Power of Visual Communication"
          },
          {
            type: "text",
            content: "Humans are visual creatures. We process images *60,000 times faster* than text, and 90% of information transmitted to the brain is visual. This is why well-designed charts and graphs can convey complex information more effectively than spreadsheets full of numbers."
          }
        ],
        isExpanded: false
      },
      {
        id: 3,
        title: "The Intersection of GIS and Public Health",
        excerpt: "How geographic information systems are transforming disease surveillance, healthcare access, and public health policy in the 21st century.",
        date: "October 15, 2024",
        readTime: "7 min read",
        author: "James Ngei",
        content: [
          {
            type: "text",
            content: "The COVID-19 pandemic underscored the critical role of **spatial analysis** in public health. GIS technology emerged as a powerful tool for tracking disease spread, allocating healthcare resources, and informing public policy decisions."
          },
          {
            type: "heading",
            level: 2,
            content: "Disease Surveillance and Outbreak Response"
          },
          {
            type: "text",
            content: "Modern GIS platforms enable real-time disease tracking, allowing public health officials to identify hotspots, predict spread patterns, and implement targeted interventions."
          }
        ],
        isExpanded: false
      }
    ],
    contact: {}
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    const about = await sanityClient.fetch(`*[_type == "about"][0]{
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
        }
      }
    }`);
    
    // Group projects by category
    const gisProjects = projects.filter(p => p.category === 'gis');
    const softwareProjects = projects.filter(p => p.category === 'software');
    const aimlProjects = projects.filter(p => p.category === 'aiml');

    const research = await sanityClient.fetch(`*[_type == "research"] | order(publishedAt desc){
      title, abstract, authors, journal, year, link
    }`);

    const thoughts = await sanityClient.fetch(`*[_type == "blogPost"] | order(publishedAt desc){
      title,
      excerpt,
      body,
      publishedAt,
      slug,
      coverImage,
      "authorName": author->name,
      "authorImage": author->image.asset->url
    }`);

    if (about || projects || research || thoughts) {
      setContent({
        profile: {
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
    { id: 'gis', label: 'GIS Lab', icon: MapPin },
    { id: 'software', label: 'Software Solutions', icon: Code },
    { id: 'aiml', label: 'AI/ML', icon: Brain }
  ];

  const ProjectCard = ({ project }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-teal-100 dark:border-gray-700">
        <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 overflow-hidden">
          {project.coverImage && (
            <img 
              src={imageUrlBuilder(project.coverImage)} 
              alt={project.coverImage.alt || project.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{project.title}</h3>
          <p className="text-slate-600 dark:text-gray-300 mb-4">{project.description}</p>
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm rounded-full font-medium">
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-3">
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
              className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors"
            >
              View Details
            </button>
            {project.sourceCodeUrl && (
              <a href={project.sourceCodeUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-slate-600 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300 font-medium transition-colors">
                <Github className="w-4 h-4" /> Code
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                Live Demo <ExternalLink className="w-4 h-4" />
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
          <div className="max-w-3xl">
            {/* Title - only show if exists */}
            {content.profile.title && (
              <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
                {content.profile.title}
              </h2>
            )}
            
            {/* Subtitle - styled as a quote */}
            {content.profile.subtitle && (
              <div className="relative pl-6 border-l-4 border-teal-500 dark:border-teal-400 my-6">
                <PortableText 
                  value={content.profile.subtitle}
                  components={{
                    block: {
                      normal: ({children}) => (
                        <p className="text-xl text-slate-600 dark:text-gray-300 italic pl-4">
                          {children}
                        </p>
                      ),
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-bold text-teal-600 dark:text-teal-400">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                    }
                  }}
                />
                <div className="absolute -left-1 top-0 w-2 h-8 bg-teal-500 dark:bg-teal-400 rounded-full"></div>
              </div>
            )}
            
            {/* Main content with rich text support */}
            <div className="prose prose-lg dark:prose-invert text-slate-700 dark:text-gray-300 leading-relaxed mb-8">
              {content.profile.introduction && (
                <PortableText 
                  value={content.profile.introduction}
                  components={{
                    block: {
                      normal: ({children}) => <p className="mb-4">{children}</p>,
                      h1: ({children}) => <h1 className="text-3xl font-bold my-6">{children}</h1>,
                      h2: ({children}) => <h2 className="text-2xl font-bold my-5">{children}</h2>,
                      h3: ({children}) => <h3 className="text-xl font-bold my-4">{children}</h3>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-teal-500 pl-4 italic my-4">{children}</blockquote>,
                    },
                    marks: {
                      strong: ({children}) => <strong className="font-bold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                      underline: ({children}) => <u>{children}</u>,
                      code: ({children}) => <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">{children}</code>,
                    },
                    list: {
                      bullet: ({children}) => <ul className="list-disc pl-6 my-2">{children}</ul>,
                      number: ({children}) => <ol className="list-decimal pl-6 my-2">{children}</ol>,
                    },
                    listItem: {
                      bullet: ({children}) => <li className="mb-1">{children}</li>,
                      number: ({children}) => <li className="mb-1">{children}</li>,
                    }
                  }}
                />
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              {/* Get in Touch Button */}
              <button
                onClick={() => setActiveSection('contact')}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-teal-200 dark:border-teal-700 rounded-lg transition-all shadow-sm hover:shadow"
              >
                <Mail className="w-5 h-5" />
                Get in Touch
              </button>
              
              {/* Download CV Button - updated to use the new cvFile field */}
              {content.profile.cvFile?.asset?.url && ( 
                <button
                  onClick={() => window.open(content.profile.cvFile.asset.url, '_blank')}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-teal-200 dark:border-teal-700 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  <FileText className="w-5 h-5" />
                  Download CV
                </button>
              )}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div>
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">Projects</h2>
            
            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                // Loading state
                <div className="col-span-2 text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
                  <p className="text-slate-600">Loading projects...</p>
                </div>
              ) : content.projects[activeProjectTab]?.length > 0 ? (
                // Projects list
                content.projects[activeProjectTab].map((project, i) => (
                  <ProjectCard key={i} project={project} />
                ))
              ) : (
                // Empty state
                <div className="col-span-2 text-center py-16 text-slate-500">
                  <Code className="w-16 h-16 mx-auto mb-4 text-slate-300" />
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
                         className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium transition-colors">
                        Read Paper <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-slate-500">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
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
              {content.thoughts.length > 0 ? (
                content.thoughts.map((post, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-teal-100 dark:border-gray-700 overflow-hidden">
                    <button 
                      onClick={() => {
                        const updatedThoughts = [...content.thoughts];
                        updatedThoughts[i] = {
                          ...updatedThoughts[i],
                          isExpanded: !updatedThoughts[i].isExpanded
                        };
                        setContent({...content, thoughts: updatedThoughts});
                      }}
                      className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-slate-800 dark:text-white">{post.title}</h3>
                      <span className={`transform transition-transform ${post.isExpanded ? 'rotate-45' : 'rotate-0'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </span>
                    </button>
                    
                    {post.isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-gray-700">
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
                            <p className="text-xs text-slate-500">
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
                        
                        <div className="flex items-center justify-between mt-6">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle read more action
                            }}
                            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 text-sm group"
                          >
                            Continue reading <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                          
                          <div className="flex gap-2">
                            {post.tags?.map((tag, i) => (
                              <span key={i} className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded-full">
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
                <div className="text-center py-16 text-slate-500">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg">No articles yet.</p>
                  <p className="text-sm">Check back soon for new thoughts and perspectives!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-2xl">
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-8">Get In Touch</h2>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-teal-100 dark:border-gray-700">
              <p className="text-slate-700 dark:text-gray-200 mb-6 text-lg leading-relaxed">
                I'm always interested in hearing about new opportunities, collaborations, or just having a chat about technology and research.
              </p>
              {content.contact.email && (
                <div className="flex items-center gap-3 text-lg mb-6 p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-100 dark:border-teal-800/50">
                  <Mail className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                  <a href={`mailto:${content.contact.email}`} className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">
                    {content.contact.email}
                  </a>
                </div>
              )}
              <div className="flex flex-wrap gap-4 mt-8">
                {content.contact.github && (
                  <a href={content.contact.github} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-6 py-3 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors shadow-sm">
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                )}
                {content.contact.linkedin && (
                  <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-2 px-6 py-3 bg-teal-600 dark:bg-teal-700 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors shadow-sm">
                    <Linkedin className="w-5 h-5" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        );

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
      {/* Sidebar - Always visible, never overlaps */}
      <aside className={`flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-teal-900 text-white transition-all duration-300 ease-in-out ${
        sidebarExpanded ? 'w-80' : 'w-20'
      }`}>
        {/* Profile Section */}
        <div className={`flex flex-col items-center transition-all duration-300 ${
          sidebarExpanded ? 'p-8 pt-12' : 'p-4 pt-8'
        }`}>
          <div className={`rounded-full overflow-hidden border-4 border-teal-400 shadow-xl transition-all duration-300 ${
            sidebarExpanded ? 'w-32 h-32 mb-4' : 'w-12 h-12 mb-6'
          } bg-gradient-to-br from-teal-500 to-emerald-600`}>
            {profile.photo ? (
              <img 
                src={profile.photo} 
                alt={profile.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold">
                {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </div>
            )}
          </div>
          
          {sidebarExpanded && (
            <div className="text-center w-full">
              <h1 className="text-2xl font-bold mb-1 text-white">{content.profile.name}</h1>
              <p className="text-teal-300 text-sm font-medium">{content.profile.tagline}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 flex flex-col items-center px-3 ${sidebarExpanded ? 'mt-8' : 'mt-4'}`}>
          <div className="w-full max-w-[200px]">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    if (item.id !== 'about') {
                      setSidebarExpanded(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 text-base ${
                    activeSection === item.id
                      ? 'bg-teal-600 text-white shadow-lg font-semibold'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white font-medium'
                  } ${!sidebarExpanded ? 'justify-center' : 'justify-start'}`}
                  title={!sidebarExpanded ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarExpanded && <span className="text-center">{item.label}</span>}
                </button>
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
              {content.contact.github && (
                <a href={content.contact.github} target="_blank" rel="noopener noreferrer" 
                   className="text-slate-400 hover:text-teal-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {content.contact.linkedin && (
                <a href={content.contact.linkedin} target="_blank" rel="noopener noreferrer"
                   className="text-slate-400 hover:text-teal-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Collapse/Expand Button */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="flex items-center justify-center w-full py-4 bg-slate-800 hover:bg-slate-700 transition-colors border-t border-slate-700 text-slate-300 hover:text-white"
          aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-200">
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