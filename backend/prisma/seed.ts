import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Запуск seed...');

  const ideas = [
    { title: 'Добавить тёмную тему', description: 'Чтобы глаза не уставали ночью' },
    { title: 'Сделать мобильное приложение', description: 'Для удобного доступа с телефона' },
    { title: 'Интеграция с Telegram', description: 'Чтобы получать уведомления прямо в чат' },
    { title: 'API для разработчиков', description: 'Позволит сторонним сервисам подключаться' },
    { title: 'Система комментариев', description: 'Пусть пользователи обсуждают идеи' },
    { title: 'Возможность прикреплять изображения', description: 'Чтобы можно было визуализировать идею' },
    { title: 'Добавить теги для идей', description: 'Чтобы проще было фильтровать и искать' },
    { title: 'Личный кабинет пользователя', description: 'Чтобы отслеживать свои идеи и голоса' },
    { title: 'Рейтинг активных участников', description: 'Чтобы мотивировать людей предлагать идеи' },
    { title: 'Поддержка нескольких языков', description: 'Сделать сайт доступным для всех' },
    { title: 'Уведомления о новых идеях', description: 'Чтобы не пропускать свежие предложения' },
    { title: 'Панель модерации идей', description: 'Для проверки контента перед публикацией' },
    { title: 'Возможность редактировать свои идеи', description: 'Исправить или дополнить после публикации' },
    { title: 'Сортировка по дате добавления', description: 'Чтобы видеть самые новые предложения' },
    { title: 'История изменений идей', description: 'Прозрачность для всех пользователей' },
    ];

  for (const data of ideas) {
    await prisma.idea.create({
      data
    });
  }

  console.log('💡 Идеи добавлены');

  const votes = [
    { ip: '1.1.1.1', ideaId: 1 },
    { ip: '1.1.1.1', ideaId: 2 },
    { ip: '2.2.2.2', ideaId: 1 },
    { ip: '3.3.3.3', ideaId: 3 },
  ];

  await prisma.vote.createMany({
    data: votes,
  });

  const allIdeas = await prisma.idea.findMany({ select: { id: true } });
  for (const idea of allIdeas) {
    const votesCount = await prisma.vote.count({ where: { ideaId: idea.id } });
    await prisma.idea.update({
      where: { id: idea.id },
      data: { votesCount },
    });
  }

  console.log('✅ Голоса добавлены и подсчитаны');
  console.log('🌱 Seed завершён успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при выполнении seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
