import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Layers, 
  CircuitBoard, 
  Code2, 
  MessageSquare, 
  Sparkles, 
  Cpu, 
  SlidersHorizontal, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  RotateCcw,
  Scissors,
  Pencil,
  Trash2
} from 'lucide-react';

import { Project, ProjectCategory, ProjectComment, HomeComment } from './types/project';
import { INITIAL_PROJECTS } from './data/initialProjects';
import { INITIAL_HOME_COMMENTS } from './data/initialHomeComments';

import { Navbar } from './components/Navbar';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AddProjectModal } from './components/AddProjectModal';
import { HomeCommentsSection } from './components/HomeCommentsSection';
import { ImageLightbox } from './components/ImageLightbox';

const STORAGE_PROJECTS_KEY = 'electrohub_projects_v2';
const STORAGE_HOME_COMMENTS_KEY = 'electrohub_home_comments_v2';

export default function App() {
  // 1. Projects State (persisted in localStorage)
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved projects from localStorage', e);
    }
    return INITIAL_PROJECTS;
  });

  // 2. Home Tab Comments State (persisted in localStorage)
  const [homeComments, setHomeComments] = useState<HomeComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HOME_COMMENTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading home comments from localStorage', e);
    }
    return INITIAL_HOME_COMMENTS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HOME_COMMENTS_KEY, JSON.stringify(homeComments));
    } catch (e) {
      console.error('Failed to save home comments to localStorage', e);
    }
  }, [homeComments]);

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'community'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatorMode, setIsCreatorMode] = useState(false);

  // Lightbox State
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    subtitle?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    subtitle: ''
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [codeFilter, setCodeFilter] = useState<'all' | 'with-code' | 'hardware-only'>('all');

  // Open modal for adding a new project
  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsAddModalOpen(true);
  };

  // Open modal for editing an existing project
  const handleEditProject = (project: Project, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingProject(project);
    setIsAddModalOpen(true);
  };

  // Delete a single project
  const handleDeleteProject = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  // Cut all current projects to start completely fresh
  const handleCutAllProjects = () => {
    if (confirm('Are you sure you want to cut/remove all projects? This will leave your repository completely clear so you can upload your own custom projects.')) {
      setProjects([]);
      setSelectedProject(null);
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify([]));
    }
  };

  // Restore the original sample electrical projects
  const handleRestoreDefaultProjects = () => {
    if (confirm('Restore the original sample electrical projects collection?')) {
      setProjects(INITIAL_PROJECTS);
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(INITIAL_PROJECTS));
    }
  };

  // Handlers for Project actions
  const handleOpenProject = (project: Project) => {
    // Increment view count
    setProjects(prev => prev.map(p => p.id === project.id ? { ...p, views: p.views + 1 } : p));
    setSelectedProject({ ...project, views: project.views + 1 });
  };

  const handleLikeProject = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleQuickViewDiagram = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setLightbox({
      isOpen: true,
      imageUrl: project.diagramPicUrl,
      title: `${project.title} - Circuit Schematic`,
      subtitle: `Voltage: ${project.voltageRating} • Category: ${project.category}`
    });
  };

  const handleOpenLightbox = (imageUrl: string, title: string, subtitle?: string) => {
    setLightbox({
      isOpen: true,
      imageUrl,
      title,
      subtitle
    });
  };

  // Add or Edit Project in Repository
  const handleSaveProject = (
    projectData: Omit<Project, 'id' | 'createdAt' | 'views' | 'likes' | 'comments'>,
    editProjectId?: string
  ) => {
    if (editProjectId) {
      // Editing existing project
      setProjects(prev => prev.map(p => {
        if (p.id === editProjectId) {
          const updated: Project = {
            ...p,
            ...projectData,
            updatedAt: new Date().toISOString()
          };
          return updated;
        }
        return p;
      }));

      if (selectedProject && selectedProject.id === editProjectId) {
        setSelectedProject(prev => prev ? {
          ...prev,
          ...projectData,
          updatedAt: new Date().toISOString()
        } : null);
      }
      setEditingProject(null);
    } else {
      // Adding new project
      const newProject: Project = {
        ...projectData,
        id: `proj-${Date.now()}`,
        createdAt: new Date().toISOString(),
        views: 1,
        likes: 0,
        comments: []
      };

      setProjects(prev => [newProject, ...prev]);
      setSelectedProject(newProject);
    }
  };

  // Comments for Specific Project
  const handleAddProjectComment = (projectId: string, commentData: Omit<ProjectComment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: ProjectComment = {
      ...commentData,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          comments: [newComment, ...p.comments]
        };
      }
      return p;
    }));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        comments: [newComment, ...prev.comments]
      } : null);
    }
  };

  const handleLikeProjectComment = (projectId: string, commentId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          comments: p.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
        };
      }
      return p;
    }));

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => prev ? {
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c)
      } : null);
    }
  };

  // Home Tab Comments Handler
  const handleAddHomeComment = (commentData: Omit<HomeComment, 'id' | 'createdAt' | 'likes'>) => {
    const newComment: HomeComment = {
      ...commentData,
      id: `hc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    setHomeComments(prev => [newComment, ...prev]);
  };

  const handleLikeHomeComment = (commentId: string) => {
    setHomeComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
  };

  // Reset demo data helper
  const handleResetData = () => {
    if (confirm('Reset to original sample electrical projects and comments?')) {
      setProjects(INITIAL_PROJECTS);
      setHomeComments(INITIAL_HOME_COMMENTS);
      localStorage.removeItem(STORAGE_PROJECTS_KEY);
      localStorage.removeItem(STORAGE_HOME_COMMENTS_KEY);
    }
  };

  // Filtered Projects List
  const filteredProjects = projects.filter(project => {
    // Search query matches title, summary, description, or component names
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      project.title.toLowerCase().includes(query) ||
      project.summary.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.voltageRating.toLowerCase().includes(query) ||
      project.components.some(c => c.name.toLowerCase().includes(query) || c.specification.toLowerCase().includes(query));

    // Category filter
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

    // Code status filter
    const hasCode = Boolean(project.code && project.code.trim().length > 0);
    const matchesCode = 
      codeFilter === 'all' ||
      (codeFilter === 'with-code' && hasCode) ||
      (codeFilter === 'hardware-only' && !hasCode);

    return matchesSearch && matchesCategory && matchesCode;
  });

  const categories: ProjectCategory[] = [
    'All',
    'IoT & Embedded',
    'Power Electronics',
    'Renewable Energy',
    'Robotics & Motor Control',
    'High Voltage & Analog'
  ];

  const projectsWithCodeCount = projects.filter(p => p.code && p.code.trim().length > 0).length;
  const hardwareOnlyCount = projects.length - projectsWithCodeCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={handleOpenAddModal}
        projectCount={projects.length}
        homeCommentCount={homeComments.length}
        isCreatorMode={isCreatorMode}
        setIsCreatorMode={setIsCreatorMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10">

        {/* =========================================================================
            VIEW 1: HOME TAB
           ========================================================================= */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-12 shadow-2xl">
              {/* Subtle background circuit trace glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-6">
                
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Electrical &amp; Electronics Engineering Portal</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  High-Impact Electrical Projects, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Circuit Diagrams</span> &amp; Code
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Explore verified electrical engineering builds, power electronic inverter schematics, solar trackers, and IoT systems. View detailed schematics and access full firmware code when available. Leave comments and questions directly for the creator!
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Explore All Projects ({projects.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-sm shadow-md active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    <span>Add New Project</span>
                  </button>

                  {projects.length > 0 && (
                    <button
                      type="button"
                      onClick={handleCutAllProjects}
                      className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 font-semibold text-xs transition-colors"
                      title="Cut all default projects to upload your own projects from scratch"
                    >
                      <Scissors className="w-4 h-4 text-rose-400" />
                      <span>Cut All Projects</span>
                    </button>
                  )}
                </div>

                {/* Key Feature Guarantees Badge List */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>High-Res Circuit Schematics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Smart Code Tab (Auto-Hides if No Code)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Direct Creator Feedback &amp; Q&amp;A</span>
                  </div>
                </div>

              </div>

              {/* Stats Counters */}
              <div className="mt-8 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">{projects.length}</div>
                  <div className="text-xs text-slate-400 mt-1">Total Projects</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{projectsWithCodeCount}</div>
                  <div className="text-xs text-slate-400 mt-1">With Source Code</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{hardwareOnlyCount}</div>
                  <div className="text-xs text-slate-400 mt-1">Hardware / Analog Schematics</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">{homeComments.length}</div>
                  <div className="text-xs text-slate-400 mt-1">Community Comments</div>
                </div>
              </div>
            </section>

            {/* Featured Projects Carousel / Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <span>Featured Electrical Projects</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Click any card to examine circuit schematics, bill of materials, and code details. Or click Edit to customize!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('projects')}
                  className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>View All ({projects.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                  <p className="text-slate-400 text-sm">No projects currently in repository (all cut). Upload your custom electrical project or restore sample projects.</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={handleOpenAddModal} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs">
                      + Add New Project
                    </button>
                    <button onClick={handleRestoreDefaultProjects} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
                      Restore Defaults
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.slice(0, 3).map((project) => (
                    <ProjectCard 
                      key={project.id}
                      project={project}
                      onSelect={handleOpenProject}
                      onLike={handleLikeProject}
                      onQuickViewDiagram={handleQuickViewDiagram}
                      onEdit={handleEditProject}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* User Rule Feature Highlight Banner */}
            <section className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <CircuitBoard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Smart Code Display Architecture
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    Projects with firmware (like Arduino, ESP32, C, Python) provide a dedicated <strong>Source Code tab</strong> with syntax viewing and download options. For pure hardware circuits without uploaded code, the code tab is automatically hidden from viewers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm whitespace-nowrap shadow transition-colors flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload a Project Now</span>
              </button>
            </section>

            {/* USER REQUESTED: Comment Option on the Home Tab */}
            <section className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>Home Discussion &amp; Feedback Board</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Leave any feedback, questions, or circuit requests for creator Pusparani Biswal.
                  </p>
                </div>
              </div>

              {/* Embedded Home Comments Component */}
              <HomeCommentsSection 
                comments={homeComments}
                onAddComment={handleAddHomeComment}
                onLikeComment={handleLikeHomeComment}
                isCreatorMode={isCreatorMode}
              />
            </section>

          </div>
        )}

        {/* =========================================================================
            VIEW 2: ALL PROJECTS GALLERY (WITH SEARCH, CATEGORY, & CODE FILTERS)
           ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            
            {/* Gallery Top Filter & Search Controls */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-2">
                    <Layers className="w-6 h-6 text-emerald-400" />
                    <span>Electrical Project Repository</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Showing {filteredProjects.length} of {projects.length} electrical engineering circuits &amp; builds
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {projects.length > 0 ? (
                    <button
                      type="button"
                      onClick={handleCutAllProjects}
                      className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 font-semibold text-xs transition-colors"
                      title="Cut all default projects so you can upload your own projects from scratch"
                    >
                      <Scissors className="w-3.5 h-3.5 text-rose-400" />
                      <span>Cut All Projects</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRestoreDefaultProjects}
                      className="flex items-center space-x-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/30 font-semibold text-xs transition-colors"
                      title="Restore the default sample projects"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Restore Default Projects</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by title, component (e.g. ESP32, IRF3205, Arduino, LDR), voltage rating..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter Chips & Code Toggle */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
                
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Code Availability Filter */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setCodeFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      codeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All Types
                  </button>

                  <button
                    type="button"
                    onClick={() => setCodeFilter('with-code')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      codeFilter === 'with-code' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>With Code ({projectsWithCodeCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCodeFilter('hardware-only')}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
                      codeFilter === 'hardware-only' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Hardware Only ({hardwareOnlyCount})</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Projects Grid */}
            {projects.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="p-4 rounded-full bg-slate-950 inline-flex text-rose-400 border border-slate-800 shadow-inner">
                  <Scissors className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">All Default Projects Cut</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your project repository is completely clear and empty! You can now upload your own projects with diagrams, photos, and code.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload Your First Project</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRestoreDefaultProjects}
                    className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Restore Sample Projects</span>
                  </button>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <CircuitBoard className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No projects found matching filter</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Try adjusting your search terms or category filter.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setCodeFilter('all'); }}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                  >
                    Add Project
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project}
                    onSelect={handleOpenProject}
                    onLike={handleLikeProject}
                    onQuickViewDiagram={handleQuickViewDiagram}
                    onEdit={handleEditProject}
                  />
                ))}

                {/* Always show an "Add Next Project" CTA card at end of grid */}
                <div 
                  onClick={handleOpenAddModal}
                  className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group bg-slate-950/40 hover:bg-slate-900/40 transition-all min-h-[360px]"
                >
                  <div className="p-4 rounded-full bg-slate-900 group-hover:bg-emerald-500 text-slate-400 group-hover:text-slate-950 transition-colors mb-4">
                    <Plus className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Upload Another Project
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs">
                    Add title, circuit diagram, hardware photo, and optional code snippet.
                  </p>
                  <span className="mt-4 px-3 py-1.5 rounded-lg bg-slate-800 text-emerald-400 text-xs font-bold group-hover:bg-emerald-500/20 transition-colors">
                    + Tap to Add Project
                  </span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            VIEW 3: DEDICATED COMMUNITY FORUM / HOME COMMENTS VIEW
           ========================================================================= */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <HomeCommentsSection 
              comments={homeComments}
              onAddComment={handleAddHomeComment}
              onLikeComment={handleLikeHomeComment}
              isCreatorMode={isCreatorMode}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">ElectroHub</span>
            <span>• Electrical Engineering Project &amp; Schematic Portal</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center space-x-1 hover:text-slate-300 transition-colors"
              title="Reset sample projects to default state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
            <span>Lead: Pusparani Biswal</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: PROJECT DETAIL MODAL (Handles conditional code tab, project comments, and Edit/Delete) */}
      <ProjectDetailModal 
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onAddComment={handleAddProjectComment}
        onLikeComment={handleLikeProjectComment}
        onLikeProject={handleLikeProject}
        onOpenLightbox={handleOpenLightbox}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
        isCreatorMode={isCreatorMode}
      />

      {/* MODAL 2: ADD / EDIT PROJECT MODAL (Allows creator to upload new or edit existing projects) */}
      <AddProjectModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProject(null);
        }}
        onSaveProject={handleSaveProject}
        editingProject={editingProject}
        defaultAuthor={isCreatorMode ? 'Pusparani Biswal' : 'Pusparani Biswal'}
        defaultEmail="pusparanibiswal26@gmail.com"
      />

      {/* MODAL 3: FULLSCREEN IMAGE LIGHTBOX FOR HIGH-RES SCHEMATICS */}
      <ImageLightbox 
        isOpen={lightbox.isOpen}
        onClose={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
        imageUrl={lightbox.imageUrl}
        title={lightbox.title}
        subtitle={lightbox.subtitle}
      />

    </div>
  );
}
