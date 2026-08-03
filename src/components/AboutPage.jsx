import React from 'react';
import { Mail, FileText, Code, ArrowRight } from 'lucide-react';
import { PortableText } from '@portabletext/react';

const imageUrlBuilder = (source) => {
  if (source?.asset?.url) {
    return source.asset.url;
  }
  if (source?.asset?._ref) {
    const ref = source.asset._ref;
    const [, id, dimensions, format] = ref.split('-');
    const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id';
    const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }
  return '/api/placeholder/320/320';
};

const AboutPage = ({ profile, onContactClick, onDownloadCV, onViewProjects, onCollapseSidebar }) => {
  // Calculate stats from profile data
  const calculateYearsExperience = () => {
    if (!profile?.experience || profile.experience.length === 0) return '3+';
    const experiences = profile.experience;
    const earliestYear = Math.min(...experiences.map(exp => {
      if (exp.startDate) {
        const year = new Date(exp.startDate).getFullYear();
        return year;
      }
      return new Date().getFullYear();
    }));
    const years = new Date().getFullYear() - earliestYear;
    return years > 0 ? `${years}+` : '1+';
  };

  const totalProjects = () => {
    // This would ideally come from projects count, but for now use a default
    return '15+';
  };

  const dataProcessed = () => {
    // This could be calculated from project data if available
    return '30TB+';
  };

  // Group skills by category
  const skillsByCategory = () => {
    if (!profile?.skills || profile.skills.length === 0) {
      // Return default skills if none available
      return [
        {
          category: 'Geospatial Technologies',
          skills: 'PostGIS, GDAL, GeoPandas, Geoserver, QGIS, ArcGIS Pro, Mapbox, Leaflet, OpenLayers',
          icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          )
        },
        {
          category: 'Software Engineering',
          skills: 'Python, JavaScript/TypeScript, React, FastAPI, Django, Node.js, RESTful APIs, Git',
          icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M16 18L22 12 16 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 6L2 12 8 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )
        },
        {
          category: 'Data & Analytics',
          skills: 'Spatial analysis, Multi-criteria evaluation, Geostatistics, Remote sensing, Machine learning integration',
          icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M18 17l-5-5-3 3-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="18" cy="17" r="1.5" fill="currentColor"/>
              <circle cx="13" cy="12" r="1.5" fill="currentColor"/>
            </svg>
          )
        },
        {
          category: 'Cloud & DevOps',
          skills: 'AWS/GCP/Azure geospatial services, Docker, Kubernetes, CI/CD, Serverless architectures, COG workflows',
          icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M12 11v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          )
        },
        {
          category: 'System Design & Architecture',
          skills: 'Microservices, API design, Database optimization, Scalability patterns, Distributed spatial systems',
          icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M8 4v16M4 8h16M16 4v16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )
        },
        {
          category: 'Geospatial Data Engineering',
          skills: 'ETL pipelines, Spatial databases, Data validation, Tile generation, Metadata standards, Quality assurance',
          icon: (
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M6 10h4M6 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="17" cy="12" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M2 10h20M2 14h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )
        }
      ];
    }

    // Group skills by category
    const grouped = {};
    profile.skills.forEach(skill => {
      const category = skill.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill.name);
    });

    // Map to the expected format with icons
    const categoryIcons = {
      'Geospatial Technologies': (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      ),
      'Software Engineering': (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M16 18L22 12 16 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 6L2 12 8 18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'Data & Analytics': (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M18 17l-5-5-3 3-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="18" cy="17" r="1.5" fill="currentColor"/>
          <circle cx="13" cy="12" r="1.5" fill="currentColor"/>
        </svg>
      ),
      'Cloud & DevOps': (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 11v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      ),
      'System Design & Architecture': (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 4v16M4 8h16M16 4v16M4 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'Geospatial Data Engineering': (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M6 10h4M6 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="17" cy="12" r="2" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M2 10h20M2 14h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    };

    return Object.entries(grouped).map(([category, skills]) => ({
      category,
      skills: Array.isArray(skills) ? skills.join(', ') : skills,
      icon: categoryIcons[category] || categoryIcons['Software Engineering']
    }));
  };

  // Handle profile image from Sanity
  const profileImage = profile?.profileImage;
  const profileImageUrl = profileImage ? imageUrlBuilder(profileImage) : null;
  const profileName = profile?.name || 'James Ngei';
  const profileTitle = 'Geospatial Software Engineer';
  const bio = 'Welcome to my portfolio. I am passionate about technology, research, and creating meaningful solutions.';

  // Portable Text Components for introduction
  const portableTextComponents = {
    block: {
      normal: ({children}) => <p className="mb-4 text-slate-600 dark:text-gray-300 leading-relaxed">{children}</p>,
    },
    marks: {
      strong: ({children}) => <strong className="font-bold">{children}</strong>,
      em: ({children}) => <em className="italic">{children}</em>,
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-none shadow-none mb-0 overflow-hidden flex flex-col md:flex-row relative">
        {/* Hero Accent */}
        <div className="w-full md:w-72 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 relative overflow-hidden h-48 md:h-auto">
          <div className="absolute inset-0 opacity-50" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)'
          }}></div>
        </div>

        {/* Hero Content */}
        <div className="flex items-center flex-1 flex-col md:flex-row">
          {/* Profile Image */}
          <div className="w-64 h-64 md:w-80 md:h-80 -mt-20 md:-ml-40 md:mt-0 z-10 overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl mx-auto md:mx-0 p-2 bg-white border-4 border-white shadow-[0_0_15px_rgba(0,0,0,0.15)] dark:shadow-[0_0_20px_rgba(0,0,0,0.4)] relative">
            <img 
              src="/images/about.jpg" 
              alt={profileName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement.querySelector('.profile-fallback');
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="profile-fallback hidden w-full h-full items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-4xl font-bold">
              {profileName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6 md:p-12 md:pl-16 flex-1 animate-slideInRight text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {profileName}
            </h1>
            <div className="text-teal-600 dark:text-teal-400 text-lg font-medium mb-5">
              {profileTitle}
            </div>
            
            {/* Bio/Introduction */}
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
              I build robust, cloud-native spatial systems that transform raw data into actionable intelligence. With a background in GIS and Software Engineering, I implement solutions at the intersection of mapping technology and robust system architecture.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-6 md:gap-8 my-7 py-5 border-t border-b border-slate-200 dark:border-gray-700">
              <div className="flex-1 min-w-[120px]">
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 block mb-1">
                  {calculateYearsExperience()}
                </span>
                <span className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  Years Experience
                </span>
              </div>
              <div className="flex-1 min-w-[120px]">
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 block mb-1">
                  {dataProcessed()}
                </span>
                <span className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  Data Processed
                </span>
              </div>
              <div className="flex-1 min-w-[120px]">
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-400 block mb-1">
                  {totalProjects()}
                </span>
                <span className="text-xs text-slate-600 dark:text-gray-400 uppercase tracking-wider">
                  Projects Delivered
                </span>
              </div>
            </div>

            {/* Additional Bio Text */}
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
              I'm currently pursuing an MSc in Software Engineering, focusing on large-scale systems and advanced computing. Long-term, I'm drawn to building intelligent spatial systems that support sustainable development, agriculture, and infrastructure planning.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => {
                  onContactClick();
                  if (onCollapseSidebar) onCollapseSidebar();
                }}
                className="relative px-7 py-3 bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 text-white rounded font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-500/40 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Get In Touch
                </span>
                <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-600"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-amber-50 dark:bg-gray-900 rounded-none py-12 md:py-16 px-6 md:px-10">
        {/* Journey Section */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16 pb-12 border-b border-slate-200 dark:border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6 text-center">
            My Journey
          </h2>
          <p className="text-slate-700 dark:text-gray-300 leading-relaxed text-base mb-6">
            My path started with a fascination for how location shapes everything. While studying Geospatial Information Science, I realized the real power was in building systems that process spatial data at scale. Early projects processing satellite datasets and building location analytics taught me that great geospatial systems need both spatial thinking and solid engineering.
          </p>
          <div className="border-l-4 border-teal-500 dark:border-teal-400 pl-6 my-6 italic text-slate-700 dark:text-gray-300 bg-teal-50/50 dark:bg-teal-900/20 py-5 rounded-r leading-relaxed">
            <p>
              I prioritize data accuracy and system reliability over feature bloat. I design systems thinking about real users—field workers with spotty connectivity, analysts processing terabytes of imagery—making complex spatial problems feel simple.
            </p>
          </div>
        </div>

        {/* Skills Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Skills & Expertise
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I specialize in geospatial technologies and software engineering, building scalable solutions for spatial data processing, analysis, and visualization.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {skillsByCategory().map((skillGroup, index) => {
            const skillsText = Array.isArray(skillGroup.skills) 
              ? skillGroup.skills.join(', ') 
              : skillGroup.skills;
            
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-5 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/10 border border-slate-100 dark:border-gray-700 flex flex-col min-h-[220px] mx-auto w-full max-w-[400px]"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 flex items-center justify-center mb-3 text-white flex-shrink-0 mx-auto md:mx-0 [&>svg]:w-5 [&>svg]:h-5">
                  {skillGroup.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 flex-shrink-0 text-center md:text-left">
                  {skillGroup.category}
                </h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-xs break-words overflow-wrap-anywhere flex-grow text-center md:text-left">
                  {skillsText}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <button
            onClick={() => {
              onViewProjects();
              if (onCollapseSidebar) onCollapseSidebar();
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 text-white rounded-lg font-medium text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/40 group"
          >
            <Code className="w-5 h-5" />
            View My Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          {profile?.cvFile?.asset?.url && (
            <button
              onClick={onDownloadCV}
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-teal-600 dark:text-teal-400 border-2 border-teal-600 dark:border-teal-400 rounded-lg font-medium text-base transition-all duration-300 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 hover:-translate-y-1 hover:shadow-md"
            >
              <FileText className="w-5 h-5" />
              Download CV
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
