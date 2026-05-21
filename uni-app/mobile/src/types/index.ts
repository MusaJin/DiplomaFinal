export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type ResourceType = 'LINK' | 'FILE' | 'TEXT';
export type CategoryType = 'NEWS' | 'RESOURCE' | 'COMMON';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  faculty?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
}

export interface News {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  gallery?: string[];
  isPublished: boolean;
  publishedAt?: string;
  authorId: string;
  categoryId?: string;
  author: { id: string; fullName: string };
  category?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url?: string;
  fileUrl?: string;
  categoryId?: string;
  category?: { id: string; name: string };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  sentAt: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Типы для навигации
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: undefined;
  AdminMain: undefined;
  NewsDetail: { id: string };
  ResourceDetail: { id: string };
  AdminNewsForm: { id?: string };
  AdminResourceForm: { id?: string };
};

export type TabParamList = {
  Home: undefined;
  NewsList: undefined;
  ResourcesList: undefined;
  Profile: undefined;
};

export type AdminTabParamList = {
  AdminNewsList: undefined;
  AdminResourceList: undefined;
  AdminCategories: undefined;
  AdminNotification: undefined;
  Profile: undefined;
};
