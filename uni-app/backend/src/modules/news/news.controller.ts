import { Request, Response } from 'express';
import { z } from 'zod';
import { getNewsList, getNewsById, createNews, updateNews, deleteNews } from './news.service';

const createNewsSchema = z.object({
  title: z.string().min(3, 'Введите название (минимум 3 символа)'),
  shortDescription: z.string().optional().default(''),
  content: z.string().optional().default(''),
  imageUrl: z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  gallery: z.array(z.string().url()).optional(),
  categoryId: z.string().optional(),
  isPublished: z.boolean().optional(),
});

const updateNewsSchema = createNewsSchema.partial();

export async function index(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId, search } = req.query;
    const isAdmin = req.user?.role === 'ADMIN';

    const news = await getNewsList({
      categoryId: categoryId as string | undefined,
      search: search as string | undefined,
      onlyPublished: !isAdmin,
    });

    res.json(news);
  } catch {
    res.status(500).json({ message: 'Ошибка получения новостей' });
  }
}

export async function show(req: Request, res: Response): Promise<void> {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const news = await getNewsById(req.params.id, !isAdmin);
    res.json(news);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка';
    res.status(404).json({ message });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const result = createNewsSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const news = await createNews({ ...result.data, authorId: req.user!.userId });
    res.status(201).json(news);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка создания';
    res.status(500).json({ message });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const result = updateNewsSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const news = await updateNews(req.params.id, result.data);
    res.json(news);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка обновления';
    res.status(404).json({ message });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteNews(req.params.id);
    res.json({ message: 'Новость удалена' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления';
    res.status(404).json({ message });
  }
}
