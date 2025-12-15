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
  source?: "Ozon" | "WB" | "Partner" | "Amazon" | "Other" | "AliExpress";
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

export interface BlogContentBlock {
  type: 'paragraph' | 'h2' | 'quote' | 'list';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  metaTitle?: string; // SEO Title: "Main Keyword - Benefit"
  metaDescription?: string; // SEO Desc: Pain point + Value (160 chars)
  excerpt: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorAvatar: string;
  featured?: boolean;
  content: BlogContentBlock[];
}