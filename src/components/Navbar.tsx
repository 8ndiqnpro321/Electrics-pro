import React from 'react';
import { Zap, Plus, MessageSquare, Layers, Home, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'projects' | 'community';
  setActiveTab: (tab: 'home' | 'projects' | 'community') => void;
  onOpenAddModal: () => void;
  projectCount: number;
  homeCommentCount: number;
  isCreatorMode: boolean;
  setIsCreatorMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  projectCount,
  homeCommentCount,
  isCreatorMode,
  setIsCreatorMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-6 h-6 fill-slate-950 stroke-slate-950 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Electro<span className="text-emerald-400">Hub</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Circuits &amp; Code
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 hidden sm:block">
                Electrical Projects, Schematics &amp; Code Showcase
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Projects Gallery</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'projects' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {projectCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('community')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'community'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Home Comments</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'community' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {homeCommentCount}
              </span>
            </button>
          </nav>

          {/* Action Area: Creator Mode Toggle & Add Project Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Creator Mode Switcher */}
            <button
              type="button"
              onClick={() => setIsCreatorMode(!isCreatorMode)}
              className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isCreatorMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Creator mode to post as author Pusparani Biswal"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isCreatorMode ? 'Creator Active' : 'Viewer Mode'}
              </span>
            </button>

            {/* The ADD PROJECT option requested by the user */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-800/60 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg ${
              activeTab === 'home' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg ${
              activeTab === 'projects' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects ({projectCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('community')}
            className={`flex items-center space-x-1.5 py-1 px-3 rounded-lg ${
              activeTab === 'community' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Home Forum ({homeCommentCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
