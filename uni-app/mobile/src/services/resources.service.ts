import api from './api';
import { Resource, ResourceType } from '../types';

interface ResourceFilters {
  categoryId?: string;
  type?: ResourceType;
}

interface CreateResourceDto {
  title: string;
  description: string;
  type: ResourceType;
  url?: string;
  fileUrl?: string;
  categoryId?: string;
  isPublished?: boolean;
}

export async function getResources(filters?: ResourceFilters): Promise<Resource[]> {
  const response = await api.get<Resource[]>('/resources', { params: filters });
  return response.data;
}

export async function getResourceById(id: string): Promise<Resource> {
  const response = await api.get<Resource>(`/resources/${id}`);
  return response.data;
}

export async function createResource(data: CreateResourceDto): Promise<Resource> {
  const response = await api.post<Resource>('/resources', data);
  return response.data;
}

export async function updateResource(id: string, data: Partial<CreateResourceDto>): Promise<Resource> {
  const response = await api.patch<Resource>(`/resources/${id}`, data);
  return response.data;
}

export async function deleteResource(id: string): Promise<void> {
  await api.delete(`/resources/${id}`);
}
