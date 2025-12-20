import React, { useState, useEffect, useRef } from 'react';
import { AIResponse } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  Hand, 
  Eraser, 
  RotateCcw, 
  Save, 
  MoreHorizontal,
  PenTool,
  Undo2,
  Redo2,
  CheckCircle2,
  Pencil,
  Grid,
  Square,
  Type,
  Image as ImageIcon,
  Palette,
  Maximize,
  Mic,
  Send,
  Sparkles,
  Download,
  Share2,
  BrainCircuit,
  CornerUpLeft,
  CornerUpRight,
  MousePointer2,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../context/toast-context';

interface TutorSessionProps {
  aiGuidance: AIResponse;
}

type BackgroundType = 'blank' | 'grid' | 'dots' | 'lines';
type ToolType = 'select' | 'pen' | 'eraser' | 'pan' | 'text' | 'shape';
type AiState = 'idle' | 'thinking' | 'explaining' | 'drawing';

interface BoardElement {
  id: string;
  type: 'text' | 'formula' | 'diagram' | 'drawing' | 'shape';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
}

const TutorSession: React.FC<TutorSessionProps> = ({ aiGuidance }) => {
  const { showToast } = useToast();
  
  // Board State
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [background, setBackground] = useState<BackgroundType>('grid');
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#A855F7'); // Primary Purple
  const [isHandwrittenMode, setIsHandwrittenMode] = useState(false);
  
  // Session State
  const [sessionTitle, setSessionTitle] = useState("Untitled Session");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // AI State
  const [prompt, setPrompt] = useState("");
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiStep, setAiStep] = useState<string>('');
  
  // Content State
  const [boardElements, setBoardElements] = useState<BoardElement[]>([]);
  const [history, setHistory] = useState<BoardElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{x: number, y: number}[]>([]);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-save logic
  useEffect(() => {
    if (boardElements.length > 0) {
      const saveInterval = setInterval(() => {
          setIsAutoSaving(true);
          setTimeout(() => {
              setLastSaved(new Date());
              setIsAutoSaving(false);
          }, 800);
      }, 30000); // 30 seconds
      return () => clearInterval(saveInterval);
    }
  }, [boardElements]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // --- Actions ---

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newLevel = direction === 'in' ? prev + 10 : prev - 10;
      return Math.min(Math.max(newLevel, 25), 400); // 25% to 400%
    });
  };

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
  };

  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear the whiteboard?')) {
      const newState: BoardElement[] = [];
      updateBoard(newState);
      showToast('Whiteboard cleared', 'info');
    }
  };

  const handleManualSave = () => {
      setIsAutoSaving(true);
      setTimeout(() => {
        setLastSaved(new Date());
        setIsAutoSaving(false);
        showToast('Session saved successfully', 'success');
      }, 600);
  };

  const handleExport = () => {
      showToast('Exporting board as PDF...', 'info');
      setTimeout(() => {
          showToast('Download started', 'success');
      }, 1500);
  }

  // --- History Management ---

  const updateBoard = (newElements: BoardElement[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setBoardElements(newElements);
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setBoardElements(history[newIndex]);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setBoardElements(history[newIndex]);
      }
  };

  // --- Drawing Logic ---

  const getCoordinates = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pen') {
      setIsDrawing(true);
      setCurrentStroke([getCoordinates(e)]);
    } 
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === 'pen' && isDrawing) {
      setCurrentStroke(prev => [...prev, getCoordinates(e)]);
    }
  };

  const handleMouseUp = () => {
    if (activeTool === 'pen' && isDrawing) {
      setIsDrawing(false);
      
      if (currentStroke.length > 1) {
        const pathData = `M ${currentStroke.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;
        const newEl: BoardElement = {
          id: Date.now().toString(),
          type: 'drawing',
          content: pathData,
          x: 0,
          y: 0,
          color: selectedColor
        };
        updateBoard([...boardElements, newEl]);
      }
      setCurrentStroke([]);
    }
  };

  const handleElementClick = (e: React.MouseEvent, elId: string) => {
      if (activeTool === 'eraser') {
          e.stopPropagation();
          const newElements = boardElements.filter(el => el.id !== elId);
          updateBoard(newElements);
          showToast('Element erased', 'info');
      }
  };

  // --- AI Logic Simulation ---

  const simulateAiResponse = (userPrompt: string) => {
    const currentElements = [...boardElements];
    const startY = currentElements.length > 0 ? Math.max(...currentElements.map(e => e.y)) + 200 : 100;
    
    // Step 1: Add User Query as a Header
    const userQueryElement: BoardElement = {
        id: `user-${Date.now()}`,
        type: 'text',
        content: `Q: ${userPrompt}`,
        x: 50,
        y: startY,
        color: '#1e293b'
    };
    currentElements.push(userQueryElement);
    updateBoard([...currentElements]);

    // Sequence of AI actions
    const steps = [
        { time: 1000, state: 'thinking', msg: 'Analyzing request...' },
        { time: 2000, state: 'explaining', msg: 'Structuring explanation...' },
        { time: 3000, state: 'drawing', msg: 'Updating board...' }
    ];

    let stepIndex = 0;

    const runStep = () => {
        if (stepIndex >= steps.length) {
            // Finalize
            const aiContentId = `ai-${Date.now()}`;
            
            // Heuristic response generation based on keywords
            const lowerPrompt = userPrompt.toLowerCase();
            let newEls: BoardElement[] = [];

            if (lowerPrompt.includes('draw') || lowerPrompt.includes('diagram')) {
                newEls.push({
                    id: aiContentId + '-diag',
                    type: 'diagram',
                    content: 'Diagram: ' + userPrompt,
                    x: 50,
                    y: startY + 80
                });
            } else if (lowerPrompt.includes('formula') || lowerPrompt.includes('solve')) {
                newEls.push({
                    id: aiContentId + '-form',
                    type: 'formula',
                    content: 'F = ma \\Rightarrow a = \\frac{F}{m}',
                    x: 50,
                    y: startY + 80
                });
                newEls.push({
                    id: aiContentId + '-text',
                    type: 'text',
                    content: 'Therefore, acceleration is directly proportional to force and inversely proportional to mass.',
                    x: 50,
                    y: startY + 180
                });
            } else {
                newEls.push({
                    id: aiContentId + '-text',
                    type: 'text',
                    content: `Here is the explanation for: ${userPrompt}

1. Key Concept Identification
2. Application of Principles
3. Conclusion`,
                    x: 50,
                    y: startY + 80
                });
            }

            updateBoard([...currentElements, ...newEls]);
            setAiState('idle');
            setAiStep('');
            showToast('Tutor Ji updated the board', 'success');
            return;
        }

        const step = steps[stepIndex];
        setAiState(step.state as AiState);
        setAiStep(step.msg);
        stepIndex++;
        setTimeout(runStep, step.time - (stepIndex > 1 ? steps[stepIndex-1].time : 0));
    };

    runStep();
  };

  const handlePromptSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    setPrompt("");
    
    // Auto-rename session if it's the first interaction
    if (sessionTitle === "Untitled Session" && boardElements.length === 0) {
       setSessionTitle(currentPrompt);
    }

    simulateAiResponse(currentPrompt);
  };

  const handleSuggestionClick = (suggestion: string) => {
      setPrompt(suggestion);
      if(inputRef.current) inputRef.current.focus();
  }

  // --- Render Helpers ---

  const bgStyles = {
    blank: {},
    grid: { 
        backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)', 
        backgroundSize: '24px 24px' 
    },
    dots: {
        backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px'
    },
    lines: {
        backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '100% 24px'
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-[2rem] overflow-hidden relative shadow-2xl animate-fade-in" ref={containerRef}>
      
      {/* --- Top Bar --- */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 right-4 md:right-6 z-20 flex justify-between items-start pointer-events-none">
          {/* Session Info */}
          <div className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl pl-2 pr-6 py-2 rounded-2xl shadow-xl border border-white/20 flex items-center gap-4 transition-transform hover:scale-105 group">
             <div className="p-2.5 bg-primary-purple/10 rounded-xl text-primary-purple group-hover:rotate-12 transition-transform">
                 {aiState === 'idle' ? <BrainCircuit size={20} /> : <Loader2 size={20} className="animate-spin" />}
             </div>
             <div className="max-w-[120px] md:max-w-none">
                 <input 
                    type="text" 
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="text-sm font-bold text-slate-800 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full focus:w-64 transition-all truncate"
                 />
                 <div className="flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${aiState === 'idle' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                         {aiState === 'idle' ? 'AI Ready' : aiStep}
                     </p>
                 </div>
             </div>
          </div>

          {/* AI Teaching Overlay (Centered) */}
          {aiState !== 'idle' && (
              <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 top-2 bg-slate-900 text-white px-6 py-2 rounded-full shadow-2xl flex items-center gap-3 animate-slide-in z-30 whitespace-nowrap">
                  <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                  <span className="text-xs font-bold tracking-wide hidden md:inline">Tutor Ji is {aiState === 'thinking' ? 'thinking...' : 'explaining...'}</span>
                  <span className="text-xs font-bold tracking-wide md:hidden">{aiState === 'thinking' ? 'Thinking...' : 'Explaining...'}</span>
              </div>
          )}

          {/* Right Controls */}
          <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/20 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hidden md:flex">
                  {isAutoSaving ? (
                      <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  ) : lastSaved ? (
                      <><CheckCircle2 size={14} className="text-emerald-500" /> Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</>
                  ) : (
                      <><div className="w-2 h-2 bg-slate-300 rounded-full"/> Unsaved</>
                  )}
              </div>
              
              <button 
                onClick={handleManualSave} 
                className="bg-primary-purple text-white p-2.5 rounded-xl shadow-lg shadow-primary-purple/20 hover:bg-violet-700 transition-colors tooltip"
                title="Save Session"
              >
                  <Save size={20} />
              </button>
              
              <div className="relative group">
                <button className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-500 p-2.5 rounded-xl shadow-lg border border-white/20 hover:text-slate-700 dark:hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl shadow-xl p-1 hidden group-hover:block animate-fade-in z-30">
                    <button onClick={handleExport} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg flex items-center gap-2">
                        <Download size={16} /> Export as PDF
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 rounded-lg flex items-center gap-2">
                        <Share2 size={16} /> Share Link
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                    <button onClick={handleClearBoard} className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2">
                        <RotateCcw size={16} /> Clear Board
                    </button>
                </div>
              </div>
          </div>
      </div>

      {/* --- Main Canvas --- */}
      <div 
        ref={canvasRef}
        className={`flex-1 relative bg-white/50 dark:bg-slate-950/50 overflow-hidden ${activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'pen' ? 'cursor-crosshair' : activeTool === 'eraser' ? 'cursor-not-allowed' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
          {/* Background Pattern */}
          <div className="absolute inset-0 transition-all duration-300 opacity-40 dark:opacity-10 pointer-events-none" 
               style={{ 
                 ...bgStyles[background],
                 transform: `scale(${zoomLevel/100})`,
                 transformOrigin: '0 0'
               }}>
          </div>
          
          {/* --- Canvas Content Layer --- */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: `scale(${zoomLevel/100})`, transformOrigin: '0 0' }}>
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                 {boardElements.filter(el => el.type === 'drawing').map(el => (
                     <path 
                        key={el.id}
                        d={el.content}
                        stroke={el.color || '#000'}
                        strokeWidth={4}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`pointer-events-auto ${activeTool === 'eraser' ? 'hover:stroke-red-500 hover:stroke-[6px] cursor-pointer transition-all' : ''}`}
                        onClick={(e) => handleElementClick(e, el.id)}
                     />
                 ))}
                 {currentStroke.length > 1 && (
                     <path 
                        d={`M ${currentStroke.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                        stroke={selectedColor}
                        strokeWidth={4}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                     />
                 )}
              </svg>

              {boardElements.filter(el => el.type !== 'drawing').map(el => (
                  <div 
                    key={el.id} 
                    className="absolute transition-all duration-500 animate-scale-in pointer-events-auto"
                    style={{ left: el.x, top: el.y }}
                    onClick={(e) => handleElementClick(e, el.id)}
                  >
                      {el.type === 'text' && (
                          <div className={`p-4 rounded-xl border-2 border-transparent hover:border-primary-purple/30 group relative ${isHandwrittenMode ? 'font-hand text-2xl text-slate-800' : 'text-base text-slate-800 dark:text-white font-sans'}`}>
                              <pre className="whitespace-pre-wrap font-inherit">{el.content}</pre>
                              {activeTool === 'eraser' && <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100"><Eraser className="text-red-600" /></div>}
                          </div>
                      )}
                      {el.type === 'formula' && (
                          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center group relative">
                              <span className={`font-serif italic font-bold ${isHandwrittenMode ? 'text-3xl' : 'text-2xl'}`}>{el.content}</span>
                              {activeTool === 'eraser' && <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100"><Eraser className="text-red-600" /></div>}
                          </div>
                      )}
                      {el.type === 'diagram' && (
                           <div className="w-72 h-48 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 flex-col gap-2 shadow-inner group relative">
                               <ImageIcon size={40} />
                               <span className="text-xs font-bold uppercase tracking-wider text-center px-4">{el.content}</span>
                               {activeTool === 'eraser' && <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100"><Eraser className="text-red-600" /></div>}
                           </div>
                      )}
                  </div>
              ))}
          </div>

          {/* --- Empty State (Hero) --- */}
          {boardElements.length === 0 && !isDrawing && (
             <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                 <div className="text-center max-w-lg pointer-events-auto animate-fade-in p-6">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary-purple to-primary-blue rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-primary-purple/30 animate-float group cursor-pointer transition-all duration-500 hover:scale-110 hover:shadow-primary-purple/50">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-purple to-primary-blue opacity-30 blur-xl animate-pulse transition-all duration-500 group-hover:opacity-50"></div>
                        <Sparkles size={32} className="text-white relative z-10 transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Hi Student!</h2>
                    <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 mb-8 font-medium">
                        I'm Tutor Ji. Ask me to explain a concept, solve a problem, or draw a diagram.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Explain Newton’s Laws', 'Solve a Calculus problem', 'Draw Human Heart'].map(s => (
                            <button 
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="px-4 py-2 bg-white/50 dark:bg-white/5 border border-white/20 rounded-full text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary-purple hover:text-primary-purple transition-all shadow-sm hover:shadow-md hover:scale-105 group"
                            >
                                <span className="group-hover:text-primary-purple transition-colors duration-300">{s}</span>
                            </button>
                        ))}
                    </div>
                 </div>
             </div>
          )}

          {/* --- Tools Sidebar (Floating Pill) --- */}
          <div className="absolute z-20 transition-all duration-300 pointer-events-auto glass-panel p-2 rounded-full shadow-2xl flex gap-2 md:gap-3
              md:left-6 md:top-1/2 md:-translate-y-1/2 md:flex-col md:w-auto md:bottom-auto md:rounded-full
              bottom-24 left-1/2 -translate-x-1/2 flex-row w-[90%] md:w-auto justify-center overflow-x-auto scrollbar-hide
          ">
             {[
                 { id: 'select', icon: MousePointer2, label: 'Select' },
                 { id: 'pen', icon: PenTool, label: 'Pen' },
                 { id: 'eraser', icon: Eraser, label: 'Eraser' },
                 { id: 'text', icon: Type, label: 'Text' },
                 { id: 'shape', icon: Square, label: 'Shapes' },
                 { id: 'pan', icon: Hand, label: 'Pan' },
             ].map((tool) => (
                 <button 
                   key={tool.id}
                   onClick={() => handleToolChange(tool.id as ToolType)}
                   className={`p-3 md:p-3.5 rounded-full transition-all relative group shrink-0 ${activeTool === tool.id ? 'bg-primary-purple text-white shadow-lg shadow-primary-purple/30' : 'text-slate-500 hover:bg-white/50 dark:hover:bg-white/10'}`}
                 >
                   <tool.icon size={20} className="md:w-6 md:h-6" strokeWidth={activeTool === tool.id ? 2.5 : 2} />
                 </button>
             ))}
             
             <div className="w-px h-8 md:h-px md:w-full bg-slate-200 dark:bg-slate-700 my-auto md:my-1 mx-1 md:mx-0 shrink-0"></div>
             
             <div className="flex flex-row md:flex-col gap-3 items-center p-1 shrink-0">
                 {['#A855F7', '#EF4444', '#10B981', '#000000'].map(color => (
                     <button 
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${selectedColor === color ? 'border-slate-400 scale-110 ring-2 ring-offset-2 ring-primary-purple' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                     />
                 ))}
             </div>
          </div>

          {/* --- Bottom Center Controls (Input) --- */}
          <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-auto z-20 w-full max-w-2xl px-4">
             
             {/* AI Prompt Bar */}
             <form 
                onSubmit={handlePromptSubmit}
                className={`w-full glass-panel p-2 rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 ${aiState !== 'idle' ? 'ring-4 ring-primary-purple/20' : 'hover:scale-[1.01]'}`}
             >
                <button type="button" className={`p-3 rounded-full transition-colors ${aiState !== 'idle' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-purple'}`}>
                    {aiState !== 'idle' ? <Loader2 size={20} className="animate-spin" /> : <Mic size={20} />}
                </button>
                <input 
                    ref={inputRef}
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={aiState !== 'idle' ? "Thinking..." : "Ask Tutor Ji..."}
                    disabled={aiState !== 'idle'}
                    className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 font-medium px-2 disabled:opacity-50 min-w-0"
                />
                <button 
                    type="submit" 
                    disabled={!prompt.trim() || aiState !== 'idle'}
                    className="p-3 bg-primary-purple text-white rounded-full shadow-lg shadow-primary-purple/20 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Send size={20} />
                </button>
             </form>

             {/* Canvas Controls */}
             <div className="flex items-center gap-4 md:gap-6 overflow-x-auto max-w-full pb-2 md:pb-0 px-2 scrollbar-hide">
                <div className="glass-panel px-4 py-2 rounded-full shadow-2xl flex items-center gap-3">
                    <button onClick={() => handleZoom('out')} className="hover:text-primary-purple transition-colors text-slate-500"><ZoomOut size={18} /></button>
                    <span className="text-xs font-mono font-bold w-10 text-center text-slate-700 dark:text-slate-200 select-none">{zoomLevel}%</span>
                    <button onClick={() => handleZoom('in')} className="hover:text-primary-purple transition-colors text-slate-500"><ZoomIn size={18} /></button>
                </div>

                <div className="glass-panel p-2 rounded-full shadow-2xl flex items-center gap-2">
                    <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full text-slate-500 disabled:opacity-30 transition-colors" title="Undo"><Undo2 size={18} /></button>
                    <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-white/50 dark:hover:bg-white/10 rounded-full text-slate-500 disabled:opacity-30 transition-colors" title="Redo"><Redo2 size={18} /></button>
                    <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                    
                    <button 
                        onClick={() => setShowBgMenu(!showBgMenu)}
                        className={`p-2 rounded-full transition-colors ${showBgMenu ? 'bg-primary-purple/10 text-primary-purple' : 'hover:bg-white/50 dark:hover:bg-white/10 text-slate-500'}`}
                        title="Background"
                    >
                        <Grid size={18} />
                    </button>
                    
                    <button 
                        onClick={() => { setIsHandwrittenMode(!isHandwrittenMode); showToast(isHandwrittenMode ? "Standard Mode" : "Handwritten Mode", "info"); }} 
                        className={`p-2 rounded-full transition-colors ${isHandwrittenMode ? 'bg-primary-purple/10 text-primary-purple' : 'hover:bg-white/50 dark:hover:bg-white/10 text-slate-500'}`} 
                        title="Handwritten Mode"
                    >
                        <Pencil size={18} />
                    </button>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default TutorSession;