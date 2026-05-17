import api from './api';
import { News } from '../types';

interface NewsFilters {
  categoryId?: string;
  search?: string;
}

interface CreateNewsDto {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  categoryId?: string;
  isPublished?: boolean;
}

export async function getNews(filters?: NewsFilters): Promise<News[]> {
  const response = await api.get<News[]>('/news', { params: filters });
  return response.data;
}

export async function getNewsById(id: string): Promise<News> {
  const response = await api.get<News>(`/news/${id}`);
  return response.data;
}

export async function createNews(data: CreateNewsDto): Promise<News> {
  const response = await api.post<News>('/news', data);
  return response.data;
}

export async function updateNews(id: string, data: Partial<CreateNewsDto>): Promise<News> {
  const response = await api.patch<News>(`/news/${id}`, data);
  return response.data;
}

export async function deleteNews(id: string): Promise<void> {
  await api.delete(`/news/${id}`);
}
