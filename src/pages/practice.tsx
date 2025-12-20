import React, { useState } from 'react';
import { practiceResources } from '../data/static-data';
import { FileText, Image as ImageIcon, Search, Book, Download, Eye, X, Filter, Star } from 'lucide-react';
import { useToast } from '../context/toast-context';

const Practice: React.FC = () => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  const filteredResources = practiceResources.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    res.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    showToast(`Downloading ${title}...`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-10 max-w-7xl mx-auto">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
             <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600"><Book size={24} /></div>
             Practice & Resources
           </h1>
           <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Free formula sheets, cheat sheets, and summaries.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search topics..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm group-hover:shadow-md"
                />
            </div>
            <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-indigo-600 shadow-sm hover:shadow-md transition-all">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
            <div 
                key={res.id} 
                className="group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-violet-300 dark:hover:border-violet-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                onClick={() => setSelectedResource(res)}
            >
                {/* Decorative blob */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-bl-full transition-transform group-hover:scale-150 duration-500 ${
                    res.subject === 'Physics' ? 'from-blue-500 to-indigo-500' :
                    res.subject === 'Chemistry' ? 'from-purple-500 to-pink-500' : 'from-emerald-500 to-teal-500'
                }`}></div>

                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className={`p-4 rounded-2xl shadow-sm ${
                         res.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                    }`}>
                        {res.type === 'pdf' ? <FileText size={32} /> : <ImageIcon size={32} />}
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide shadow-sm ${
                        res.subject === 'Physics' ? 'bg-blue-100 text-blue-700' :
                        res.subject === 'Chemistry' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {res.subject}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{res.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 leading-relaxed">{res.description}</p>
                
                {/* Rating Stub */}
                <div className="flex items-center gap-1 mb-6">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <Star size={14} className="fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700" />
                    <span className="text-xs text-slate-400 ml-1 font-medium">(12)</span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-5 mt-auto">
                    <span className="text-xs font-bold text-slate-400 group-hover:text-violet-600 transition-colors flex items-center gap-2 uppercase tracking-wide">
                        <Eye size={16} /> Preview
                    </span>
                    <button 
                        onClick={(e) => handleDownload(e, res.title)}
                        className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-500 hover:bg-violet-600 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5"
                        title="Download"
                    >
                        <Download size={18} />
                    </button>
                </div>
            </div>
        ))}
      </div>

      {/* File Viewer Modal */}
      {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
              <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-scale-in ring-1 ring-white/10">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                      <div className="flex items-center gap-5">
                          <div className={`p-2.5 rounded-xl ${selectedResource.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                             {selectedResource.type === 'pdf' ? <FileText size={24} /> : <ImageIcon size={24} />}
                          </div>
                          <div>
                              <h3 className="font-bold text-slate-800 dark:text-white text-lg">{selectedResource.title}</h3>
                              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Read-only Mode • Local Viewer</p>
                          </div>
                      </div>
                      <div className="flex gap-3">
                          <button 
                            onClick={(e) => handleDownload(e, selectedResource.title)}
                            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-violet-200 dark:shadow-none flex items-center gap-2"
                          >
                              <Download size={18} /> Download
                          </button>
                          <button 
                            onClick={() => setSelectedResource(null)}
                            className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
                          >
                              <X size={24} />
                          </button>
                      </div>
                  </div>
                  
                  {/* Viewer Content */}
                  <div className="flex-1 bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-10 overflow-auto relative">
                      <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-3xl w-full max-w-3xl min-h-[600px] border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-16">
                          
                          <div className="w-32 h-32 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-8">
                              {selectedResource.type === 'pdf' ? <FileText size={64} className="text-slate-300" /> : <ImageIcon size={64} className="text-slate-300" />}
                          </div>
                          
                          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Preview Placeholder</h2>
                          <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg">
                              This is a simulated viewer. In production, this would render the actual <strong>{selectedResource.title}</strong> file.
                          </p>
                          
                          <div className="mt-10 flex gap-4">
                              <button className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                                  Page 1
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Practice;