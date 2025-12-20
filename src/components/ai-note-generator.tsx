import React, { useState, useEffect } from 'react';
import { Note, NoteGenerationConfig, GeneratedNoteContent } from '../types';
import { generateSmartNotes } from '../services/dashboard-ai';
import { 
  Sparkles, 
  X, 
  BookOpen, 
  Zap, 
  FileText, 
  BrainCircuit, 
  CheckCircle2, 
  Loader2, 
  Languages, 
  Layers,
  ArrowRight,
  Download,
  Copy,
  Share2,
  FileCheck,
  PenTool,
  Monitor,
  Edit,
  Save
} from 'lucide-react';
import { useToast } from '../context/toast-context';

interface AiNoteGeneratorProps {
  note: Note;
  onClose: () => void;
}

const steps = [
  "Ingesting document & OCR...",
  "Detecting structure & topics...",
  "Analyzing importance & exam patterns...",
  "Generating Zero-Hallucination notes..."
];

// Helper to parse text with basic bold/math styles
const parseInlineStyles = (text: string, isHandwritten: boolean) => {
  const parts = text.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      if (isHandwritten) {
        // Highlighting in handwritten mode: Soft highlighter effect
        return <strong key={i} className="font-bold text-[#2E2E2E] bg-[#FFDAC1]/50 dark:bg-[#FFDAC1]/20 px-1 rounded-sm decoration-clone">{content}</strong>;
      }
      return <strong key={i} className="font-bold text-slate-900 dark:text-white">{content}</strong>;
    }
    if (part.startsWith('$') && part.endsWith('$')) {
      const content = part.replace(/\$/g, '');
      if (isHandwritten) {
        // Handwritten Math: No mono font, slight size bump, specific color
        return <span key={i} className="font-hindi font-bold text-lg text-[#2E2E2E] dark:text-slate-200 mx-1">{content}</span>;
      }
      return <span key={i} className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-violet-600 dark:text-violet-400 mx-1">{content}</span>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      if (isHandwritten) {
        return <span key={i} className="border-b-2 border-dashed border-red-300 text-[#2E2E2E] dark:text-slate-300 mx-1">{content}</span>;
      }
      return <code key={i} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1 rounded text-red-500">{content}</code>;
    }
    return part;
  });
};

