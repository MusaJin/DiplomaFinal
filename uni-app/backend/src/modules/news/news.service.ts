import prisma from '../../lib/prisma';

interface NewsFilters {
  categoryId?: string;
  search?: string;
  onlyPublished?: boolean;
}

interface CreateNewsDto {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  gallery?: string[];
  categoryId?: string;
  isPublished?: boolean;
  authorId: string;
}

interface UpdateNewsDto {
  title?: string;
  shortDescription?: string;
  content?: string;
  imageUrl?: string;
  gallery?: string[];
  categoryId?: string;
  isPublished?: boolean;
}

export async function getNewsList(filters: NewsFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.onlyPublished) {
    where.isPublished = true;
  }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { shortDescription: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.news.findMany({
    where,
    include: {
      author: { select: { id: true, fullName: true } },
      category: { select: { id: true, name: true } },
    },
    // Опубликованные сверху по дате публикации; черновики (publishedAt = null) — в конце
    orderBy: [
      { publishedAt: { sort: 'desc', nulls: 'last' } },
      { createdAt: 'desc' },
    ],
  });
}

export async function getNewsById(id: string, onlyPublished = false) {
  const news = await prisma.news.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, fullName: true } },
      category: { select: { id: true, name: true } },
    },
  });

  if (!news) throw new Error('Новость не найдена');
  if (onlyPublished && !news.isPublished) throw new Error('Новость не найдена');
  return news;
}

export async function createNews(data: CreateNewsDto) {
  return prisma.news.create({
    data: {
      ...data,
      publishedAt: data.isPublished ? new Date() : null,
    },
    include: {
      author: { select: { id: true, fullName: true } },
      category: { select: { id: true, name: true } },
    },
  });
}

export async function updateNews(id: string, data: UpdateNewsDto) {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new Error('Новость не найдена');

  const updateData: Record<string, unknown> = { ...data };

  // Устанавливаем дату публикации при первой публикации
  if (data.isPublished && !existing.isPublished) {
    updateData.publishedAt = new Date();
  }

  return prisma.news.update({
    where: { id },
    data: updateData,
    include: {
      author: { select: { id: true, fullName: true } },
      category: { select: { id: true, name: true } },
    },
  });
}

export async function deleteNews(id: string) {
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw new Error('Новость не найдена');

  await prisma.news.delete({ where: { id } });
}
