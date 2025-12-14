import { MOCK_DB_GIFTS } from './data';
import { GiftDTO, RecommendationResponseDTO } from '../dto/types';
import { QuizAnswers, Gift } from '../../domain/types';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to convert Domain Gift to GiftDTO (In a real backend, this happens on server)
const toDTO = (gift: Gift): GiftDTO => ({
  id: gift.id,
  title: gift.title,
  price_value: gift.price,
  currency: 'RUB',
  image_url: gift.image,
  marketplace_name: gift.marketplace,
  category_name: gift.category,
  tags_list: gift.tags,
  ai_reason: gift.reason,
  min_age: gift.ageRange[0],
  max_age: gift.ageRange[1],
  min_budget: gift.minBudget,
  full_description: gift.description,
  reviews_data: gift.reviews ? {
    average_rating: gift.reviews.rating,
    total_count: gift.reviews.count,
    source_platform: gift.reviews.source,
    top_highlights: gift.reviews.highlights,
    reviews_list: gift.reviews.items.map(r => ({
      id: r.id,
      author_name: r.author,
      rating_val: r.rating,
      created_at: r.date,
      content: r.text,
      tag_label: r.tag,
      photo_urls: r.photos
    }))
  } : undefined
});

export const MockServer = {
  // New method for fetching filtered lists (for showcases)
  async getGifts(params?: { limit?: number; tag?: string; category?: string }): Promise<GiftDTO[]> {
    await delay(300); // Fast response for homepage

    let results = [...MOCK_DB_GIFTS];

    if (params?.tag) {
      const tagLower = params.tag.toLowerCase();
      results = results.filter(g => g.tags.some(t => t.toLowerCase().includes(tagLower)));
    }

    if (params?.category) {
       results = results.filter(g => g.category === params.category);
    }

    // Shuffle slightly to make it look dynamic
    if (!params?.tag && !params?.category) {
        results.sort(() => Math.random() - 0.5);
    }

    if (params?.limit) {
      results = results.slice(0, params.limit);
    }

    return results.map(toDTO);
  },

  async getGiftsByIds(ids: string[]): Promise<GiftDTO[]> {
    await delay(300 + Math.random() * 400); // 300-700ms delay
    
    // Simulate rare random error
    if (Math.random() < 0.02) throw new Error("Network Error: Failed to fetch gifts");

    const gifts = MOCK_DB_GIFTS.filter(g => ids.includes(g.id));
    return gifts.map(toDTO);
  },

  async getGiftById(id: string): Promise<GiftDTO> {
    await delay(200);
    const gift = MOCK_DB_GIFTS.find(g => g.id === id);
    if (!gift) throw new Error("Gift not found");
    return toDTO(gift);
  },

  async getRecommendations(answers: QuizAnswers): Promise<RecommendationResponseDTO> {
    await delay(1200); // AI "Thinking" delay

    // Logic migrated from old services/recommendation.ts
    const scoredGifts = MOCK_DB_GIFTS.map(gift => {
      let score = 0;
      
      let maxBudget = 1000000;
      if (answers.budget.includes('До 2 000')) maxBudget = 2000;
      else if (answers.budget.includes('2 000 - 5 000')) maxBudget = 5000;
      else if (answers.budget.includes('5 000 - 10 000')) maxBudget = 10000;
      else if (answers.budget.includes('10 000 - 30 000')) maxBudget = 30000;
      else if (answers.budget.includes('30 000 ₽ +')) maxBudget = 1000000;
      
      if (gift.price <= maxBudget * 1.2) {
        score += 5;
      } else {
        score -= 10;
      }

      const relationLower = answers.relationship.toLowerCase();
      const giftTags = gift.tags.join(' ').toLowerCase();
      
      if (giftTags.includes(relationLower)) score += 5;
      
      if (relationLower === 'партнер' && (giftTags.includes('муж') || giftTags.includes('романтика'))) score += 3;
      if (relationLower === 'папа' && giftTags.includes('мужчина')) score += 2;
      if (relationLower === 'мама' && giftTags.includes('женщина')) score += 2;
      if (relationLower === 'бабушка/дед' && (giftTags.includes('бабушка') || giftTags.includes('дед'))) score += 5;
      if (relationLower === 'брат/сестра' && (giftTags.includes('брат') || giftTags.includes('сестра'))) score += 5;
      
      const interests = answers.interests.toLowerCase().split(/[\s,]+/);
      interests.forEach(interest => {
        const cleanInterest = interest.replace(/[.,!?;:]/g, '');
        if (cleanInterest.length > 2) {
           if (giftTags.includes(cleanInterest)) score += 4;
           if (gift.title.toLowerCase().includes(cleanInterest)) score += 3;
        }
      });

      let targetAge = 30;
      if (answers.ageGroup.includes('0-7')) targetAge = 5;
      if (answers.ageGroup.includes('8-15')) targetAge = 12;
      if (answers.ageGroup.includes('16-24')) targetAge = 20;
      if (answers.ageGroup.includes('50-70')) targetAge = 60;

      if (targetAge >= gift.ageRange[0] && targetAge <= gift.ageRange[1]) {
        score += 3;
      }

      return { gift, score };
    });

    scoredGifts.sort((a, b) => b.score - a.score);
    const topGifts = scoredGifts.slice(0, 10).map(i => i.gift);

    return {
      featured_gift_id: topGifts[0]?.id || '1',
      gift_ids: topGifts.map(g => g.id),
      total: topGifts.length
    };
  },

  // Wishlist "Database" simulation using LocalStorage directly for persistence
  async getWishlist(): Promise<string[]> {
    await delay(400);
    const stored = localStorage.getItem('gifty_wishlist');
    return stored ? JSON.parse(stored) : [];
  },

  async addToWishlist(giftId: string): Promise<void> {
    await delay(200);
    const stored = localStorage.getItem('gifty_wishlist');
    const list: string[] = stored ? JSON.parse(stored) : [];
    if (!list.includes(giftId)) {
        list.push(giftId);
        localStorage.setItem('gifty_wishlist', JSON.stringify(list));
    }
  },

  async removeFromWishlist(giftId: string): Promise<void> {
    await delay(200);
    const stored = localStorage.getItem('gifty_wishlist');
    const list: string[] = stored ? JSON.parse(stored) : [];
    const newList = list.filter(id => id !== giftId);
    localStorage.setItem('gifty_wishlist', JSON.stringify(newList));
  }
};