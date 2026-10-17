export type UniversityDepartment = 
  | 'School of Computing'
  | 'MIT Institute of Design (IOD)'
  | 'School of Engineering & Tech'
  | 'School of Bioengineering'
  | 'MIT College of Management'
  | 'School of Film & Media (ISBJ)'
  | 'School of Architecture & Planning'
  | 'Vishwashanti Sangeet Kala';

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  department: UniversityDepartment;
  yearOfStudy: string;
  prnNumber: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  skills: string[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export type PhotoFilterType = 
  | 'normal'
  | 'clarendon'
  | 'juno'
  | 'lark'
  | 'valencia'
  | 'gingham'
  | 'cyberpunk'
  | 'monochrome'
  | 'sepia'
  | 'lofi'
  | 'slumber'
  | 'warmth';

export interface FilterPreset {
  id: PhotoFilterType;
  name: string;
  cssFilter: string;
  description: string;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorDept: UniversityDepartment;
  text: string;
  createdAt: string;
}

export interface CampusPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorDept: UniversityDepartment;
  mediaUrl: string;
  filterName: PhotoFilterType;
  filterCustomStyle?: string;
  caption: string;
  departmentTag?: UniversityDepartment;
  tags: string[];
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  comments?: PostComment[];
  isBookmarked?: boolean;
  campusLocation?: string;
  createdAt: string;
}

export interface CampusStory {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  department: UniversityDepartment;
  imageUrl: string;
  caption: string;
  timestamp: string;
  isViewed?: boolean;
}

export interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'P';
  points: number;
  status: 'Passed' | 'Distinction' | 'Pending';
}

export interface SemesterRecord {
  semesterNumber: number;
  semesterName: string;
  academicYear: string;
  creditsRegistered: number;
  creditsEarned: number;
  sgpa: number;
  courses: CourseGrade[];
}

export interface StudentAcademicRecord {
  id: string;
  userId: string;
  studentName: string;
  prn: string;
  department: UniversityDepartment;
  currentSemester: number;
  cumulativeGpa: number;
  totalCreditsEarned: number;
  totalCreditsRequired: number;
  rankInDept?: number;
  semesters: SemesterRecord[];
  updatedAt: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  primaryDept: UniversityDepartment;
  targetDepts: UniversityDepartment[];
  topic: string;
  membersCount: number;
  createdBy: string;
  creatorName: string;
  creatorAvatar: string;
  meetingSchedule: string;
  isMember?: boolean;
  createdAt: string;
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderDept: UniversityDepartment;
  text: string;
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  isRead?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  department: UniversityDepartment | 'All University';
  category: 'Fest' | 'Hackathon' | 'Design' | 'Workshop' | 'Tech' | 'Sports';
  date: string;
  time: string;
  venue: string;
  bannerUrl: string;
  attendeesCount: number;
  isRsvp?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'study_group' | 'grade' | 'connect' | 'like';
  timestamp: string;
  isRead: boolean;
  targetId?: string;
  avatar?: string;
}
