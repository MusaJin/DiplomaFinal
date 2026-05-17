import { PrismaClient, Role, CategoryType, ResourceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Начало заполнения базы данных...');

  // Очищаем таблицы в правильном порядке
  await prisma.deviceToken.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.news.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Хешируем пароли
  const passwordHash = await bcrypt.hash('password123', 10);

  // Создаём пользователей
  const admin = await prisma.user.create({
    data: {
      fullName: 'Козлов Дмитрий Александрович',
      email: 'admin@university.ru',
      passwordHash,
      role: Role.ADMIN,
      faculty: 'Администрация',
    },
  });

  const teacher = await prisma.user.create({
    data: {
      fullName: 'Морозова Елена Викторовна',
      email: 'teacher@university.ru',
      passwordHash,
      role: Role.TEACHER,
      faculty: 'Факультет информационных технологий',
    },
  });

  const student = await prisma.user.create({
    data: {
      fullName: 'Новиков Артём Сергеевич',
      email: 'student@university.ru',
      passwordHash,
      role: Role.STUDENT,
      faculty: 'Факультет информационных технологий',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      fullName: 'Белова Анастасия Игоревна',
      email: 'student2@university.ru',
      passwordHash,
      role: Role.STUDENT,
      faculty: 'Экономический факультет',
    },
  });

  console.log('Пользователи созданы:', { admin: admin.email, teacher: teacher.email, student: student.email });

  // Создаём категории
  const catGeneral = await prisma.category.create({
    data: { name: 'Общие объявления', type: CategoryType.NEWS },
  });

  const catEvents = await prisma.category.create({
    data: { name: 'Мероприятия', type: CategoryType.NEWS },
  });

  const catScience = await prisma.category.create({
    data: { name: 'Наука и исследования', type: CategoryType.NEWS },
  });

  const catGrants = await prisma.category.create({
    data: { name: 'Гранты и стипендии', type: CategoryType.NEWS },
  });

  const catLibrary = await prisma.category.create({
    data: { name: 'Библиотека', type: CategoryType.RESOURCE },
  });

  const catMaterials = await prisma.category.create({
    data: { name: 'Методические материалы', type: CategoryType.RESOURCE },
  });

  const catPlatforms = await prisma.category.create({
    data: { name: 'Учебные платформы', type: CategoryType.RESOURCE },
  });

  const catSchedule = await prisma.category.create({
    data: { name: 'Расписание и консультации', type: CategoryType.COMMON },
  });

  console.log('Категории созданы');

  // Создаём новости
  const now = new Date();

  await prisma.news.createMany({
    data: [
      {
        title: 'Международная конференция «Цифровые технологии в образовании»',
        shortDescription: 'Наш университет проводит ежегодную международную конференцию по цифровым технологиям.',
        content: `С 15 по 17 апреля 2026 года в стенах нашего университета состоится ежегодная Международная конференция «Цифровые технологии в образовании».

К участию приглашаются студенты, магистранты, докторанты и преподаватели. Конференция пройдет в гибридном формате: очно и онлайн.

Тематические направления:
- Искусственный интеллект в образовании
- Разработка мобильных приложений
- Кибербезопасность и защита данных
- Цифровая трансформация учебных процессов

Регистрация открыта до 10 апреля. Для участия необходимо подать заявку через деканат факультета.`,
        imageUrl: 'http://10.0.2.2:3001/images/news1.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catScience.id,
      },
      {
        title: 'Изменения в расписании на апрель 2026',
        shortDescription: 'Обновленное расписание занятий в связи с государственными праздниками.',
        content: `Уважаемые студенты и преподаватели!

В связи с государственными праздниками в апреле 2026 года вносятся следующие изменения в расписание учебных занятий:

7 апреля (понедельник) — перенос занятий по расписанию субботы.
9 апреля (среда) — дополнительный выходной день.

Актуальное расписание доступно на сайте университета и в личном кабинете студента. При возникновении вопросов обращайтесь в деканат своего факультета.

Деканат`,
        imageUrl: null,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catGeneral.id,
      },
      {
        title: 'День открытых дверей — 20 апреля',
        shortDescription: 'Приглашаем абитуриентов и их родителей на День открытых дверей.',
        content: `20 апреля 2026 года в 10:00 состоится ежегодный День открытых дверей университета.

В программе:
- Презентация факультетов и специальностей
- Встречи с деканами и ведущими преподавателями
- Экскурсия по учебным корпусам и лабораториям
- Консультации по поступлению и грантам

Вход свободный. Будем рады видеть будущих студентов нашего университета!`,
        imageUrl: 'http://10.0.2.2:3001/images/news2.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catEvents.id,
      },
      {
        title: 'Объявлен конкурс на государственные образовательные гранты',
        shortDescription: 'Министерство образования объявило о начале приема заявок на гранты для магистратуры.',
        content: `Министерство образования и науки Российской Федерации объявляет о начале приема заявок на государственные образовательные гранты для поступления в магистратуру в 2026-2027 учебном году.

Условия участия:
- Диплом бакалавра со средним баллом не ниже 4.0
- Наличие публикаций или участие в научных проектах
- Рекомендательное письмо от научного руководителя

Документы принимаются до 30 апреля 2026 года в отделе по работе со студентами (корпус A, каб. 105).

Более подробная информация доступна на официальном сайте Минобрнауки РФ.`,
        imageUrl: 'http://10.0.2.2:3001/images/news3.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catGrants.id,
      },
      {
        title: 'Студенческий хакатон «UniHack 2026»',
        shortDescription: 'Приглашаем команды студентов принять участие в ежегодном хакатоне.',
        content: `Факультет информационных технологий организует студенческий хакатон «UniHack 2026»!

Дата проведения: 25-26 апреля 2026 года
Место: Корпус В, актовый зал и компьютерные классы

Тема: «Технологии для умного города»

Участники будут решать реальные задачи городской инфраструктуры с использованием современных технологий: IoT, мобильных приложений, Big Data и машинного обучения.

Призовой фонд: 500 000 рублей
Количество участников в команде: 3-5 человек

Регистрация команд открыта до 20 апреля. Форма регистрации доступна в деканате ФИТ.`,
        imageUrl: 'http://10.0.2.2:3001/images/news4.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        authorId: teacher.id,
        categoryId: catEvents.id,
      },
      {
        title: 'Новая лаборатория искусственного интеллекта открыта на ФИТ',
        shortDescription: 'На факультете информационных технологий открылась современная лаборатория ИИ.',
        content: `На факультете информационных технологий открылась лаборатория искусственного интеллекта, оснащенная высокопроизводительными серверами для работы с нейронными сетями.

Лаборатория будет использоваться для:
- Учебных занятий по курсам ML/DL
- Проведения научных исследований
- Реализации студенческих проектов
- Партнерских программ с IT-компаниями

Лаборатория оснащена 20 рабочими станциями с GPU NVIDIA RTX 4090 и сервером с 8xA100 для обучения крупных моделей.

Запись на использование лаборатории доступна через кафедру компьютерных наук.`,
        imageUrl: 'http://10.0.2.2:3001/images/news5.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catScience.id,
      },
      {
        title: 'Академическая мобильность: программа обмена с университетами Европы',
        shortDescription: 'Открыт прием заявок на программу академической мобильности 2026-2027.',
        content: `Международный отдел университета объявляет о начале приема заявок на программу академической мобильности с партнерскими университетами Европы на 2026-2027 учебный год.

Страны-партнеры: Германия, Чехия, Польша, Нидерланды, Финляндия

Срок обучения: один семестр или учебный год
Условия: знание английского языка (IELTS 5.5+), успеваемость GPA 3.0+

Программа предоставляет:
- Полное или частичное покрытие расходов на обучение
- Помощь в получении визы
- Содействие в поиске жилья

Заявки принимаются до 1 мая 2026 года в международном отделе (корпус A, каб. 210).`,
        imageUrl: 'http://10.0.2.2:3001/images/news6.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catGrants.id,
      },
      {
        title: 'Итоги весенней сессии: отличники факультетов',
        shortDescription: 'Поздравляем студентов, завершивших весеннюю сессию с отличием!',
        content: `Уважаемые студенты и преподаватели!

Подведены итоги весенней сессии 2025-2026 учебного года. Поздравляем студентов, показавших отличные результаты!

Факультет информационных технологий:
- 47 студентов получили все оценки «Отлично»
- 12 студентов вошли в рейтинг лучших студентов университета

Торжественная церемония награждения состоится 28 апреля 2026 года в 15:00 в главном актовом зале.

Академический отдел`,
        imageUrl: null,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catGeneral.id,
      },
      {
        title: 'Научная публикация в журнале Scopus — достижение наших преподавателей',
        shortDescription: 'Преподаватели кафедры CS опубликовали статью в международном журнале.',
        content: `Коллектив кафедры компьютерных наук опубликовал научную статью в международном журнале, индексированном в базе данных Scopus.

Тема исследования: «Применение методов глубокого обучения для анализа медицинских изображений»

Авторы: доцент Морозова Е.В., профессор Соколов К.Т., аспирант Петров С.Б.

Статья описывает разработанный алгоритм, который показал точность диагностики на 15% выше существующих аналогов. Результаты исследования будут применяться в сотрудничестве с городскими клиниками.

Поздравляем коллег с заслуженным достижением!`,
        imageUrl: 'http://10.0.2.2:3001/images/news7.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        authorId: teacher.id,
        categoryId: catScience.id,
      },
      {
        title: 'Карьерная ярмарка с участием ведущих IT-компаний',
        shortDescription: 'Приглашаем студентов 3-4 курсов на карьерную ярмарку 12 апреля.',
        content: `12 апреля 2026 года в 10:00 в главном корпусе университета состоится Карьерная ярмарка с участием ведущих IT-компаний России.

Участники ярмарки:
- Яндекс
- VK Tech
- Сбер Технологии
- Тинькофф
- Positive Technologies
- И другие компании...

На ярмарке вы сможете:
- Познакомиться с представителями компаний
- Передать резюме напрямую рекрутерам
- Узнать об открытых вакансиях и стажировках
- Пройти предварительное собеседование

Для участия необходимо иметь при себе распечатанное резюме. Вход свободный для студентов 3-4 курсов.`,
        imageUrl: 'http://10.0.2.2:3001/images/news8.jpg',
        isPublished: true,
        publishedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        authorId: admin.id,
        categoryId: catEvents.id,
      },
    ],
  });

  console.log('Новости созданы');

  // Создаём образовательные ресурсы
  await prisma.resource.createMany({
    data: [
      {
        title: 'Электронная библиотека университета',
        description: 'Доступ к полному каталогу учебной и научной литературы. Более 50 000 книг и статей в электронном формате.',
        type: ResourceType.LINK,
        url: 'https://library.university.ru',
        categoryId: catLibrary.id,
        isPublished: true,
      },
      {
        title: 'eLIBRARY.RU — Научная электронная библиотека',
        description: 'Крупнейший портал научных публикаций на русском языке. Доступ к статьям из журналов ВАК и РИНЦ.',
        type: ResourceType.LINK,
        url: 'https://elibrary.ru',
        categoryId: catLibrary.id,
        isPublished: true,
      },
      {
        title: 'Springer — Международные научные журналы',
        description: 'Доступ к тысячам международных научных журналов и книг издательства Springer. Требуется VPN университета.',
        type: ResourceType.LINK,
        url: 'https://link.springer.com',
        categoryId: catLibrary.id,
        isPublished: true,
      },
      {
        title: 'Методические рекомендации по написанию дипломных работ',
        description: 'Официальные требования и рекомендации по оформлению и написанию дипломных и курсовых работ 2025-2026.',
        type: ResourceType.FILE,
        url: null,
        fileUrl: 'https://university.ru/files/diploma-guide-2026.pdf',
        categoryId: catMaterials.id,
        isPublished: true,
      },
      {
        title: 'Стандарт оформления научных работ ГОСТ',
        description: 'Требования ГОСТ 7.0.11-2011 к оформлению диссертаций и научно-квалификационных работ.',
        type: ResourceType.FILE,
        url: null,
        fileUrl: 'https://university.ru/files/gost-formatting.pdf',
        categoryId: catMaterials.id,
        isPublished: true,
      },
      {
        title: 'Шаблон презентации для защиты диплома',
        description: 'Официальный шаблон слайдов в фирменном стиле университета для дипломной защиты.',
        type: ResourceType.FILE,
        url: null,
        fileUrl: 'https://university.ru/files/diploma-presentation-template.pptx',
        categoryId: catMaterials.id,
        isPublished: true,
      },
      {
        title: 'Coursera — Онлайн-курсы ведущих университетов',
        description: 'Платформа для онлайн-обучения с курсами от MIT, Stanford, Google и других. Студентам доступны бесплатные аудиты.',
        type: ResourceType.LINK,
        url: 'https://coursera.org',
        categoryId: catPlatforms.id,
        isPublished: true,
      },
      {
        title: 'Stepik — Образовательная платформа',
        description: 'Российская платформа онлайн-обучения с курсами по программированию, математике и другим дисциплинам на русском языке.',
        type: ResourceType.LINK,
        url: 'https://stepik.org',
        categoryId: catPlatforms.id,
        isPublished: true,
      },
      {
        title: 'Moodle — Система дистанционного обучения',
        description: 'Внутренняя платформа дистанционного обучения университета. Здесь размещены курсы, задания и тесты.',
        type: ResourceType.LINK,
        url: 'https://moodle.university.ru',
        categoryId: catPlatforms.id,
        isPublished: true,
      },
      {
        title: 'Khan Academy — Бесплатное образование',
        description: 'Бесплатная образовательная платформа с курсами по математике, физике, информатике и другим предметам.',
        type: ResourceType.LINK,
        url: 'https://khanacademy.org',
        categoryId: catPlatforms.id,
        isPublished: true,
      },
      {
        title: 'Расписание консультаций преподавателей — апрель 2026',
        description: 'Актуальное расписание консультационных часов преподавателей всех факультетов на апрель 2026 года.',
        type: ResourceType.FILE,
        url: null,
        fileUrl: 'https://university.ru/files/consultations-april-2026.pdf',
        categoryId: catSchedule.id,
        isPublished: true,
      },
      {
        title: 'Учебный план — Информационные системы (4 курс)',
        description: 'Рабочий учебный план для студентов 4 курса направления «Информационные системы» на 2025-2026 учебный год.',
        type: ResourceType.FILE,
        url: null,
        fileUrl: 'https://university.ru/files/curriculum-is-4year.pdf',
        categoryId: catMaterials.id,
        isPublished: true,
      },
      {
        title: 'GitHub Student Developer Pack',
        description: 'Бесплатный доступ к профессиональным инструментам разработки для студентов: GitHub Pro, облачные серверы, домены и многое другое.',
        type: ResourceType.LINK,
        url: 'https://education.github.com/pack',
        categoryId: catPlatforms.id,
        isPublished: true,
      },
    ],
  });

  console.log('Образовательные ресурсы созданы');
  console.log('\n=== ТЕСТОВЫЕ АККАУНТЫ ===');
  console.log('Администратор: admin@university.ru / password123');
  console.log('Преподаватель: teacher@university.ru / password123');
  console.log('Студент:       student@university.ru / password123');
  console.log('Студент 2:     student2@university.ru / password123');
  console.log('\nБаза данных успешно заполнена!');
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении БД:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
