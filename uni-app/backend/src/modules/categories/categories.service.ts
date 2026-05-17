import prisma from '../../lib/prisma';
import { CategoryType } from '@prisma/client';

export async function getCategoriesList(type?: string) {
  const where = type ? { type: type as CategoryType } : {};
  return prisma.category.findMany({ where, orderBy: { name: 'asc' } });
}

export async function createCategory(name: string, type: CategoryType) {
  return prisma.category.create({ data: { name, type } });
}

export async function updateCategory(id: string, data: { name?: string; type?: CategoryType }) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error('Категория не найдена');
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) throw new Error('Категория не найдена');
  await prisma.category.delete({ where: { id } });
}
