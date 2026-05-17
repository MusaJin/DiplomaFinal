import { Request, Response } from 'express';
import { z } from 'zod';
import { getCategoriesList, createCategory, updateCategory, deleteCategory } from './categories.service';
import { CategoryType } from '@prisma/client';

const categorySchema = z.object({
  name: z.string().min(2, 'Название слишком короткое'),
  type: z.enum(['NEWS', 'RESOURCE', 'COMMON']),
});

export async function index(req: Request, res: Response): Promise<void> {
  try {
    const { type } = req.query;
    const categories = await getCategoriesList(type as string | undefined);
    res.json(categories);
  } catch {
    res.status(500).json({ message: 'Ошибка получения категорий' });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const result = categorySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const category = await createCategory(result.data.name, result.data.type as CategoryType);
    res.status(201).json(category);
  } catch {
    res.status(500).json({ message: 'Ошибка создания категории' });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const result = categorySchema.partial().safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const category = await updateCategory(req.params.id, result.data as { name?: string; type?: CategoryType });
    res.json(category);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка обновления';
    res.status(404).json({ message });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteCategory(req.params.id);
    res.json({ message: 'Категория удалена' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления';
    res.status(404).json({ message });
  }
}
