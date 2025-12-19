import { Note, Session, Task, UserStats } from '../types';

export const mockStats: UserStats = {
  notesUploaded: 24,
  sessionsCount: 15,
  streak: 3,
  lastTopic: "Newton's Laws",
  completionRate: 68
};

export const mockNotes: Note[] = [
  { id: '1', title: 'Physics_Ch1_Motion', subject: 'Physics', type: 'pdf', date: '2023-10-24', size: '2.4 MB' },
  { id: '2', title: 'Calculus_Formulas', subject: 'Math', type: 'image', date: '2023-10-23', size: '1.1 MB' },
  { id: '3', title: 'Organic_Chem_Notes', subject: 'Chemistry', type: 'doc', date: '2023-10-22', size: '500 KB' },
  { id: '4', title: 'Biology_Diagrams', subject: 'Biology', type: 'image', date: '2023-10-20', size: '3.2 MB' },
];

export const mockSessions: Session[] = [
  { id: '1', topic: 'Calculus: Derivatives', date: 'Oct 24, 2023', duration: 45, steps: 12, importance: 'High' },
  { id: '2', topic: 'Physics: Kinematics', date: 'Oct 23, 2023', duration: 30, steps: 8, importance: 'Medium' },
  { id: '3', topic: 'Chemistry: Bonding', date: 'Oct 22, 2023', duration: 60, steps: 24, importance: 'Low' },
  { id: '4', topic: 'English: Grammar', date: 'Oct 20, 2023', duration: 25, steps: 5, importance: 'Low' },
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Complete Physics Chapter 3 Exercises', completed: false, dueDate: 'Today', type: 'task' },
  { id: '2', title: 'Review Calculus Formulas', completed: true, dueDate: 'Today', type: 'task' },
  { id: '3', title: 'Weekly Goal: Finish Organic Chemistry', completed: false, dueDate: 'Friday', type: 'goal' },
];