// Helper to render markdown-like structure
const renderMarkdown = (text: string, isHandwritten: boolean) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    // H1
    if (line.trim().startsWith('# ')) {
      if (isHandwritten) {
        return (
            <h3 key={index} className="text-4xl font-hand font-bold text-[#2E2E2E] dark:text-slate-100 mt-8 mb-4 text-center leading-[3rem]">
                <span className="border-b-4 border-double border-[#2E2E2E]/20 inline-block pb-1">{line.replace('# ', '')}</span>
            </h3>
        );
      }
      return <h3 key={index} className="text-2xl font-extrabold text-slate-900 dark:text-white mt-6 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">{line.replace('# ', '')}</h3>;
    }
    // H2
    if (line.trim().startsWith('## ')) {
      if (isHandwritten) {
          return (
            <h4 key={index} className="text-2xl font-hand font-bold text-[#2E2E2E] dark:text-slate-200 mt-6 mb-2 flex items-center gap-2">
                <span className="bg-[#B5EAD7] dark:bg-[#B5EAD7]/30 px-3 skew-x-[-10deg]">{line.replace('## ', '')}</span>
            </h4>
          );
      }
      return <h4 key={index} className="text-lg font-bold text-slate-800 dark:text-white mt-5 mb-2 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-violet-500"></div>{line.replace('## ', '')}</h4>;
    }
    // Blockquote
    if (line.trim().startsWith('> ')) {
       if (isHandwritten) {
           return (
               <div key={index} className="ml-4 pl-4 border-l-4 border-[#A7C7E7] my-4 text-[#2E2E2E] dark:text-slate-300 font-hand text-xl">
                   {parseInlineStyles(line.replace('> ', ''), true)}
               </div>
           );
       }
       return (
         <div key={index} className="border-l-4 border-violet-500 bg-violet-50 dark:bg-violet-900/10 p-4 rounded-r-xl my-4 text-slate-700 dark:text-slate-300 italic">
           {parseInlineStyles(line.replace('> ', ''), false)}
         </div>
       )
    }
    // Horizontal Rule
    if (line.trim() === '---') {
        if (isHandwritten) {
            return <div key={index} className="my-6 border-t-2 border-[#2E2E2E] opacity-20 transform -rotate-1"></div>;
        }
        return <div key={index} className="my-6 border-t border-slate-200 dark:border-slate-700 border-dashed"></div>
    }
    // List Items
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      const content = line.trim().replace(/^[*|-] /, '');
      if (isHandwritten) {
          return (
            <div key={index} className="flex gap-3 mb-2 ml-4">
                <span className="text-[#2E2E2E] font-bold mt-1 text-lg">→</span>
                <p className="text-[#2E2E2E] dark:text-slate-200 leading-[28px] font-hand text-xl">
                    {parseInlineStyles(content, true)}
                </p>
            </div>
          );
      }
      return (
        <div key={index} className="flex gap-3 mb-2 ml-2">
          <span className="text-violet-500 font-bold mt-1.5 text-xs">●</span>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
            {parseInlineStyles(content, false)}
          </p>
        </div>
      );
    }
    // Indented List Items (Sub-list)
    if (line.startsWith('    *') || line.startsWith('\t*')) {
        const content = line.trim().replace(/^\*/, '');
        if (isHandwritten) {
            return (
                <div key={index} className="flex gap-3 mb-1 ml-12">
                    <span className="text-[#2E2E2E] font-bold mt-1 text-sm">-</span>
                    <p className="text-[#2E2E2E] dark:text-slate-300 leading-[28px] font-hand text-lg">
                        {parseInlineStyles(content, true)}
                    </p>
                </div>
            );
        }
        return (
            <div key={index} className="flex gap-3 mb-1 ml-8">
              <span className="text-slate-400 font-bold mt-2 text-[8px]">○</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                {parseInlineStyles(content, false)}
              </p>
            </div>
        )
    }

    // Formula Block (centered text with math symbols)
    if (line.includes('$$')) {
        const formula = line.replace(/\$\$/g, '');
        if (isHandwritten) {
             return (
                 <div key={index} className="my-6 text-center">
                     <div className="inline-block px-6 py-2 border-2 border-[#2E2E2E] rounded-full transform -rotate-1 bg-white/50 dark:bg-slate-800/50 shadow-sm">
                         <span className="font-hindi text-2xl font-bold text-[#2E2E2E] dark:text-white">{formula}</span>
                     </div>
                 </div>
             )
        }
    }

    // Empty lines
    if (!line.trim()) return <div key={index} className="h-6"></div>;

    // Standard Paragraph
    if (isHandwritten) {
        return (
            <p key={index} className="text-[#2E2E2E] dark:text-slate-200 leading-[28px] mb-2 font-hand text-xl">
                {parseInlineStyles(line, true)}
            </p>
        );
    }

    return (
      <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2 text-sm md:text-base">
        {parseInlineStyles(line, false)}
      </p>
    );
  });
};

