export type UserRole = 'student' | 'faculty';

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  semester: string;
  section: string;
  email: string;
  avatarUrl: string;
  rank: number;
  totalStudents: number;
  percentileText: string;
  creditsEarned: number;
  totalCredits: number;
  cgpa: number;
  cgpaChange: number;
  targetCgpa: number;
  attendancePct: number;
  attendanceSafeZonePct: number;
  bunkBufferHours: number;
  academicAdvisor: string;
  batchYear: string;
}

export interface FacultyProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  avatarUrl: string;
  assignedBatches: string[];
  totalStudents: number;
  coursesCount: number;
}

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  credits: number;
  faculty: string;
  attended: number;
  conducted: number;
  internals: number; // out of 20
  assignments: number; // out of 20
  midTerm: number; // out of 30
  endTermProj: number; // out of 30
}

export interface RadarDataPoint {
  subject: string;
  studentScore: number;
  batchAvg: number;
}

export interface ProgressionDataPoint {
  semester: string;
  sgpa: number;
  cgpa: number;
}

export type OpportunityCategory = 'HACKATHON' | 'INTERNSHIP' | 'COMPETITION' | 'WORKSHOP';

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  category: OpportunityCategory;
  isInternal: boolean;
  daysLeft: number;
  deadlineDate: string;
  skills: string[];
  saved: boolean;
  description: string;
  stipendOrPrize: string;
  location: string;
  registeredCount: number;
}

export type ResourceType = 'NOTES' | 'PYQ' | 'CHEATSHEET' | 'PLAYLIST';

export interface AcademicResource {
  id: string;
  title: string;
  type: ResourceType;
  subject: string;
  author: string;
  upvotes: number;
  userUpvoted?: boolean;
  rating: number;
  completed: boolean;
  size: string;
  downloadUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'event' | 'academic' | 'attendance';
  unread: boolean;
}

export type ActiveTab = 'analytics' | 'attendance' | 'opportunities' | 'resources' | 'settings';

export interface AppSettings {
  darkMode: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  notificationsEnabled: boolean;
  attendanceThreshold: number;
  hapticFeedback: boolean;
}
