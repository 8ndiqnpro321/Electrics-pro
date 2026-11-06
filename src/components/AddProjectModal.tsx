import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  CircuitBoard, 
  Code2, 
  Zap, 
  Sparkles, 
  Check, 
  AlertCircle,
  FileCode,
  Eye,
  Sliders,
  Edit3
} from 'lucide-react';
import { Project, ProjectCategory, DifficultyLevel, ComponentItem } from '../types/project';
import { PRESET_PROJECT_PICS, PRESET_DIAGRAM_PICS } from '../utils/presets';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Omit<Project, 'id' | 'createdAt' | 'views' | 'likes' | 'comments'>, editProjectId?: string) => void;
  editingProject?: Project | null;
  defaultAuthor?: string;
  defaultEmail?: string;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  editingProject,
  defaultAuthor = 'Pusparani Biswal',
  defaultEmail = 'pusparanibiswal26@gmail.com'
}) => {
  const isEditing = Boolean(editingProject);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('IoT & Embedded');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [voltageRating, setVoltageRating] = useState('5V - 12V DC');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  
  // Media: Project Photo
  const [projectPicUrl, setProjectPicUrl] = useState(PRESET_PROJECT_PICS[0].url);
  const [showProjectPresets, setShowProjectPresets] = useState(false);

  // Media: Diagram / Circuit Schematic
  const [diagramPicUrl, setDiagramPicUrl] = useState(PRESET_DIAGRAM_PICS[0].url);
  const [showDiagramPresets, setShowDiagramPresets] = useState(false);

  // Components (Bill of Materials)
  const [components, setComponents] = useState<ComponentItem[]>([
    { id: '1', name: 'Microcontroller / Board', specification: 'ESP32 / Arduino / IC', quantity: 1 },
    { id: '2', name: 'Primary Sensor / Driver', specification: 'Standard Module', quantity: 1 },
    { id: '3', name: 'Passive Components', specification: 'Resistors & Capacitors network', quantity: '1 set' }
  ]);

  // Wiring Guide
  const [wiringInstructions, setWiringInstructions] = useState('');

  // Code Details (OPTIONAL - as requested by user)
  const [hasCodeToggle, setHasCodeToggle] = useState<boolean>(true);
  const [code, setCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState<Project['codeLanguage']>('Arduino (C++)');
  const [codeFileName, setCodeFileName] = useState('firmware_sketch.ino');

  // Creator Info
  const [authorName, setAuthorName] = useState(defaultAuthor);
  const [authorContact, setAuthorContact] = useState(defaultEmail);

  // Error validation
  const [errorMsg, setErrorMsg] = useState('');

  // Sync form when editing an existing project or opening new form
  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setSummary(editingProject.summary);
      setDescription(editingProject.description);
      setVoltageRating(editingProject.voltageRating);
      setDifficulty(editingProject.difficulty);
      setProjectPicUrl(editingProject.projectPicUrl);
      setDiagramPicUrl(editingProject.diagramPicUrl);
      setComponents(
        editingProject.components && editingProject.components.length > 0
          ? editingProject.components
          : [{ id: '1', name: 'Microcontroller / Board', specification: 'Standard IC', quantity: 1 }]
      );
      setWiringInstructions(editingProject.wiringInstructions || '');
      const hasCode = Boolean(editingProject.code && editingProject.code.trim().length > 0);
      setHasCodeToggle(hasCode);
      setCode(editingProject.code || '');
      setCodeLanguage(editingProject.codeLanguage || 'Arduino (C++)');
      setCodeFileName(editingProject.codeFileName || 'firmware_sketch.ino');
      setAuthorName(editingProject.authorName || defaultAuthor);
      setAuthorContact(editingProject.authorContact || defaultEmail);
    } else {
      setTitle('');
      setCategory('IoT & Embedded');
      setSummary('');
      setDescription('');
      setVoltageRating('5V - 12V DC');
      setDifficulty('Intermediate');
      setProjectPicUrl(PRESET_PROJECT_PICS[0].url);
      setDiagramPicUrl(PRESET_DIAGRAM_PICS[0].url);
      setComponents([
        { id: '1', name: 'Microcontroller / Board', specification: 'ESP32 / Arduino / IC', quantity: 1 },
        { id: '2', name: 'Primary Sensor / Driver', specification: 'Standard Module', quantity: 1 },
        { id: '3', name: 'Passive Components', specification: 'Resistors & Capacitors network', quantity: '1 set' }
      ]);
      setWiringInstructions('');
      setHasCodeToggle(true);
      setCode('');
      setCodeLanguage('Arduino (C++)');
      setCodeFileName('firmware_sketch.ino');
      setAuthorName(defaultAuthor);
      setAuthorContact(defaultEmail);
    }
    setErrorMsg('');
  }, [editingProject, isOpen, defaultAuthor, defaultEmail]);

  // File Upload Handlers (converts local file to DataURL for immediate preview & persistence)
  const handleProjectPicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProjectPicUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagramPicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDiagramPicUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Component Row Management
  const handleAddComponentRow = () => {
    setComponents(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: '',
        specification: '',
        quantity: 1
      }
    ]);
  };

  const handleUpdateComponent = (index: number, field: keyof ComponentItem, value: any) => {
    setComponents(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemoveComponent = (index: number) => {
    setComponents(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Please enter a project title');
      return;
    }
    if (!summary.trim()) {
      setErrorMsg('Please provide a brief summary of the project');
      return;
    }
    if (!projectPicUrl.trim()) {
      setErrorMsg('Please provide a project picture');
      return;
    }
    if (!diagramPicUrl.trim()) {
      setErrorMsg('Please provide a circuit diagram');
      return;
    }

    // Clean code: If toggle is off or code is empty, set code to empty string
    const finalCode = hasCodeToggle && code.trim().length > 0 ? code.trim() : '';

    onSaveProject({
      title: title.trim(),
      category,
      summary: summary.trim(),
      description: description.trim() || summary.trim(),
      voltageRating: voltageRating.trim() || '5V DC',
      difficulty,
      projectPicUrl: projectPicUrl.trim(),
      diagramPicUrl: diagramPicUrl.trim(),
      components: components.filter(c => c.name.trim().length > 0),
      wiringInstructions: wiringInstructions.trim(),
      code: finalCode, // If empty, viewers will NOT see the code tab!
      codeLanguage: finalCode ? codeLanguage : undefined,
      codeFileName: finalCode ? codeFileName.trim() : undefined,
      authorName: authorName.trim() || defaultAuthor,
      authorContact: authorContact.trim() || defaultEmail
    }, editingProject?.id);

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">
                {isEditing ? `Edit Project: ${editingProject?.title}` : 'Upload New Electrical Project'}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {isEditing 
                  ? 'Update circuit schematics, build photos, specifications, or code' 
                  : 'Share your circuit schematics, hardware build photos, and optional code'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <span>1. Project Overview &amp; Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Project Title *
                </label>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Smart Energy Monitor or Solar Tracker with Servo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="IoT & Embedded">IoT &amp; Embedded</option>
                  <option value="Power Electronics">Power Electronics</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Robotics & Motor Control">Robotics &amp; Motor Control</option>
                  <option value="High Voltage & Analog">High Voltage &amp; Analog</option>
                  <option value="Automation & Sensors">Automation &amp; Sensors</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Operating Voltage / Power Rating
                </label>
                <input 
                  type="text"
                  value={voltageRating}
                  onChange={e => setVoltageRating(e.target.value)}
                  placeholder="e.g. 230V AC, 12V DC 2A, 5V USB"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="Beginner">Beginner (Simple sensors / basic circuits)</option>
                  <option value="Intermediate">Intermediate (Microcontrollers &amp; modules)</option>
                  <option value="Advanced">Advanced (High voltage / power electronics)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Short Summary (Card Preview) *
              </label>
              <textarea 
                rows={2}
                required
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="A compelling 1-2 sentence summary that viewers will see on the project card..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Full Description &amp; Technical Explanation
              </label>
              <textarea 
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain circuit working principle, test results, design considerations, safety steps..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Visual Media (Project Picture & Circuit Diagram) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <span>2. Visual Media: Project Pic &amp; Circuit Diagram</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Media A: Real Project Picture */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real Project Picture *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowProjectPresets(!showProjectPresets)}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    {showProjectPresets ? 'Hide presets' : 'Choose preset image'}
                  </button>
                </div>

                {/* Preview Thumbnail */}
                <div className="h-36 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800 relative">
                  <img 
                    src={projectPicUrl} 
                    alt="Project Preview" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-950/80 text-slate-300">
                    Project Pic Preview
                  </span>
                </div>

                {/* Input or File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={projectPicUrl}
                      onChange={e => setProjectPicUrl(e.target.value)}
                      placeholder="Image URL https://..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProjectPicUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {showProjectPresets && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {PRESET_PROJECT_PICS.map((preset, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setProjectPicUrl(preset.url);
                            setShowProjectPresets(false);
                          }}
                          className="cursor-pointer h-14 rounded overflow-hidden border border-slate-700 hover:border-emerald-400 relative group"
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <span className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-medium p-1 text-center">
                            {preset.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Media B: Circuit Diagram / Schematic */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Circuit Diagram / Schematic *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDiagramPresets(!showDiagramPresets)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    {showDiagramPresets ? 'Hide presets' : 'Choose preset diagram'}
                  </button>
                </div>

                {/* Preview Thumbnail */}
                <div className="h-36 w-full rounded-lg overflow-hidden bg-slate-900 border border-slate-800 relative">
                  <img 
                    src={diagramPicUrl} 
                    alt="Diagram Preview" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-950/80 text-cyan-300">
                    Schematic Preview
                  </span>
                </div>

                {/* Input or File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={diagramPicUrl}
                      onChange={e => setDiagramPicUrl(e.target.value)}
                      placeholder="Schematic Image URL https://..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleDiagramPicUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {showDiagramPresets && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      {PRESET_DIAGRAM_PICS.map((preset, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setDiagramPicUrl(preset.url);
                            setShowDiagramPresets(false);
                          }}
                          className="cursor-pointer h-14 rounded overflow-hidden border border-slate-700 hover:border-cyan-400 relative group"
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <span className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[9px] text-white font-medium p-1 text-center">
                            {preset.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Bill of Materials & Components */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                3. Bill of Materials (BOM) &amp; Wiring
              </h3>
              <button
                type="button"
                onClick={handleAddComponentRow}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Component Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {components.map((comp, idx) => (
                <div key={comp.id || idx} className="flex items-center space-x-2">
                  <input 
                    type="text" 
                    placeholder="Component Name (e.g. ESP32 DevKit)" 
                    value={comp.name}
                    onChange={e => handleUpdateComponent(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <input 
                    type="text" 
                    placeholder="Specification (e.g. 30-Pin CH340)" 
                    value={comp.specification}
                    onChange={e => handleUpdateComponent(idx, 'specification', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  <input 
                    type="text" 
                    placeholder="Qty" 
                    value={comp.quantity}
                    onChange={e => handleUpdateComponent(idx, 'quantity', e.target.value)}
                    className="w-16 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs text-center"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveComponent(idx)}
                    disabled={components.length <= 1}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Wiring Connections / Pinout Guide (Optional)
              </label>
              <textarea 
                rows={2}
                value={wiringInstructions}
                onChange={e => setWiringInstructions(e.target.value)}
                placeholder="e.g. Sensor VCC -> 5V, GND -> GND, Data Out -> Pin D4..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Source Code (OPTIONAL - with clear toggle & instructions) */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>4. Source Code (Optional)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  If this is a hardware-only circuit or no code is uploaded, the Code tab will not show to viewers.
                </p>
              </div>

              {/* Toggle Has Code */}
              <button
                type="button"
                onClick={() => setHasCodeToggle(!hasCodeToggle)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  hasCodeToggle 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <span>{hasCodeToggle ? 'Code Included' : 'No Code (Hardware Only)'}</span>
              </button>
            </div>

            {hasCodeToggle ? (
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Programming Language
                    </label>
                    <select
                      value={codeLanguage}
                      onChange={e => setCodeLanguage(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    >
                      <option value="Arduino (C++)">Arduino (C++)</option>
                      <option value="C / Embedded C">C / Embedded C</option>
                      <option value="Python">Python</option>
                      <option value="MicroPython">MicroPython</option>
                      <option value="Ladder Logic">Ladder Logic</option>
                      <option value="MATLAB / Simulink">MATLAB / Simulink</option>
                      <option value="Other">Other Script</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Source File Name
                    </label>
                    <input 
                      type="text"
                      value={codeFileName}
                      onChange={e => setCodeFileName(e.target.value)}
                      placeholder="e.g. SolarTracker_Main.ino"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Paste Code Script
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {code.split('\n').length} lines
                    </span>
                  </div>
                  <textarea 
                    rows={8}
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="// Paste your Arduino sketch, C firmware, or Python control code here..."
                    className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-xs font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400">
                🔒 <strong>Hardware-Only Mode Active:</strong> No code will be attached to this project. When viewers open this project, the Code tab will be completely omitted from their navigation, keeping the focus on your circuit diagram and hardware photos.
              </div>
            )}
          </div>

          {/* Section 5: Author Info */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              5. Creator Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Creator Name</label>
                <input 
                  type="text" 
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Email / Handle</label>
                <input 
                  type="text" 
                  value={authorContact}
                  onChange={e => setAuthorContact(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all"
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Project Changes</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Publish Project to Portal</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
