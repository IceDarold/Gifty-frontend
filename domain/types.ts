export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
  tag?: string;
  photos?: string[];
}

export interface GiftReviews {
  rating: number;
  count: number;
  source?: "Ozon" | "WB" | "Partner" | "Amazon" | "Other";
  highlights?: string[];
  items: ReviewItem[];
}

export interface Gift {
  id: string;
  title: string;
  price: number;
  image: string;
  marketplace: 'Ozon' | 'WB' | 'Amazon' | 'AliExpress' | 'Local' | 'Other';
  category: string;
  tags: string[];
  reason: string;
  ageRange: [number, number];
  minBudget: number;
  description?: string;
  reviews?: GiftReviews;
  // Internal scoring field used during recommendation logic, optional in domain
  _score?: number; 
}

export interface QuizAnswers {
  name: string;
  ageGroup: string;
  relationship: string;
  city: string;
  interests: string;
  budget: string;
}

export type StepId = 'name' | 'age' | 'relationship' | 'city' | 'interests' | 'budget';

export interface FilterState {
  budget: string;
  category: string;
  marketplace: string;
}

export interface CalendarEvent {
  id: string;
  title: string; // e.g. "Мамин ДР"
  date: string; // ISO date string YYYY-MM-DD
  personName: string; // "Мама"
  relationship: string; // For quiz pre-fill
}

export interface UserProfile {
  name: string;
  avatarEmoji: string;
  level: string; // "Novice", "Expert", etc.
  events: CalendarEvent[];
}