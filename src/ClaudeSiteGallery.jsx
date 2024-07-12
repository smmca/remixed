import React, { useState, useEffect } from 'react';

const initialProjects = [
  {
    url: "https://claude.site/artifacts/4625bf30-cca2-4155-bb93-fc6836e95ba1",
    title: "Protect your comrades game",
    twitterLink: "https://x.com/noumi0k/status/1811596344395747603"
  },
  {
    url: "https://claude.site/artifacts/b2802745-a70f-41b1-8219-32ea379de9dc",
    title: "Physics simulator",
    twitterLink: "https://x.com/MattVidPro/status/1811468946060501456"
  },
  {
    url: "https://claude.site/artifacts/0e67b4a8-c21e-40f6-a40f-3a031b46501f",
    title: "Flappy Chicken",
    twitterLink: "https://x.com/moz_ai_tech/status/1811369793766744415"
  },
  {
    url: "https://claude.site/artifacts/6348c2af-d87f-4097-8610-901a4c917adf",
    title: "Fireworks simulator",
    twitterLink: "https://x.com/ninnin_nft/status/1811304308379623544"
  },
  {
    url: "https://claude.site/artifacts/c15705e5-45cb-4c01-a99d-2f22a047e268",
    title: "Korean TTS Prototype",
    twitterLink: "https://x.com/mahler83/status/1811245598739448233"
  },
  {
    url: "https://claude.site/artifacts/e1f3a150-0ea5-47e4-90fe-4a88e8820c73",
    title: "Ship of Theseus",
    twitterLink: "https://x.com/emollick/status/1811251851775365287"
  },
  {
    url: "https://claude.site/artifacts/170a0b0a-3141-44aa-a6f8-54d282029614",
    title: "Psychedelic pixel shader",
    twitterLink: "https://x.com/Westoncb/status/1811215555598409912"
  },
  {
    url: "https://claude.site/artifacts/ab93abc6-e9b2-4e90-894b-3b1c9b84d8e3",
    title: "Abstract 3D",
    twitterLink: "https://x.com/openagi_lab/status/1811186281306845453"
  },
  {
    url: "https://claude.site/artifacts/2e241d6d-54ff-4a89-964f-97a713d7b582",
    title: "Newton fractal generator",
    twitterLink: "https://x.com/robertghrist/status/1811118054581096574"
  },
  {
    url: "https://claude.site/artifacts/7e18124d-c97a-45a5-93f5-c99fad0ebf84",
    title: "Emoji blaster",
    twitterLink: "https://x.com/ninnin_nft/status/1811030210655178787"
  },
  {
    url: "https://claude.site/artifacts/50954fd2-cf7d-485a-92c3-e861df782b72",
    title: "VC Liquidation Preference",
    twitterLink: "https://x.com/emollick/status/1810791731438465094"
  },
  {
    url: "https://claude.site/artifacts/c55cf857-d456-4520-8ee2-206697dfa2a3",
    title: "Claw'd's Closet",
    twitterLink: "https://x.com/AnthropicAI/status/1810698783358882089"
  }
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
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = () => {
      setIsLoading(true);
      try {
        const savedProjects = localStorage.getItem('claudeProjects');
        if (savedProjects) {
          setProjects(JSON.parse(savedProjects));
        } else {
          console.log("No saved projects found, using initial data");
          setProjects(initialProjects);
          localStorage.setItem('claudeProjects', JSON.stringify(initialProjects));
        }
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Using initial data.");
        setProjects(initialProjects);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('claudeProjects', JSON.stringify(projects));
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-800">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-gray-800 tracking-tight">
          Artifacts <span className="text-blue-600">Remixed</span>
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {projects.length > 0 ? (
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
        ) : (
          <p className="text-center text-xl text-gray-800">No projects available. Try refreshing the page.</p>
        )}

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