import prisma from '../../lib/prisma';

interface ResourceFilters {
  categoryId?: string;
  type?: string;
  onlyPublished?: boolean;
}

interface CreateResourceDto {
  title: string;
  description: string;
  type: 'LINK' | 'FILE' | 'TEXT';
  url?: string;
  fileUrl?: string;
  categoryId?: string;
  isPublished?: boolean;
}

interface UpdateResourceDto {
  title?: string;
  description?: string;
  type?: 'LINK' | 'FILE' | 'TEXT';
  url?: string;
  fileUrl?: string;
  categoryId?: string;
  isPublished?: boolean;
}

export async function getResourcesList(filters: ResourceFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.onlyPublished) {
    where.isPublished = true;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.type) {
    where.type = filters.type;
  }

  return prisma.resource.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getResourceById(id: string, onlyPublished = false) {
  const resource = await prisma.resource.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  if (!resource) throw new Error('Ресурс не найден');
  if (onlyPublished && !resource.isPublished) throw new Error('Ресурс не найден');
  return resource;
}

export async function createResource(data: CreateResourceDto) {
  return prisma.resource.create({
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });
}

export async function updateResource(id: string, data: UpdateResourceDto) {
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing) throw new Error('Ресурс не найден');

  return prisma.resource.update({
    where: { id },
    data,
    include: {
      category: { select: { id: true, name: true } },
    },
  });
}

export async function deleteResource(id: string) {
  const existing = await prisma.resource.findUnique({ where: { id } });
  if (!existing) throw new Error('Ресурс не найден');

  await prisma.resource.delete({ where: { id } });
}
