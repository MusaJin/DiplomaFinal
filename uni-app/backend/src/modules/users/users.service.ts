import prisma from '../../lib/prisma';

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      faculty: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  return users;
}
