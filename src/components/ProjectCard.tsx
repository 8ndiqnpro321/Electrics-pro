import React from 'react';
import { 
  Cpu, 
  Code2, 
  MessageSquare, 
  Eye, 
  Heart, 
  Layers, 
  Zap, 
  FileCheck2, 
  AlertCircle,
  ExternalLink,
  CircuitBoard,
  Pencil
} from 'lucide-react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onLike: (projectId: string, e: React.MouseEvent) => void;
  onQuickViewDiagram: (project: Project, e: React.MouseEvent) => void;
  onEdit?: (project: Project, e: React.MouseEvent) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onLike,
  onQuickViewDiagram,
  onEdit
}) => {
  const hasCode = Boolean(project.code && project.code.trim().length > 0);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div 
      onClick={() => onSelect(project)}
      className="group relative flex flex-col bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer"
    >
      {/* Top Image Preview Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
        <img 
          src={project.projectPicUrl} 
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category & Voltage Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow">
            {project.category}
          </span>
          <span className="px-2 py-1 rounded-lg text-[11px] font-medium bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800">
            {project.voltageRating}
          </span>
        </div>

        {/* Quick Actions in top right */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => onEdit(project, e)}
              className="p-2 rounded-xl bg-slate-950/80 hover:bg-emerald-500 text-slate-300 hover:text-slate-950 border border-slate-700/80 hover:border-emerald-400 backdrop-blur-md transition-all shadow-md group/edit"
              title="Edit this project"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => onQuickViewDiagram(project, e)}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-700/80 hover:border-cyan-400 backdrop-blur-md transition-all shadow-md group/diag"
            title="Quick preview schematic circuit diagram"
          >
            <CircuitBoard className="w-4 h-4" />
          </button>
        </div>

        {/* CODE STATUS BADGE - Highly visible rule fulfillment */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {hasCode ? (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-md">
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Code Available ({project.codeLanguage || 'Included'})</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/90 text-slate-400 border border-slate-700/60 backdrop-blur-md shadow-md">
              <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hardware Only (No Code Required)</span>
            </div>
          )}

          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getDifficultyColor(project.difficulty)}`}>
            {project.difficulty}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Component Pills */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1 font-medium text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>{project.components.length} Key Components</span>
            </span>
            <span className="text-[11px] text-slate-400">
              By {project.authorName.split(' ')[0]}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-14 overflow-hidden">
            {project.components.slice(0, 3).map((comp) => (
              <span 
                key={comp.id} 
                className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60 truncate max-w-[140px]"
                title={`${comp.name} - ${comp.specification}`}
              >
                {comp.name}
              </span>
            ))}
            {project.components.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-800 text-slate-400">
                +{project.components.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer Meta & Interaction Row */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1" title="Views">
              <Eye className="w-3.5 h-3.5" />
              <span>{project.views}</span>
            </span>

            <button
              type="button"
              onClick={(e) => onLike(project.id, e)}
              className="flex items-center space-x-1 hover:text-rose-400 transition-colors"
              title="Like this project"
            >
              <Heart className={`w-3.5 h-3.5 ${project.likes > 0 ? 'text-rose-400 fill-rose-500/20' : ''}`} />
              <span>{project.likes}</span>
            </button>

            <span className="flex items-center space-x-1" title="Comments & questions for creator">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>{project.comments.length}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => onEdit(project, e)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                title="Edit this project"
              >
                <Pencil className="w-3 h-3 text-emerald-400" />
                <span>Edit</span>
              </button>
            )}

            <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
