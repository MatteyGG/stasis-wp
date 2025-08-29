// app/public-profile/[id]/page.tsx

import { prisma } from "@/lib/prisma";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      rank: true,
      nation: true,
      army: true,
      tgref: true,
      created_at: true,
      approved: true,
    },
  });
  
  if (!user) {
    return <div>Пользователь не найден</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
      <div className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold">Имя пользователя</h2>
          <p>{user.username}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Ранг</h2>
          <p>{user.rank}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Армия</h2>
          <p>{user.army}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Нация</h2>
          <p>{user.nation}</p>
        </div>
        {/* Только публичная информация, без email и других приватных данных */}
      </div>
    </div>
  );
}