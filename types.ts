
export enum UserRole {
  GUEST = 'GUEST',
  REGISTERED = 'REGISTERED',
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  organization?: string;
  function?: string;
  region?: string;
  isVerified: boolean;
  birthDate?: string;
  interests?: string[];
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface NewsPost {
  id: string;
  title: string;
  content: string;
  visibility: UserRole | 'U30';
  author: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  status: 'draft' | 'submitted' | 'approved' | 'published';
  reviewNotes?: string;
  date: string;
}

export interface ChatGroup {
  id: string;
  name: string;
  description: string;
  members: string[]; // user IDs
  isAdmin: boolean;
  isPublic: boolean;
}

export function getAgeFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hasHadBirthdayThisYear) age--;
  return age;
}

export function isUnder30(birthDate: string): boolean {
  return getAgeFromBirthDate(birthDate) < 30;
}

export interface FileAsset {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'folder';
  visibility: 'PUBLIC' | 'REGISTERED' | 'MEMBER' | 'FUNCTIONARY';
  ownerId: string;
}
