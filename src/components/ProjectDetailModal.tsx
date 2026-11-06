import React, { useState } from 'react';
import { 
  X, 
  CircuitBoard, 
  Code2, 
  Cpu, 
  FileText, 
  Camera, 
  MessageSquare, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Send, 
  Heart, 
  User, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Eye,
  Clock,
  BarChart3,
  Pencil,
  Trash2
} from 'lucide-react';
import { Project, ProjectComment } from '../types/project';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (projectId: string, comment: Omit<ProjectComment, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeComment: (projectId: string, commentId: string) => void;
  onLikeProject: (projectId: string) => void;
  onOpenLightbox: (imageUrl: string, title: string, subtitle?: string) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  isCreatorMode: boolean;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onAddComment,
  onLikeComment,
  onLikeProject,
  onOpenLightbox,
  onEditProject,
  onDeleteProject,
  isCreatorMode
}) => {
  if (!isOpen || !project) return null;

  const hasCode = Boolean(project.code && project.code.trim().length > 0);

  // Define tabs dynamically based on user rule:
  // "where viewers can get the code or if any code is not uploaded then the code will not showimg in the project tab"
  type TabType = 'schematic' | 'photos' | 'overview' | 'components' | 'code' | 'comments';
  
  const [activeTab, setActiveTab] = useState<TabType>('schematic');
  const [copiedCode, setCopiedCode] = useState(false);

  // New Comment Form State
  const [authorName, setAuthorName] = useState(isCreatorMode ? 'Pusparani Biswal' : '');
  const [authorRole, setAuthorRole] = useState<ProjectComment['authorRole']>(isCreatorMode ? 'Creator' : 'Student');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [commentSubmittedNotice, setCommentSubmittedNotice] = useState(false);

  // If currently selected tab is code, but project has no code, fallback to schematic
  const currentTab = (!hasCode && activeTab === 'code') ? 'schematic' : activeTab;

  const handleCopyCode = () => {
    if (!project.code) return;
    navigator.clipboard.writeText(project.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadCode = () => {
    if (!project.code) return;
    const blob = new Blob([project.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = project.codeFileName || `${project.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !authorName.trim()) return;

    onAddComment(project.id, {
      projectId: project.id,
      authorName: authorName.trim(),
      authorRole: authorRole,
      isCreator: isCreatorMode || authorName.toLowerCase().includes('pusparani'),
      message: commentText.trim(),
      rating: rating
    });

    setCommentText('');
    setCommentSubmittedNotice(true);
    setTimeout(() => setCommentSubmittedNotice(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {project.category}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                ⚡ {project.voltageRating}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                Level: {project.difficulty}
              </span>
              {hasCode ? (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Code2 className="w-3 h-3" />
                  Code Available
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60 flex items-center gap-1">
                  <CircuitBoard className="w-3 h-3 text-cyan-400" />
                  Hardware Only
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {project.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 pt-1">
              <span>
                Authored by <span className="text-emerald-400 font-semibold">{project.authorName}</span>
                {project.authorContact && (
                  <span className="text-slate-500 ml-1">({project.authorContact})</span>
                )}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-300" title="Total Views">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <strong className="text-white font-mono">{project.views.toLocaleString()}</strong> views
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-300" title="Likes">
                <Heart className={`w-3.5 h-3.5 ${project.likes > 0 ? 'text-rose-400 fill-rose-500/20' : 'text-slate-400'}`} />
                <strong className="text-white font-mono">{project.likes.toLocaleString()}</strong> likes
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-slate-300" title="Last updated based on createdAt">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Last updated: <strong className="text-white font-mono">{new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</strong></span>
              </span>
            </div>
          </div>

          {/* Close & Action Buttons */}
          <div className="flex items-center space-x-2">
            {onEditProject && (
              <button
                type="button"
                onClick={() => onEditProject(project)}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 text-xs font-semibold transition-all shadow-sm active:scale-95"
                title="Edit this project's details, circuit diagram, or code"
              >
                <Pencil className="w-3.5 h-3.5 text-emerald-400" />
                <span>Edit Project</span>
              </button>
            )}

            {onDeleteProject && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                    onDeleteProject(project.id);
                  }
                }}
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 flex items-center gap-1 text-xs transition-colors"
                title="Delete this project"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Delete</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onLikeProject(project.id)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-400 border border-slate-700 flex items-center gap-1.5 text-xs transition-colors"
              title="Like this project"
            >
              <Heart className={`w-4 h-4 ${project.likes > 0 ? 'text-rose-500 fill-rose-500/30' : ''}`} />
              <span className="hidden sm:inline">{project.likes}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar - CODE TAB IS CONDITIONALLY INCLUDED */}
        <div className="flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 bg-slate-950/40 border-b border-slate-800 overflow-x-auto text-xs sm:text-sm">
          
          <button
            type="button"
            onClick={() => setActiveTab('schematic')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentTab === 'schematic'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CircuitBoard className="w-4 h-4" />
            <span>Circuit Diagram</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentTab === 'photos'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Project Picture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Overview &amp; Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('components')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentTab === 'components'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Components ({project.components.length})</span>
          </button>

          {/* CRITICAL REQUIREMENT IMPLEMENTATION:
              "where viewers can get the code or if any code is not uploaded then the code will not showimg in the project tab"
              The button below is strictly rendered ONLY when hasCode === true! */}
          {hasCode && (
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                currentTab === 'code'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Source Code</span>
              <span className="text-[10px] px-1 rounded bg-emerald-900/50 text-emerald-200">
                {project.codeLanguage || 'C++'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              currentTab === 'comments'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Comments &amp; Q&amp;A</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              currentTab === 'comments' ? 'bg-slate-950/40 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}>
              {project.comments.length}
            </span>
          </button>
        </div>

        {/* Tab Body Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: CIRCUIT DIAGRAM & SCHEMATIC */}
          {currentTab === 'schematic' && (
            <div className="space-y-6">
              <div className="relative group bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                <img 
                  src={project.diagramPicUrl} 
                  alt={`${project.title} Circuit Diagram`}
                  className="w-full max-h-[500px] object-contain mx-auto py-2 transition-transform duration-300 group-hover:scale-[1.02]"
                />
                
                {/* Floating overlay actions */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(project.diagramPicUrl, `${project.title} - Circuit Schematic`, 'Inspect complete connections, values, and pin configurations')}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-emerald-400 backdrop-blur-md text-xs font-semibold shadow-lg transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Fullscreen / Zoom</span>
                  </button>
                  <a
                    href={project.diagramPicUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="circuit_diagram.jpg"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold shadow-lg transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Diagram</span>
                  </a>
                </div>
              </div>

              {/* Pinouts and Connection Instructions */}
              {project.wiringInstructions && (
                <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Wiring Connections &amp; Pinout Guide</span>
                  </h4>
                  <pre className="text-xs sm:text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed bg-slate-900/80 p-4 rounded-lg border border-slate-800">
                    {project.wiringInstructions}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROJECT PICTURE / HARDWARE BUILD */}
          {currentTab === 'photos' && (
            <div className="space-y-6">
              <div className="relative group bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                <img 
                  src={project.projectPicUrl} 
                  alt={`${project.title} Hardware Prototype`}
                  className="w-full max-h-[500px] object-contain mx-auto py-2 transition-transform duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(project.projectPicUrl, `${project.title} - Hardware Prototype`, 'High-definition physical prototype photo')}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-emerald-400 backdrop-blur-md text-xs font-semibold shadow-lg transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Zoom Photo</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Physical Hardware Build</h4>
                  <p className="text-xs text-slate-400">Captured and assembled in lab testing for {project.title}.</p>
                </div>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/20">
                  Verified Bench Test
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW & SPECS */}
          {currentTab === 'overview' && (
            <div className="space-y-6">

              {/* PROJECT STATS SECTION */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Project Stats</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Engagement
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Stat 1: Total Views */}
                  <div className="flex items-center space-x-3.5 bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                    <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Views</span>
                      <span className="text-xl font-extrabold text-white font-mono tracking-tight">
                        {project.views.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Stat 2: Total Likes */}
                  <div className="flex items-center space-x-3.5 bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-rose-500/30 transition-colors">
                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Heart className="w-5 h-5 fill-rose-500/20" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Likes</span>
                      <span className="text-xl font-extrabold text-white font-mono tracking-tight">
                        {project.likes.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Stat 3: Last Updated based on createdAt */}
                  <div className="flex items-center space-x-3.5 bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-amber-500/30 transition-colors">
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Last Updated</span>
                      <span className="text-sm font-semibold text-slate-200 block font-mono">
                        {new Date(project.updatedAt || project.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {new Date(project.updatedAt || project.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Project Overview</span>
                </h3>
                <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed space-y-3">
                  {project.description}
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Operating Voltage / Rating</span>
                  <p className="text-sm font-mono font-bold text-emerald-400">{project.voltageRating}</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Skill Level</span>
                  <p className="text-sm font-semibold text-slate-200">{project.difficulty}</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Firmware / Code Status</span>
                  <p className="text-sm font-semibold text-slate-200">
                    {hasCode ? `Available (${project.codeLanguage})` : 'Hardware Only (No code)'}
                  </p>
                </div>
              </div>

              {/* Safety notice for electrical projects */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3 text-amber-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>
                  <strong className="font-semibold text-amber-300">Electrical Engineering Notice:</strong> Always observe electrical safety regulations, double-check polarity, verify electrolytic capacitor voltage ratings, and use appropriate isolation when testing high voltage or mains AC circuits.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: COMPONENTS (BILL OF MATERIALS) */}
          {currentTab === 'components' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Bill of Materials (BOM)</h3>
                  <p className="text-xs text-slate-400">List of all required active, passive, and mechanical components.</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {project.components.length} Items Total
                </span>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Component Name</th>
                      <th className="py-3 px-4">Specification / Value</th>
                      <th className="py-3 px-4 text-right">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {project.components.map((comp, idx) => (
                      <tr key={comp.id || idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-white">{comp.name}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400/90">{comp.specification}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-300 font-bold">{comp.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SOURCE CODE - ONLY DISPLAYED IF CODE EXISTS! */}
          {hasCode && currentTab === 'code' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-mono font-bold text-white">
                      {project.codeFileName || 'firmware_code.ino'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Language: <span className="text-emerald-400 font-semibold">{project.codeLanguage || 'Arduino (C++)'}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCode}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              {/* Formatted Code Block with Line Numbers */}
              <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs sm:text-sm">
                <div className="max-h-[500px] overflow-auto p-4 flex">
                  {/* Line Numbers */}
                  <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800">
                    {project.code?.split('\n').map((_, index) => (
                      <div key={index} className="leading-6">{index + 1}</div>
                    ))}
                  </div>

                  {/* Code Body */}
                  <pre className="text-emerald-300 pl-4 leading-6 whitespace-pre overflow-x-auto flex-1">
                    {project.code}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PROJECT-SPECIFIC COMMENTS (DIRECT FEEDBACK TO CREATOR) */}
          {currentTab === 'comments' && (
            <div className="space-y-6">
              
              {/* Submission Form for Commenting on This Project */}
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Ask a Question or Give Feedback on this Project</span>
                  </h4>
                  <span className="text-xs text-slate-400">
                    Direct message to creator <strong className="text-emerald-400">{project.authorName}</strong>
                  </span>
                </div>

                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. Vikram or Dr. Roy"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Your Profile / Role</label>
                      <select
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Student">Engineering Student</option>
                        <option value="Electrical Engineer">Electrical / Electronics Engineer</option>
                        <option value="Hobbyist">Maker / Hobbyist</option>
                        <option value="Researcher">Academic / Researcher</option>
                        <option value="Creator">Project Creator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Comment, Question or Modification Suggestion
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Ask the creator about the circuit components, substitutions, code optimization, or share your build results..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span>Rate Project:</span>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-sm transition-transform hover:scale-110 ${star <= rating ? 'text-amber-400' : 'text-slate-700'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Comment</span>
                    </button>
                  </div>
                </form>

                {commentSubmittedNotice && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Your comment has been submitted and visible to the creator!</span>
                  </div>
                )}
              </div>

              {/* List of Existing Project Comments */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Discussion Thread ({project.comments.length})
                </h4>

                {project.comments.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800 text-slate-400 text-xs sm:text-sm">
                    No comments yet on this project. Be the first to share your thoughts or ask a question!
                  </div>
                ) : (
                  project.comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className={`p-4 rounded-xl border transition-all ${
                        comment.isCreator 
                          ? 'bg-emerald-950/20 border-emerald-500/40' 
                          : 'bg-slate-950/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            comment.isCreator 
                              ? 'bg-emerald-500 text-slate-950' 
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs sm:text-sm font-semibold text-white">
                                {comment.authorName}
                              </span>
                              {comment.isCreator && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                                  Creator
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500">
                                • {comment.authorRole}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Like button on comment */}
                        <button
                          type="button"
                          onClick={() => onLikeComment(project.id, comment.id)}
                          className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-xs border border-slate-800 transition-colors"
                        >
                          <Heart className={`w-3 h-3 ${comment.likes > 0 ? 'text-rose-500 fill-rose-500/20' : ''}`} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed pl-10">
                        {comment.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Project Active in ElectroHub Archive</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
