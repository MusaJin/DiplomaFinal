import api from './api';
import { Category, CategoryType } from '../types';

interface CreateCategoryDto {
  name: string;
  type: CategoryType;
}

export async function getCategories(type?: CategoryType): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories', { params: type ? { type } : {} });
  return response.data;
}

export async function createCategory(data: CreateCategoryDto): Promise<Category> {
  const response = await api.post<Category>('/categories', data);
  return response.data;
}

export async function updateCategory(id: string, data: Partial<CreateCategoryDto>): Promise<Category> {
  const response = await api.patch<Category>(`/categories/${id}`, data);
  return response.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`);
}
