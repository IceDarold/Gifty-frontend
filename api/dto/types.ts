export interface ReviewItemDTO {
  id: string;
  author_name: string;
  rating_val: number;
  created_at: string;
  content: string;
  tag_label?: string;
  photo_urls?: string[];
}

export interface GiftReviewsDTO {
  average_rating: number;
  total_count: number;
  source_platform?: string;
  top_highlights?: string[];
  reviews_list: ReviewItemDTO[];
}

export interface GiftDTO {
  id: string;
  title: string;
  price_value: number;
  currency: string;
  image_url: string;
  marketplace_name: string;
  category_name: string;
  tags_list: string[];
  ai_reason: string;
  min_age: number;
  max_age: number;
  min_budget: number;
  full_description?: string;
  reviews_data?: GiftReviewsDTO;
}

export interface RecommendationResponseDTO {
  featured_gift_id: string;
  gift_ids: string[];
  total: number;
}
