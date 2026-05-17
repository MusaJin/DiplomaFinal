import { Request, Response } from 'express';
import { z } from 'zod';
import { getResourcesList, getResourceById, createResource, updateResource, deleteResource } from './resources.service';

const resourceSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  type: z.enum(['LINK', 'FILE', 'TEXT']),
  url: z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  fileUrl: z.string().url().optional().or(z.literal('')).transform(v => v || undefined),
  categoryId: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function index(req: Request, res: Response): Promise<void> {
  try {
    const { categoryId, type } = req.query;
    const isAdmin = req.user?.role === 'ADMIN';

    const resources = await getResourcesList({
      categoryId: categoryId as string | undefined,
      type: type as string | undefined,
      onlyPublished: !isAdmin,
    });

    res.json(resources);
  } catch {
    res.status(500).json({ message: 'Ошибка получения ресурсов' });
  }
}

export async function show(req: Request, res: Response): Promise<void> {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    const resource = await getResourceById(req.params.id, !isAdmin);
    res.json(resource);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка';
    res.status(404).json({ message });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  const result = resourceSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const resource = await createResource(result.data);
    res.status(201).json(resource);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка создания';
    res.status(500).json({ message });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const result = resourceSchema.partial().safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: 'Ошибка валидации', errors: result.error.flatten() });
    return;
  }

  try {
    const resource = await updateResource(req.params.id, result.data);
    res.json(resource);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка обновления';
    res.status(404).json({ message });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteResource(req.params.id);
    res.json({ message: 'Ресурс удален' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ошибка удаления';
    res.status(404).json({ message });
  }
}
