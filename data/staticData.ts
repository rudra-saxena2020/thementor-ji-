import { Task } from '../types';

export const motivationalQuotes = [
  { text: "The only way to learn mathematics is to do mathematics.", author: "Paul Halmos" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Education is the passport to the future.", author: "Malcolm X" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" }
];

export const studyTemplates: Record<string, Partial<Task>[]> = {
  "7-day": [
    { title: "Day 1: Physics Mechanics Review", type: "task" },
    { title: "Day 2: Chemistry Atomic Structure", type: "task" },
    { title: "Day 3: Math Calculus Basics", type: "task" },
    { title: "Day 4: Physics Thermodynamics", type: "task" },
    { title: "Day 5: Chemistry Bonding", type: "task" },
    { title: "Day 6: Math Algebra Practice", type: "task" },
    { title: "Day 7: Full Week Revision", type: "goal" },
  ],
  "15-day": [
    { title: "Day 1-3: Physics Intensive", type: "goal" },
    { title: "Day 4-6: Chemistry Organic", type: "goal" },
    { title: "Day 7: Mock Test 1", type: "task" },
    { title: "Day 8-10: Math Calculus Deep Dive", type: "goal" },
    { title: "Day 11-13: Previous Year Questions", type: "task" },
    { title: "Day 14: Formula Revision", type: "task" },
    { title: "Day 15: Final Mock Test", type: "goal" },
  ]
};

export const practiceResources = [
  {
    id: 'res-1',
    title: 'Physics Formula Sheet',
    subject: 'Physics',
    type: 'pdf',
    description: 'All essential formulas for Mechanics and Thermodynamics.'
  },
  {
    id: 'res-2',
    title: 'Periodic Table Quick Ref',
    subject: 'Chemistry',
    type: 'image',
    description: 'High-res periodic table with oxidation states.'
  },
  {
    id: 'res-3',
    title: 'Trigonometry Cheat Sheet',
    subject: 'Math',
    type: 'pdf',
    description: 'Identities, values, and graph transformations.'
  },
  {
    id: 'res-4',
    title: 'Organic Reaction Maps',
    subject: 'Chemistry',
    type: 'pdf',
    description: 'Flowcharts for common organic conversions.'
  }
];

// Curated list of premium avatars (Diversity: Gender, Hair, Glasses, Skin Tone)
export const PREMIUM_AVATARS = [
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg", // Male, Sunglasses
  "https://img.freepik.com/free-psd/3d-illustration-person-with-pink-hair_23-2149436186.jpg", // Female, Pink Hair
  "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436190.jpg", // Female, Glasses
  "https://img.freepik.com/free-psd/3d-illustration-business-man-with-glasses_23-2149436194.jpg", // Male, Formal
  "https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg", // Female, Long Hair
  "https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611765.jpg", // Male, Casual
  "https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436185.jpg", // Female, Short Hair
  "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436192.jpg" // Female, Curly Hair
];
