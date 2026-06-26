export type Gender = 'male' | 'female' | 'other';
export type Role = 'admin' | 'editor' | 'viewer';

export interface Person {
  _id: string;
  firstName: string;
  lastName: string;
  maidenName?: string;
  gender: Gender;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  isAlive: boolean;
  bio?: string;
  photo?: string;
  parents: PersonRef[];
  spouses: PersonRef[];
  children: PersonRef[];
  linkedUser?: string;
  addedBy: string;
  createdAt: string;
}

export interface PersonRef {
  _id: string;
  firstName: string;
  lastName: string;
  photo?: string;
  gender?: Gender;
  birthDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
