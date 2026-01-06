import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, ArrowRight, Layers, Globe, Server, Wrench, Send, User } from 'lucide-react';

const ContactPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    // Using setTimeout to ensure this runs after the DOM has updated
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      // Additional scroll to top after a short delay to ensure it works
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus({ success: false, message: 'Please fill in all fields before sending.' });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });
    
    try {
      const response = await fetch('https://formspree.io/f/xeeobyyl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });
      
      if (response.ok) {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitStatus({ success: true, message: 'Message sent successfully! I\'ll get back to you soon.' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ success: false, message: 'Failed to send message. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center mb-12 md:mb-16 animate-slideDown">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 bg-clip-text text-transparent">
          Let's Build Cloud-Native Spatial Systems
        </h1>
        <p className="text-base md:text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Architecting scalable geospatial infrastructure that transforms petabytes of spatial data into production-ready intelligence.
        </p>
      </div>

      {/* Contact Methods Grid - with creamy background */}
      <div className="bg-amber-50 dark:bg-gray-900 rounded-none py-8 md:py-12 px-6 md:px-10 mb-12 md:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Email Card - Primary */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-none shadow-lg border-2 border-teal-500 dark:border-teal-600 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/30 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-500 dark:bg-teal-600 text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              Primary
            </div>
            <div className="w-12 h-12 mx-auto mb-4 p-3 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 rounded-full text-white flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 text-center">Email</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mb-3 text-center leading-relaxed">
              System architecture and project discussions
            </p>
            <a 
              href="mailto:james.nngei@gmail.com?subject=Cloud-Native Geospatial Project" 
              className="block text-teal-600 dark:text-teal-400 font-semibold text-base mb-2 text-center hover:text-teal-700 dark:hover:text-teal-300 transition-colors break-words px-2"
            >
              james.nngei@gmail.com
            </a>
            <span className="text-xs text-slate-500 dark:text-gray-500 italic block text-center">
              Usually responds within 24 hours
            </span>
          </div>

          {/* LinkedIn Card */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-none shadow-lg border border-slate-200 dark:border-gray-700 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/20 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 mx-auto mb-4 p-3 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 rounded-full text-white flex items-center justify-center">
              <Linkedin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 text-center">LinkedIn</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mb-3 text-center leading-relaxed">
              Professional network and opportunities
            </p>
            <a 
              href="https://linkedin.com/in/james-ngei-61461b1a5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-teal-600 dark:text-teal-400 font-semibold text-base mb-2 text-center hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              Connect on LinkedIn
            </a>
            <span className="text-xs text-slate-500 dark:text-gray-500 italic block text-center">
              Active weekly
            </span>
          </div>

          {/* GitHub Card */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-none shadow-lg border border-slate-200 dark:border-gray-700 relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/20 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 mx-auto mb-4 p-3 bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 rounded-full text-white flex items-center justify-center">
              <Github className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 text-center">GitHub</h3>
            <p className="text-xs text-slate-600 dark:text-gray-400 mb-3 text-center leading-relaxed">
              Code repositories and contributions
            </p>
            <a 
              href="https://github.com/J-Ngei" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-teal-600 dark:text-teal-400 font-semibold text-base mb-2 text-center hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              github.com/J-Ngei
            </a>
            <span className="text-xs text-slate-500 dark:text-gray-500 italic block text-center">
              Open source work
            </span>
          </div>
        </div>
      </div>

      {/* Collaboration Section */}
      <div className="bg-white dark:bg-gray-800 rounded-none p-8 md:p-12 mb-12 md:mb-16 shadow-md border border-slate-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 text-center">
          Areas of Collaboration
        </h2>
        <p className="text-base text-slate-600 dark:text-gray-300 mb-10 text-center max-w-3xl mx-auto leading-relaxed">
          End-to-end cloud-native spatial systems—from data pipelines and processing infrastructure to production APIs and user interfaces.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Cloud-Native Spatial Infrastructure */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-md">
              <Layers className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              Cloud-Native Spatial Infrastructure
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Kubernetes orchestration, serverless geospatial functions, event-driven architectures, and scalable tile servers
            </p>
          </div>

          {/* Distributed Geospatial Processing */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-md">
              <Globe className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              Distributed Geospatial Processing
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Multi-TB ETL pipelines, COG workflows, streaming spatial analytics, and containerized processing workflows
            </p>
          </div>

          {/* Complete GIS Platforms */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-md">
              <Server className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              Complete GIS Platforms
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              Full-stack systems with robust APIs, real-time processing, and modern mapping interfaces—deployed and production-ready
            </p>
          </div>

          {/* System Architecture & DevOps */}
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-md">
              <Wrench className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
              System Architecture & DevOps
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed">
              CI/CD for geospatial workloads, IaC with Terraform, monitoring spatial services, and performance optimization
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-10 pt-8 border-t border-slate-200 dark:border-gray-700">
          <p className="text-base md:text-lg text-slate-700 dark:text-gray-300 mb-5 font-medium">
            Ready to transform your spatial data into intelligent systems?
          </p>
          <a 
            href="mailto:james.nngei@gmail.com?subject=Geospatial System Architecture Discussion"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/40 group"
          >
            <Mail className="w-5 h-5" />
            Let's Discuss Your Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Send Message Section */}
      <div className="bg-amber-50 dark:bg-gray-900 rounded-none py-8 md:py-12 px-6 md:px-10 mb-0">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4 text-center">
          Send a Message
        </h2>
        <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 text-center max-w-2xl mx-auto">
          Prefer to write directly? Fill out the form below and I'll get back to you within 24 hours.
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {submitStatus.message && (
            <div className={`mb-4 p-3 rounded-md text-sm ${submitStatus.success ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
              {submitStatus.message}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name or Organization Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Name or Organization <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-none bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent disabled:opacity-75"
                  placeholder="Your name or organization"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-gray-600 rounded-none bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent disabled:opacity-75"
                  placeholder="your.email@example.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Subject Field */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-none bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent disabled:opacity-75"
              placeholder="What's this about?"
              disabled={isSubmitting}
            />
          </div>

          {/* Message Field */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-none bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent resize-none disabled:opacity-75"
              placeholder="Tell me about your project or how we can collaborate..."
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className={`inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-700 dark:from-teal-600 dark:to-teal-800 text-white rounded-lg font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/40 group ${isSubmitting ? 'opacity-75' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Availability Section */}
      <div className="pt-12 md:pt-16 border-t-2 border-slate-200 dark:border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-6 text-center">
          Current Availability
        </h2>
        
        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="relative">
            <div className="w-4 h-4 rounded-full bg-green-500 dark:bg-green-400"></div>
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 animate-ping opacity-75"></div>
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></div>
          </div>
          <span className="font-semibold text-green-600 dark:text-green-400 text-base">
            Open to projects
          </span>
        </div>
        
        {/* Project Types */}
        <div className="flex justify-center">
          <div className="bg-slate-50 dark:bg-gray-900/50 p-5 rounded-none border-l-4 border-teal-500 dark:border-teal-400 w-fit">
            <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">
              Project Types
            </h4>
            <ul className="space-y-2">
              <li className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed flex items-start gap-2">
                <span className="text-teal-500 dark:text-teal-400 font-bold mt-1">→</span>
                <span>System architecture & prototyping</span>
              </li>
              <li className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed flex items-start gap-2">
                <span className="text-teal-500 dark:text-teal-400 font-bold mt-1">→</span>
                <span>Infrastructure migration & optimization</span>
              </li>
              <li className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed flex items-start gap-2">
                <span className="text-teal-500 dark:text-teal-400 font-bold mt-1">→</span>
                <span>Technical consulting & code review</span>
              </li>
              <li className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed flex items-start gap-2">
                <span className="text-teal-500 dark:text-teal-400 font-bold mt-1">→</span>
                <span>Research collaboration & innovation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in;
        }
        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out backwards;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;

