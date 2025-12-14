import { GiftDTO, GiftReviewsDTO, ReviewItemDTO } from '../api/dto/types';
import { Gift, GiftReviews, ReviewItem } from '../domain/types';

const mapReviewItem = (dto: ReviewItemDTO): ReviewItem => ({
  id: dto.id,
  author: dto.author_name,
  rating: dto.rating_val,
  date: dto.created_at,
  text: dto.content,
  tag: dto.tag_label,
  photos: dto.photo_urls,
});

const mapReviews = (dto: GiftReviewsDTO): GiftReviews => ({
  rating: dto.average_rating,
  count: dto.total_count,
  source: dto.source_platform as any, // In real app, validate enum
  highlights: dto.top_highlights,
  items: dto.reviews_list.map(mapReviewItem),
});

export const mapGiftDTOToGift = (dto: GiftDTO): Gift => ({
  id: dto.id,
  title: dto.title,
  price: dto.price_value,
  image: dto.image_url,
  marketplace: dto.marketplace_name as any, // In real app, validate enum
  category: dto.category_name,
  tags: dto.tags_list,
  reason: dto.ai_reason,
  ageRange: [dto.min_age, dto.max_age],
  minBudget: dto.min_budget,
  description: dto.full_description,
  reviews: dto.reviews_data ? mapReviews(dto.reviews_data) : undefined,
});
