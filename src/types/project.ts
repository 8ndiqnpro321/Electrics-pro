export type ProjectCategory = 
  | 'All'
  | 'IoT & Embedded'
  | 'Power Electronics'
  | 'Renewable Energy'
  | 'Robotics & Motor Control'
  | 'High Voltage & Analog'
  | 'Automation & Sensors';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ComponentItem {
  id: string;
  name: string;
  specification: string;
  quantity: number | string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  authorName: string;
  authorRole: 'Student' | 'Electrical Engineer' | 'Hobbyist' | 'Creator' | 'Researcher';
  isCreator?: boolean;
  message: string;
  createdAt: string;
  likes: number;
  rating?: number; // 1 to 5 stars
  replyTo?: string;
}

export interface HomeComment {
  id: string;
  authorName: string;
  authorRole: 'Student' | 'Electrical Engineer' | 'Hobbyist' | 'Creator' | 'Researcher' | 'Visitor';
  topic: 'General Inquiry' | 'Project Request' | 'Question to Creator' | 'Circuit Feedback' | 'Component Sourcing';
  isCreator?: boolean;
  message: string;
  createdAt: string;
  likes: number;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  summary: string;
  description: string;
  voltageRating: string; // e.g. "5V DC / 12V 2A" or "230V AC"
  difficulty: DifficultyLevel;
  components: ComponentItem[];
  wiringInstructions?: string;
  
  // Visuals
  projectPicUrl: string; // Real finished build or hardware prototype
  diagramPicUrl: string; // Circuit schematic / wiring diagram
  additionalPics?: string[];
  
  // Code details (OPTIONAL: if empty or undefined, viewers will NOT see the code tab)
  code?: string;
  codeLanguage?: 'Arduino (C++)' | 'C / Embedded C' | 'Python' | 'MicroPython' | 'Ladder Logic' | 'MATLAB / Simulink' | 'Other';
  codeFileName?: string;
  
  // Author & metadata
  authorName: string;
  authorRole?: string;
  authorContact?: string;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  comments: ProjectComment[];
}
