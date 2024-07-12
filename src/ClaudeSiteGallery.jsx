import React, { useState, useEffect } from 'react';

const initialProjects = [
  // ... (keep the initial projects data as it was)
];

const extractTwitterUsername = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(?:#!\/)?@?([^\/\?\s]*)/);
  return match ? `@${match[1]}` : url;
};

const ProjectCard = ({ project, isAdmin, onEdit }) => {
  const { url, title, twitterLink } = project;
  const displayTwitter = extractTwitterUsername(twitterLink);

  const handleCardClick = (e) => {
    if (!isAdmin) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 ${!isAdmin ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      <div className="p-6 space-y-4">
        {isAdmin ? (
          <input
            type="text"
            value={title}
            onChange={(e) => onEdit({ ...project, title: e.target.value })}
            className="font-bold text-xl text-gray-800 w-full bg-gray-100 p-2 rounded-md"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="font-bold text-xl text-gray-800">{title}</h3>
        )}
        {isAdmin && (
          <input
            type="text"
            value={twitterLink}
            onChange={(e) => onEdit({ ...project, twitterLink: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-300 font-semibold"
            onClick={handleLinkClick}
          >
            View Project 
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          {twitterLink && (
            <a
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-600 transition-colors duration-300"
              onClick={handleLinkClick}
            >
              {displayTwitter}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ClaudeSiteGallery = () => {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem('claudeProjects');
    return savedProjects ? JSON.parse(savedProjects) : initialProjects;
  });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('claudeProjects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsAdmin(!isAdmin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  const handleEdit = (updatedProject) => {
    const updatedProjects = projects.map(p => 
      p.url === updatedProject.url ? updatedProject : p
    );
    setProjects(updatedProjects);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-800 tracking-tight">
          Artifacts <span className="text-blue-600">Remixed</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard 
              key={project.url}
              project={project}
              isAdmin={isAdmin}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {isAdmin && (
          <div className="mt-8 text-center text-sm text-gray-600 bg-white rounded-lg shadow-md p-4">
            Admin mode is active. Press Ctrl+Shift+A to toggle.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaudeSiteGallery;