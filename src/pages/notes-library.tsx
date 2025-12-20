
import React, { useState, useEffect } from 'react';
import { AIResponse, Note } from '../types';
import { mockNotes } from '../data/mock-data';
import { 
  FileText, 
  Image as ImageIcon, 
  Search, 
  UploadCloud, 
  Grid, 
  List, 
  FolderOpen, 
  Trash2, 
  Download, 
  Eye,
  File,
  Clock,
  Plus, 
  Edit as PenSquare, 
  X,
  CheckCircle2,
  Copy,
  Edit,
  Share2,
  Sparkles
} from 'lucide-react';
import { useToast } from '../context/toast-context';
import AiNoteGenerator from '../components/ai-note-generator';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { cn } from '../utils/cn';

interface NotesLibraryProps {
  aiGuidance: AIResponse;
}

type SortOption = 'name' | 'date' | 'size';
type FilterType = 'all' | 'pdf' | 'image' | 'doc';

const NotesLibrary: React.FC<NotesLibraryProps> = ({ aiGuidance }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [viewingNote, setViewingNote] = useState<Note | null>(null);
  const [generatingNote, setGeneratingNote] = useState<Note | null>(null); 
  
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, noteId: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(mockNotes);

  useEffect(() => {
    let result = notes;

    if (filterType !== 'all') {
      result = result.filter(note => note.type === filterType);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.subject.toLowerCase().includes(query)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      if (sortBy === 'size') return parseInt(a.size) - parseInt(b.size); 
      return new Date(b.date).getTime() - new Date(a.date).getTime(); 
    });

    setFilteredNotes(result);
  }, [notes, filterType, searchQuery, sortBy]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) startUpload(e.dataTransfer.files[0].name);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) startUpload(e.target.files[0].name);
  };

  const startUpload = (fileName: string) => {
    setIsUploading(true);
    setUploadFileName(fileName);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const newNote: Note = {
                id: Date.now().toString(),
                title: fileName.split('.')[0],
                subject: 'Uncategorized',
                type: fileName.toLowerCase().endsWith('pdf') ? 'pdf' : 'image',
                date: new Date().toISOString().split('T')[0],
                size: '1.2 MB'
            };
            setNotes(prev => [newNote, ...prev]);
            showToast('File uploaded successfully!', 'success');
            setActiveTab('library');
          }, 800);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleSaveTextNote = () => {
      if(!newNoteTitle.trim()) {
          showToast('Please enter a title', 'error');
          return;
      }
      const newNote: Note = {
          id: Date.now().toString(),
          title: newNoteTitle,
          subject: 'Personal',
          type: 'doc',
          date: new Date().toISOString().split('T')[0],
          size: '1 KB'
      };
      setNotes(prev => [newNote, ...prev]);
      setIsCreatingNote(false);
      setNewNoteTitle('');
      setNewNoteContent('');
      showToast('Note created successfully', 'success');
  };

  const handleDelete = (noteId: string) => {
    if(confirm(`Are you sure you want to delete this note?`)) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      setSelectedNotes(prev => prev.filter(id => id !== noteId));
      showToast(`Note deleted.`, 'info');
    }
  };

  const toggleSelection = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) ? prev.filter(id => id !== noteId) : [...prev, noteId]
    );
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, noteId });
  };

  const totalStorage = 100;
  const usedStorage = notes.length * 2.5;
  const usedPercentage = Math.min((usedStorage / totalStorage) * 100, 100);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
               <FolderOpen size={24} />
             </div>
             <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Notes Library</h1>
           </div>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium ml-1">Manage, organize and access your study materials</p>
        </div>
        
        <Card className="flex p-1.5 rounded-2xl gap-1">
          <Button 
            variant={activeTab === 'library' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('library')}
            className={cn("rounded-xl", activeTab === 'library' && "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300")}
          >
            All Files
          </Button>
          <Button 
            variant={activeTab === 'upload' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('upload')}
            className={cn("rounded-xl", activeTab === 'upload' && "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300")}
          >
            Upload
          </Button>
        </Card>
      </div>

      {activeTab === 'library' && (
        <>
          {/* Controls Bar */}
          <Card className="p-4 rounded-3xl space-y-4 md:space-y-0 md:flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, tag..." 
                className="pl-12 pr-4 py-3 w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                 <Card className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-none">
                    {['all', 'pdf', 'image', 'doc'].map((type) => (
                        <Button
                          key={type}
                          variant="ghost"
                          onClick={() => setFilterType(type as FilterType)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide h-auto",
                            filterType === type ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                          )}
                        >
                           {type}
                        </Button>
                    ))}
                 </Card>

                 <Button 
                    onClick={() => setIsCreatingNote(true)}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-6 rounded-2xl text-sm font-bold shadow-lg shadow-violet-200 dark:shadow-none whitespace-nowrap"
                  >
                      <Plus size={18} strokeWidth={3} /> New Note
                  </Button>

                 <Card className="flex bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-1 border border-slate-200 dark:border-slate-700 shadow-none">
                     <Button 
                      variant="ghost"
                      onClick={() => setViewMode('grid')}
                      className={cn("p-2.5 rounded-xl h-auto", viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-slate-400 hover:text-slate-600')}
                     >
                       <Grid size={18} />
                     </Button>
                     <Button 
                      variant="ghost"
                      onClick={() => setViewMode('list')}
                      className={cn("p-2.5 rounded-xl h-auto", viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-slate-400 hover:text-slate-600')}
                     >
                       <List size={18} />
                     </Button>
                 </Card>
            </div>
          </Card>

          {/* Storage Indicator */}
          <Card className="p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                <UploadCloud size={24} />
              </div>
              <div className="flex-1 w-full">
                 <div className="flex justify-between items-end mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-white">Local Storage</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Keep track of your browser usage</p>
                    </div>
                    <span className={cn("text-sm font-bold", usedPercentage > 80 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300')}>
                      {usedPercentage.toFixed(0)}% Used
                    </span>
                 </div>
                 <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600">
                    <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", usedPercentage > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-violet-500')} style={{ width: `${usedPercentage}%` }}></div>
                 </div>
              </div>
          </Card>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNotes.map(note => {
                const isSelected = selectedNotes.includes(note.id);
                return (
                  <Card 
                    key={note.id} 
                    onContextMenu={(e: React.MouseEvent) => handleContextMenu(e, note.id)}
                    className={cn(
                      "group rounded-3xl relative flex flex-col overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
                      isSelected ? 'border-violet-500 shadow-xl ring-2 ring-violet-500' : 'hover:border-violet-300 dark:hover:border-violet-800'
                    )}
                  >
                    
                    {/* Thumbnail Area - Large Preview */}
                    <div 
                      className={cn(
                        "h-[180px] w-full flex items-center justify-center relative overflow-hidden transition-colors",
                         note.type === 'pdf' ? 'bg-red-50 dark:bg-red-900/10' : 
                         note.type === 'image' ? 'bg-blue-50 dark:bg-blue-900/10' : 'bg-indigo-50 dark:bg-indigo-900/10'
                      )}
                    >
                       {/* Pattern Background */}
                       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`, backgroundSize: '12px 12px', color: note.type === 'pdf' ? '#f87171' : note.type === 'image' ? '#60a5fa' : '#818cf8' }}></div>
                       
                       <div className={cn(
                           "relative z-10 p-5 rounded-2xl shadow-xl transform group-hover:scale-110 transition-transform duration-300",
                           note.type === 'pdf' ? 'bg-white text-red-500' : 
                           note.type === 'image' ? 'bg-white text-blue-500' : 'bg-white text-indigo-500'
                       )}>
                          {note.type === 'pdf' ? <FileText size={48} strokeWidth={1.5} /> : note.type === 'image' ? <ImageIcon size={48} strokeWidth={1.5} /> : <File size={48} strokeWidth={1.5} />}
                       </div>

                       {/* Hover Actions Overlay */}
                       <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                          <Button variant="ghost" onClick={() => setViewingNote(note)} className="p-3 bg-white text-slate-800 rounded-xl hover:scale-110 transition-transform shadow-lg hover:text-violet-600 h-auto w-auto" title="Preview"><Eye size={20} /></Button>
                          <Button variant="ghost" onClick={() => setGeneratingNote(note)} className="p-3 bg-white text-slate-800 rounded-xl hover:scale-110 transition-transform shadow-lg hover:text-amber-500 h-auto w-auto" title="Generate AI Notes"><Sparkles size={20} /></Button>
                          <Button variant="ghost" onClick={() => handleDelete(note.id)} className="p-3 bg-white text-slate-800 rounded-xl hover:scale-110 transition-transform shadow-lg hover:text-red-600 h-auto w-auto" title="Delete"><Trash2 size={20} /></Button>
                       </div>
                    </div>

                    {/* Selection Checkbox */}
                    <Button 
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); toggleSelection(note.id); }}
                        className={cn(
                            "absolute top-4 right-4 z-30 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shadow-sm p-0 hover:bg-transparent",
                            isSelected ? 'bg-violet-600 border-violet-600 text-white opacity-100 hover:bg-violet-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-transparent opacity-0 group-hover:opacity-100 hover:border-violet-500 hover:text-violet-500'
                        )}
                    >
                        <CheckCircle2 size={16} strokeWidth={3} />
                    </Button>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate pr-2 text-base group-hover:text-violet-600 transition-colors" title={note.title}>{note.title}</h3>
                           </div>
                           <div className="flex items-center gap-2">
                               <Badge className={cn(
                                   "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border-none",
                                   note.type === 'pdf' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                   note.type === 'image' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                               )}>
                                   {note.type}
                               </Badge>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">• {note.subject}</span>
                           </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-3 mt-3">
                           <span className="font-medium">{note.date}</span>
                           <span className="font-mono">{note.size}</span>
                        </div>
                    </div>
                  </Card>
                );
              })}
              
              {/* Empty State visual if no notes */}
              {filteredNotes.length === 0 && (
                  <Card className="col-span-full flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-800/20 shadow-none">
                      <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm">
                          <FolderOpen size={40} className="text-slate-300" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No notes found</h3>
                      <p className="text-slate-500 max-w-sm mb-6">Start building your library by uploading files or creating new notes.</p>
                      <Button onClick={() => setActiveTab('upload')} className="px-6 py-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold shadow-lg shadow-violet-200 dark:shadow-none">
                          Upload Files
                      </Button>
                  </Card>
              )}
            </div>
          ) : (
            /* List View */
            <Card className="rounded-3xl overflow-hidden shadow-sm">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                   <tr>
                     <th className="px-6 py-4 w-12"><div className="w-4 h-4 border-2 border-slate-300 rounded"></div></th>
                     <th className="px-6 py-4">Name</th>
                     <th className="px-6 py-4">Type</th>
                     <th className="px-6 py-4">Subject</th>
                     <th className="px-6 py-4">Date Modified</th>
                     <th className="px-6 py-4">Size</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                   {filteredNotes.map(note => (
                     <tr key={note.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer" onClick={() => setViewingNote(note)}>
                       <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><div className="w-4 h-4 border-2 border-slate-300 rounded cursor-pointer hover:border-violet-500"></div></td>
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-4">
                            <div className={cn("p-2 rounded-lg",
                                note.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                                note.type === 'image' ? 'bg-blue-50 text-blue-500' : 'bg-indigo-50 text-indigo-500'
                            )}>
                                {note.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white group-hover:text-violet-600 transition-colors">{note.title}</span>
                         </div>
                       </td>
                       <td className="px-6 py-4"><Badge variant="secondary" className="uppercase tracking-wide">{note.type}</Badge></td>
                       <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium">{note.subject}</td>
                       <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{note.date}</td>
                       <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">{note.size}</td>
                       <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" onClick={() => setGeneratingNote(note)} className="p-2 h-auto w-auto hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg text-slate-400 hover:text-amber-500" title="Generate AI Notes"><Sparkles size={16} /></Button>
                            <Button variant="ghost" onClick={() => setViewingNote(note)} className="p-2 h-auto w-auto hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg text-slate-400 hover:text-violet-600"><Eye size={16} /></Button>
                            <Button variant="ghost" onClick={() => handleDelete(note.id)} className="p-2 h-auto w-auto hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={16} /></Button>
                         </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </Card>
          )}
        </>
      )}

      {/* Upload Section */}
      {activeTab === 'upload' && (
        <div className="max-w-4xl mx-auto py-12">
          <Card 
            className={cn(
              "relative rounded-[2.5rem] border-4 border-dashed p-16 text-center transition-all duration-300 group cursor-pointer",
              dragActive 
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105 shadow-2xl' 
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-violet-400'
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
                type="file" 
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            <div className={cn("w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-300", dragActive ? 'bg-violet-100 text-violet-600 scale-110' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-violet-50 dark:group-hover:bg-violet-900/30 group-hover:text-violet-500')}>
              <UploadCloud size={56} className={isUploading ? 'animate-bounce' : ''} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              {dragActive ? "Drop it like it's hot!" : "Upload Study Materials"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Drag & drop PDFs, Images or Docs here to organize your knowledge base. <br/> Max file size 25MB.
            </p>

            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-6 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-violet-500/25 pointer-events-none">
                Browse Files
            </Button>
          </Card>

          {isUploading && (
            <Card className="mt-8 p-6 rounded-2xl animate-fade-in">
                <div className="flex items-center gap-5 mb-4">
                    <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 animate-pulse">
                        <FileText size={28} />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 dark:text-white text-lg">{uploadFileName}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Uploading to local storage...</p>
                    </div>
                    <span className="text-lg font-bold text-violet-600 dark:text-violet-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-violet-500 to-indigo-600 h-3 rounded-full transition-all duration-200 ease-out relative overflow-hidden" 
                        style={{ width: `${uploadProgress}%` }}
                    >
                       <div className="absolute inset-0 bg-white/30 animate-pulse-fast"></div>
                    </div>
                </div>
            </Card>
          )}
        </div>
      )}

      {/* New Note Modal */}
      {isCreatingNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <Card className="w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-scale-in">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600">
                          <PenSquare size={24} /> 
                        </div>
                        Create Note
                      </h3>
                      <Button variant="ghost" onClick={() => setIsCreatingNote(false)} className="rounded-xl p-2 h-auto w-auto">
                          <X size={24} />
                      </Button>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Note Title" 
                      value={newNoteTitle}
                      onChange={e => setNewNoteTitle(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white font-bold text-lg placeholder-slate-400 transition-all focus:bg-white dark:focus:bg-slate-900"
                    />
                    <textarea 
                      placeholder="Write your note here..." 
                      value={newNoteContent}
                      onChange={e => setNewNoteContent(e.target.value)}
                      className="w-full h-64 px-5 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white resize-none text-base placeholder-slate-400 transition-all focus:bg-white dark:focus:bg-slate-900 leading-relaxed"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                      <Button variant="ghost" onClick={() => setIsCreatingNote(false)} className="px-6 py-3 h-auto text-slate-600 dark:text-slate-300 font-bold">Cancel</Button>
                      <Button onClick={handleSaveTextNote} className="px-8 py-3 h-auto bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-200 dark:shadow-none">Save Note</Button>
                  </div>
              </Card>
          </div>
      )}

      {/* Note Viewer */}
      {viewingNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
             <Card className="w-full max-w-4xl h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in p-0">
                 <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                      <div className="flex items-center gap-5">
                          <div className={cn("p-3 rounded-2xl",
                            viewingNote.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'
                          )}>
                            {viewingNote.type === 'pdf' ? <FileText size={24} /> : <File size={24} />}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{viewingNote.title}</h3>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">{viewingNote.date} • {viewingNote.size}</p>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <Button variant="ghost" onClick={() => setViewingNote(null)} className="p-3 h-auto w-auto rounded-xl">
                              <X size={24} />
                          </Button>
                      </div>
                  </div>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-10 overflow-auto flex items-center justify-center relative">
                       <Card className="shadow-2xl rounded-3xl w-full max-w-2xl min-h-[500px] p-12 text-center flex flex-col items-center justify-center">
                           <div className="w-32 h-32 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-8 text-slate-300">
                               <FileText size={64} />
                           </div>
                           <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Preview Not Available</h4>
                           <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 text-lg">This file format requires downloading to view the full content in high quality.</p>
                           <Button className="px-8 py-6 bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg">Download File</Button>
                       </Card>
                  </div>
             </Card>
          </div>
      )}

      {/* AI Note Generator Modal */}
      {generatingNote && (
        <AiNoteGenerator note={generatingNote} onClose={() => setGeneratingNote(null)} />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <Card 
            className="fixed z-50 w-56 py-2 animate-scale-in origin-top-left p-0"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
            <Button 
                variant="ghost"
                onClick={() => { setGeneratingNote(notes.find(n => n.id === contextMenu.noteId) || null); setContextMenu(null); }}
                className="w-full justify-start px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 h-auto rounded-none"
            >
                <Sparkles size={16} className="text-amber-500 mr-3" /> Generate AI Notes
            </Button>
            <Button variant="ghost" className="w-full justify-start px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 h-auto rounded-none">
                <Eye size={16} className="text-slate-400 mr-3" /> Preview
            </Button>
            <Button variant="ghost" className="w-full justify-start px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 h-auto rounded-none">
                <Edit size={16} className="text-slate-400 mr-3" /> Rename
            </Button>
            <Button variant="ghost" className="w-full justify-start px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 h-auto rounded-none">
                <Copy size={16} className="text-slate-400 mr-3" /> Duplicate
            </Button>
            <Button variant="ghost" className="w-full justify-start px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 h-auto rounded-none">
                <Share2 size={16} className="text-slate-400 mr-3" /> Share
            </Button>
            <div className="my-2 border-t border-slate-100 dark:border-slate-700"></div>
            <Button 
                variant="ghost"
                onClick={() => { handleDelete(contextMenu.noteId); setContextMenu(null); }}
                className="w-full justify-start px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 h-auto rounded-none"
            >
                <Trash2 size={16} className="mr-3" /> Delete
            </Button>
        </Card>
      )}
    </div>
  );
};

export default NotesLibrary;
