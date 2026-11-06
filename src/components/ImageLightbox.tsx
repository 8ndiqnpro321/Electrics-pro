import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Maximize2 } from 'lucide-react';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  subtitle?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  subtitle
}) => {
  const [scale, setScale] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => setScale(1);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div 
        className="w-full max-w-6xl flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-5 py-3 shadow-2xl z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Maximize2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg truncate max-w-xs sm:max-w-md">
              {title}
            </h3>
            {subtitle && (
              <p className="text-slate-400 text-xs sm:text-sm">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 px-2 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button 
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <a 
            href={imageUrl} 
            download={`schematic_${Date.now()}.png`}
            target="_blank" 
            rel="noreferrer"
            className="p-2 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors"
            title="Open / Download Full Resolution"
          >
            <Download className="w-4 h-4" />
          </a>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors ml-2"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div 
        className="flex-1 w-full flex items-center justify-center overflow-auto p-4 my-2 select-none"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="transition-transform duration-200 ease-out flex items-center justify-center max-h-full"
          style={{ transform: `scale(${scale})` }}
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-slate-700/60 bg-slate-900"
            onError={(e) => {
              // fallback if network image fails
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
            }}
          />
        </div>
      </div>

      {/* Bottom Hint */}
      <div 
        className="text-center text-xs text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-800/80"
        onClick={e => e.stopPropagation()}
      >
        Click anywhere outside or press Close to exit • Use zoom controls to inspect circuit details
      </div>
    </div>
  );
};