const AiNoteGenerator: React.FC<AiNoteGeneratorProps> = ({ note, onClose }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<'config' | 'processing' | 'result'>('config');
  const [viewMode, setViewMode] = useState<'normal' | 'handwritten'>('normal');
  const [config, setConfig] = useState<NoteGenerationConfig>({
    noteType: 'long_notes',
    language: 'english',
    depth: 'medium'
  });
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState<GeneratedNoteContent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    if (result) {
      setEditedContent(result.content);
    }
  }, [result]);

  const handleGenerate = async () => {
    setStep('processing');
    setProcessingStep(0);

    // Simulate step progress with variable timing
    let currentStep = 0;
    const runSteps = () => {
      if (currentStep >= steps.length - 1) return;
      
      const delay = 800 + Math.random() * 1000; // Random delay between 800ms and 1800ms
      setTimeout(() => {
        setProcessingStep(prev => prev + 1);
        currentStep++;
        runSteps();
      }, delay);
    };
    runSteps();

    try {
      const generatedNote = await generateSmartNotes(config, note.title);
      // Ensure we wait for at least some steps to show
      setTimeout(() => {
        setResult(generatedNote);
        setStep('result');
        showToast('Notes generated successfully!', 'success');
      }, 4000);
    } catch (error) {
      showToast('Failed to generate notes.', 'error');
      setStep('config');
    }
  };

  const handleDownloadFile = () => {
    if (!result) return;
    
    // Use edited content if available
    const contentToDownload = isEditing ? editedContent : result.content;
    const blob = new Blob([contentToDownload], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Download started', 'success');
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(isEditing ? editedContent : result.content);
    showToast('Notes copied to clipboard', 'success');
  };

  const handleSaveEdit = () => {
    if (result) {
        setResult({ ...result, content: editedContent });
        setIsEditing(false);
        showToast('Changes saved locally', 'success');
    }
  };

  const ConfigOption = ({ 
    selected, 
    onClick, 
    icon: Icon, 
    title, 
    desc 
  }: { selected: boolean; onClick: () => void; icon: any; title: string; desc: string }) => (
    <button 
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 w-full hover:shadow-md ${
        selected 
          ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 ring-1 ring-violet-600' 
          : 'border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-slate-800'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl ${selected ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
          <Icon size={20} />
        </div>
        <div>
          <h4 className={`font-bold ${selected ? 'text-violet-900 dark:text-violet-100' : 'text-slate-800 dark:text-white'}`}>{title}</h4>
          <p className={`text-xs mt-1 ${selected ? 'text-violet-700 dark:text-violet-300' : 'text-slate-500 dark:text-slate-400'}`}>{desc}</p>
        </div>
      </div>
      {selected && <div className="absolute top-4 right-4 text-violet-600"><CheckCircle2 size={18} /></div>}
    </button>
  );

  if (step === 'config') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="text-violet-600" size={24} /> 
                AI Note Generator
              </h2>
              <p className="text-slate-500 text-sm mt-1">Transform <strong>{note.title}</strong> into exam-ready material.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto space-y-8">
            
            {/* Note Type Selection */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} /> Select Note Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConfigOption 
                  selected={config.noteType === 'long_notes'}
                  onClick={() => setConfig({...config, noteType: 'long_notes'})}
                  icon={BookOpen}
                  title="Long Notes"
                  desc="Deep conceptual understanding. Good for first-time learning."
                />
                <ConfigOption 
                  selected={config.noteType === 'short_notes'}
                  onClick={() => setConfig({...config, noteType: 'short_notes'})}
                  icon={Zap}
                  title="Short Notes"
                  desc="Bullet points for rapid revision and memory reinforcement."
                />
                <ConfigOption 
                  selected={config.noteType === 'formula_sheet'}
                  onClick={() => setConfig({...config, noteType: 'formula_sheet'})}
                  icon={BrainCircuit}
                  title="Formula Sheet"
                  desc="All formulas & units organized by topic."
                />
                <ConfigOption 
                  selected={config.noteType === 'exam_answer'}
                  onClick={() => setConfig({...config, noteType: 'exam_answer'})}
                  icon={FileCheck}
                  title="Exam Answers"
                  desc="Structured answer formats with marking schemes."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Language Selection */}
               <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Languages size={16} /> Language Style
                  </label>
                  <div className="flex flex-col gap-2">
                    {['english', 'hinglish', 'hindi'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setConfig({...config, language: lang as any})}
                        className={`px-4 py-3 rounded-xl border text-left text-sm font-bold capitalize transition-all ${
                          config.language === lang 
                            ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300' 
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lang} {lang === 'hinglish' && <span className="text-xs font-normal text-slate-400 ml-2">(English + Hindi Mix)</span>}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Depth Selection */}
               <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Layers size={16} /> Detail Level
                  </label>
                  <div className="space-y-4 pt-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="1" 
                        value={config.depth === 'basic' ? 0 : config.depth === 'medium' ? 1 : 2}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setConfig({...config, depth: val === 0 ? 'basic' : val === 1 ? 'medium' : 'deep'});
                        }}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                      />
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span className={config.depth === 'basic' ? 'text-violet-600' : ''}>Basic</span>
                        <span className={config.depth === 'medium' ? 'text-violet-600' : ''}>Balanced</span>
                        <span className={config.depth === 'deep' ? 'text-violet-600' : ''}>Detailed</span>
                      </div>
                      <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                        {config.depth === 'basic' && "Quick overview. Skips examples."}
                        {config.depth === 'medium' && "Standard depth. Includes examples and key points."}
                        {config.depth === 'deep' && "Comprehensive coverage. Includes derivations and extra context."}
                      </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-4">
             <button onClick={onClose} className="px-6 py-3 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
               Cancel
             </button>
             <button onClick={handleGenerate} className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
               <Sparkles size={18} /> Generate Notes
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl p-10 text-center border border-slate-200 dark:border-slate-800">
          <div className="relative w-24 h-24 mx-auto mb-8">
             <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
               <BrainCircuit size={40} className="text-violet-600 animate-pulse" />
             </div>
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Analyzing Content</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Please wait while Tutor Ji processes your file.</p>
          
          <div className="space-y-4 text-left">
            {steps.map((s, idx) => (
              <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${idx <= processingStep ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx < processingStep ? 'bg-emerald-500 text-white' : idx === processingStep ? 'bg-violet-100 text-violet-600 animate-pulse' : 'bg-slate-100 text-slate-300'}`}>
                  {idx < processingStep ? <CheckCircle2 size={14} /> : <Loader2 size={14} className={idx === processingStep ? 'animate-spin' : ''} />}
                </div>
                <span className={`text-sm font-bold ${idx <= processingStep ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result' && result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
        <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-[2rem] shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
           {/* Result Header */}
           <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notes Generated!</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      {config.language} • {config.noteType.replace('_', ' ')}
                    </p>
                  </div>
              </div>
              
              {/* UI Mode Toggle */}
              <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setViewMode('normal')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        viewMode === 'normal' 
                        ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                      <Monitor size={16} /> Digital
                  </button>
                  <button 
                    onClick={() => setViewMode('handwritten')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        viewMode === 'handwritten' 
                        ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                      <PenTool size={16} /> Handwritten
                  </button>
              </div>

              <div className="flex gap-2">
                 <button 
                    onClick={() => {
                        if (isEditing) handleSaveEdit();
                        else setIsEditing(true);
                    }}
                    className={`p-2.5 rounded-xl transition-colors ${isEditing ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800'}`} 
                    title={isEditing ? "Save Changes" : "Edit Notes"}
                 >
                   {isEditing ? <Save size={20} /> : <Edit size={20} />}
                 </button>
                 <button onClick={handleCopy} className="p-2.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Copy">
                   <Copy size={20} />
                 </button>
                 <button onClick={handleDownloadFile} className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors" title="Download">
                   <Download size={20} />
                 </button>
                 <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                   <X size={20} />
                 </button>
              </div>
           </div>

           {/* Content Preview */}
           <div className={`flex-1 overflow-y-auto p-4 md:p-8 transition-colors duration-300 ${viewMode === 'handwritten' ? 'bg-[#f0ece3] dark:bg-slate-950' : 'bg-slate-50 dark:bg-slate-950'}`}>
              <div 
                className={`max-w-4xl mx-auto rounded-2xl shadow-lg border min-h-full transition-all duration-300 ${
                    viewMode === 'handwritten' 
                    ? 'notebook-paper p-12 md:p-16 border-transparent shadow-xl rotate-1' 
                    : 'bg-white dark:bg-slate-900 p-10 border-slate-200 dark:border-slate-800'
                }`}
              >
                 <div className="mb-6 flex gap-2 flex-wrap">
                    {!viewMode.includes('handwritten') && result.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                 </div>
                 
                 <div className={`max-w-none ${viewMode === 'handwritten' && !isEditing ? '' : 'prose dark:prose-invert'} min-h-[50vh]`}>
                    {isEditing ? (
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-[60vh] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-violet-500 outline-none resize-none font-mono text-sm"
                            placeholder="Edit your notes here..."
                        />
                    ) : (
                        renderMarkdown(result.content, viewMode === 'handwritten')
                    )}
                 </div>

                 {/* Source Citation Footer */}
                 <div className={`mt-12 pt-6 border-t-2 border-dashed ${viewMode === 'handwritten' ? 'border-[#2E2E2E]/20' : 'border-slate-100 dark:border-slate-800'}`}>
                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${viewMode === 'handwritten' ? 'text-[#2E2E2E]/60 font-hand' : 'text-slate-400'}`}>
                      <ShieldCheckIcon size={14} /> Verified Sources
                    </h4>
                    <ul className={`text-xs space-y-1 ${viewMode === 'handwritten' ? 'text-[#2E2E2E]/70 font-hand' : 'text-slate-500'}`}>
                      {result.citations.map((cite, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${viewMode === 'handwritten' ? 'bg-[#2E2E2E]' : 'bg-emerald-500'}`}></span>
                          Source: {note.title}, {cite}
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return null;
};

// Helper icon
const ShieldCheckIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export default AiNoteGenerator;