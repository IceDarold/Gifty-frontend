import { QuizAnswers, Gift, UserProfile, CalendarEvent } from '../domain/types';
import { mapGiftDTOToGift } from '../mappers/gift';
import { MockServer } from './mock/server';

// This Client abstracts the "Network" layer.
// In the future, replace MockServer calls with axios/fetch calls to real API.

export const api = {
  gifts: {
    getById: async (id: string): Promise<Gift> => {
      const dto = await MockServer.getGiftById(id);
      return mapGiftDTOToGift(dto);
    },
    getMany: async (ids: string[]): Promise<Gift[]> => {
      const dtos = await MockServer.getGiftsByIds(ids);
      return dtos.map(mapGiftDTOToGift);
    },
    // New method for showcases
    list: async (params?: { limit?: number; tag?: string; category?: string }): Promise<Gift[]> => {
      const dtos = await MockServer.getGifts(params);
      return dtos.map(mapGiftDTOToGift);
    },
    getSimilar: async (id: string): Promise<Gift[]> => {
      const dtos = await MockServer.getSimilarGifts(id);
      return dtos.map(mapGiftDTOToGift);
    }
  },
  recommendations: {
    create: async (answers: QuizAnswers) => {
      const response = await MockServer.getRecommendations(answers);
      return response; // Returns IDs, typically.
    }
  },
  wishlist: {
    getAll: async (): Promise<string[]> => {
      return MockServer.getWishlist();
    },
    add: async (id: string): Promise<void> => {
      return MockServer.addToWishlist(id);
    },
    remove: async (id: string): Promise<void> => {
      return MockServer.removeFromWishlist(id);
    }
  },
  user: {
    get: async (): Promise<UserProfile> => MockServer.getUserProfile(),
    update: async (data: Partial<UserProfile>): Promise<UserProfile> => MockServer.updateUserProfile(data),
    addEvent: async (event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => MockServer.addEvent(event),
    removeEvent: async (id: string): Promise<void> => MockServer.removeEvent(id)
  }
};