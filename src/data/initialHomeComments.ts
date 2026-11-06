import { HomeComment } from '../types/project';

export const INITIAL_HOME_COMMENTS: HomeComment[] = [
  {
    id: 'hc-01',
    authorName: 'Dr. Ramesh Narayan',
    authorRole: 'Electrical Engineer',
    topic: 'Circuit Feedback',
    message: 'Welcome to this wonderful repository! The schematics and power calculations are thoroughly documented. Looking forward to your high-frequency resonant inverter series.',
    createdAt: '2026-11-04T08:15:00Z',
    likes: 18
  },
  {
    id: 'hc-02',
    authorName: 'Pusparani Biswal',
    authorRole: 'Creator',
    isCreator: true,
    topic: 'General Inquiry',
    message: 'Welcome everyone to ElectroHub! Feel free to ask questions here on the home board or in any specific project tab. If you need any circuit calculations, component alternatives, or full source code, just let me know!',
    createdAt: '2026-11-04T09:30:00Z',
    likes: 34
  },
  {
    id: 'hc-03',
    authorName: 'Ananya Pattnaik',
    authorRole: 'Student',
    topic: 'Project Request',
    message: 'Can you please upload a battery management system (BMS) with active balancing circuit for a 4S LiFePO4 battery pack? We need it for our engineering capstone design.',
    createdAt: '2026-11-05T14:20:00Z',
    likes: 14
  },
  {
    id: 'hc-04',
    authorName: 'Vikram Joshi',
    authorRole: 'Hobbyist',
    topic: 'Component Sourcing',
    message: 'Where do you usually source the toroidal ferrite cores with high AL values for the gate drive transformers? Great work on the diagrams!',
    createdAt: '2026-11-05T19:40:00Z',
    likes: 7
  }
];
