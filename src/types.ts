
export interface AIResponse {
  page: string;
  actions: string[];
  quick_suggestions: string[];
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  type: 'pdf' | 'image' | 'doc';
  date: string;
  size: string;
}

export interface Session {
  id: string;
  topic: string;
  date: string;
  duration: number; // minutes
  steps: number;
  importance: 'High' | 'Medium' | 'Low';
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  type: 'task' | 'goal';
  subject?: string;
}

export interface UserStats {
  notesUploaded: number;
  sessionsCount: number;
  streak: number;
  lastTopic: string;
  completionRate: number;
}

export type PageName = 
  | 'dashboard_home' 
  | 'notes_library' 
  | 'preparation_room' 
  | 'timeline' 
  | 'study_plan' 
  | 'notifications' 
  | 'settings' 
  | 'profile' 
  | 'help_support';

export type NoteType = 'long_notes' | 'short_notes' | 'formula_sheet' | 'exam_answer' | 'flashcards';
export type NoteLanguage = 'english' | 'hinglish' | 'hindi';
export type NoteDepth = 'basic' | 'medium' | 'deep';

export interface NoteGenerationConfig {
  noteType: NoteType;
  language: NoteLanguage;
  depth: NoteDepth;
}

export interface GeneratedNoteContent {
  title: string;
  type: NoteType;
  content: string; // Markdown-like string or HTML
  tags: string[];
  citations: string[]; // For Zero Hallucination source tracking
}
