import { Gift } from '../../domain/types';

// Storing as Domain objects for the Mock Server simplicity, 
// but the Mock Server will return them as if they came from DB.
export const MOCK_DB_GIFTS: Gift[] = [
  {
    id: '1',
    title: 'Большой Адвент-календарь "Магия праздника"',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1576016773352-7e9b0475c404?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Красота',
    tags: ['новый год', 'сюрприз', 'красота', 'девушка', 'мама'],
    reason: 'Создает праздничное настроение каждый день декабря.',
    ageRange: [14, 50],
    minBudget: 2000,
    description: 'Роскошный набор из 24 окошек с косметическими миниатюрами, сладостями и приятными мелочами. Идеальный способ скрасить ожидание Нового года.',
    reviews: {
      rating: 4.9,
      count: 312,
      source: "Ozon",
      highlights: ["красивая упаковка", "качественное наполнение", "восторг"],
      items: [
        {
          id: 'r1', author: 'Анна', rating: 5, date: '15 дек 2023',
          text: 'Подарила сестре, она пищит от восторга каждое утро, открывая новое окошко!',
          tag: 'подарок сестре',
          photos: ['https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=60']
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Умная гирлянда Twinkly (400 ламп)',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Amazon',
    category: 'Дом',
    tags: ['технологии', 'дом', 'декор', 'папа', 'семья'],
    reason: 'Превращает елку в световое шоу, управляется со смартфона.',
    ageRange: [10, 99],
    minBudget: 10000,
    description: 'Легендарная смарт-гирлянда. Через приложение можно рисовать узоры светом прямо на елке, синхронизировать с музыкой и выбирать из тысяч эффектов.',
    reviews: {
      rating: 5.0,
      count: 85,
      source: "Amazon",
      highlights: ["магия", "приложение", "дорого но стоит того"],
      items: [
        {
          id: 'r2', author: 'GeekDad', rating: 5, date: '20 дек 2023',
          text: 'Лучшая игрушка для взрослых. Дети залипают на режимы часами.',
          photos: ['https://images.unsplash.com/photo-1576612662036-9ec6d62a98e9?auto=format&fit=crop&w=400&q=60']
        }
      ]
    }
  },
  {
    id: '3',
    title: 'Набор для приготовления Глинтвейна',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    marketplace: 'WB',
    category: 'Еда',
    tags: ['уют', 'еда', 'зима', 'коллега', 'друг'],
    reason: 'Ароматный и согревающий подарок для зимних вечеров.',
    ageRange: [18, 99],
    minBudget: 0,
    description: 'Подарочный бокс: два стильных бокала, смесь премиальных специй (палочки корицы, бадьян, кардамон), сушеные апельсины и рецепт идеального напитка.',
    reviews: {
      rating: 4.7,
      count: 142,
      source: "WB",
      highlights: ["аромат", "упаковка", "вкусно"],
      items: [
        {
          id: 'r3', author: 'Марина', rating: 5, date: '30 дек 2023',
          text: 'Очень атмосферный подарок. Специи свежие, аромат на всю кухню.',
          tag: 'подарок коллеге'
        }
      ]
    }
  },
  {
    id: '4',
    title: 'Фотоаппарат моментальной печати Instax',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Технологии',
    tags: ['технологии', 'фото', 'веселье', 'подросток', 'девушка'],
    reason: 'Чтобы запечатлеть лучшие моменты новогодней ночи.',
    ageRange: [12, 35],
    minBudget: 5000,
    description: 'Стильный фотоаппарат в зимнем голубом цвете. Делает атмосферные карточки, которые можно сразу подарить друзьям или повесить на мудборд.',
    reviews: {
      rating: 4.8,
      count: 1200,
      source: "Ozon",
      highlights: ["стильный", "качество фото", "подарок"],
      items: [
        {
          id: 'r4', author: 'Катя', rating: 5, date: '01 янв 2024',
          text: 'Лучший подарок на НГ! Нафоткались всей семьей у елки.',
          photos: ['https://images.unsplash.com/photo-1620216786273-b67280775d72?auto=format&fit=crop&w=400&q=60']
        }
      ]
    }
  },
  {
    id: '5',
    title: 'Уютный плед крупной вязки',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1581559861298-608eb4e954b4?auto=format&fit=crop&w=800&q=80',
    marketplace: 'WB',
    category: 'Дом',
    tags: ['уют', 'дом', 'зима', 'мама', 'бабушка/дед'],
    reason: 'Максимальный уровень уюта для холодных вечеров.',
    ageRange: [16, 90],
    minBudget: 2000,
    description: 'Мягкий, объемный плед из шерсти мериноса. Идеально подходит для чтения книги с какао или просмотра новогодних фильмов.',
    reviews: {
      rating: 4.6,
      count: 89,
      source: "WB",
      highlights: ["мягкий", "теплый", "красивый цвет"],
      items: []
    }
  },
  {
    id: '6',
    title: 'Набор LEGO "Один дома"',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Amazon',
    category: 'Хобби',
    tags: ['игрушки', 'ностальгия', 'семья', 'папа', 'муж'],
    reason: 'Легендарный дом из любимого новогоднего фильма.',
    ageRange: [10, 50],
    minBudget: 10000,
    description: 'Огромный детализированный конструктор дома Маккалистеров. Ловушки, фургон грабителей и фигурки героев в комплекте. Занятие на все каникулы!',
    reviews: {
      rating: 5.0,
      count: 450,
      source: "Amazon",
      highlights: ["детализация", "ностальгия", "супер подарок"],
      items: [
        {
          id: 'r6', author: 'Сергей', rating: 5, date: '25 дек 2023',
          text: 'Муж (35 лет) радовался как ребенок. Собирали 3 дня всей семьей.',
          tag: 'подарок мужу'
        }
      ]
    }
  },
  {
    id: '7',
    title: 'Пряничный домик (DIY набор)',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1606101272655-903df0c345b5?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Еда',
    tags: ['еда', 'творчество', 'дети', 'семья'],
    reason: 'Веселое и вкусное занятие для всей семьи.',
    ageRange: [3, 99],
    minBudget: 0,
    description: 'В наборе готовые имбирные коржи, сахарная глазурь в тюбиках и разноцветные посыпки. Просто склейте и украсьте!',
    reviews: {
      rating: 4.5,
      count: 200,
      source: "Ozon",
      highlights: ["детям нравится", "вкусно", "свежий"],
      items: []
    }
  },
  {
    id: '8',
    title: 'Проектор звездного неба "Астронавт"',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    marketplace: 'WB',
    category: 'Дом',
    tags: ['уют', 'технологии', 'дети', 'романтика'],
    reason: 'Создает волшебную атмосферу космоса прямо в спальне.',
    ageRange: [5, 40],
    minBudget: 2000,
    description: 'Милый астронавт проецирует туманности и звезды на потолок. Регулируемая яркость и цвета. Отличный ночник для зимних ночей.',
    reviews: {
      rating: 4.8,
      count: 1500,
      source: "WB",
      highlights: ["очень красиво", "ребенок в восторге", "яркий"],
      items: [
        {
          id: 'r8', author: 'Ольга', rating: 5, date: '10 дек 2023',
          text: 'Это просто космос! Включаем каждый вечер перед сном.',
          photos: ['https://images.unsplash.com/photo-1506318137071-a8bcbf6d94ea?auto=format&fit=crop&w=400&q=60']
        }
      ]
    }
  },
  {
    id: '9',
    title: 'Ежедневник "Планы на 2025"',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Канцелярия',
    tags: ['работа', 'планирование', 'коллега', 'подруга'],
    reason: 'Для тех, кто любит начинать новую жизнь с 1 января.',
    ageRange: [16, 50],
    minBudget: 0,
    description: 'Стильный планер в кожаной обложке. Внутри трекеры привычек, цели на год, мотивирующие цитаты и плотная бумага.',
  },
  {
    id: '10',
    title: 'Биокамин настольный',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1542206642-127e26829705?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Amazon',
    category: 'Дом',
    tags: ['уют', 'интерьер', 'романтика', 'семья'],
    reason: 'Живой огонь без дыма и гари в городской квартире.',
    ageRange: [25, 60],
    minBudget: 5000,
    description: 'Компактный камин на биотопливе. Создает невероятный уют, тепло и завораживающую игру огня. Безопасен для помещений.',
    reviews: {
      rating: 4.7,
      count: 56,
      source: "Amazon",
      highlights: ["уют", "тепло", "стильно"],
      items: []
    }
  },
  {
    id: '11',
    title: 'Яндекс.Станция с часами',
    price: 7900,
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Технологии',
    tags: ['технологии', 'музыка', 'дом', 'родители'],
    reason: 'Включит новогодние плейлисты и подскажет рецепт оливье.',
    ageRange: [6, 70],
    minBudget: 5000,
    description: 'Умная колонка с Алисой. Покажет время, включит сказку детям, поставит таймер для духовки и создаст праздничную атмосферу.',
  },
  {
    id: '12',
    title: 'Подарочный бокс "Spa Day"',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    marketplace: 'WB',
    category: 'Красота',
    tags: ['красота', 'релакс', 'девушка', 'мама', 'уют'],
    reason: 'Расслабление после предновогодней суеты.',
    ageRange: [18, 60],
    minBudget: 2000,
    description: 'Бомбочки для ванны с хвоей, соль с лавандой, скраб и мягкая повязка на голову. Упаковано в красивую коробку с лентой.',
    reviews: {
      rating: 4.8,
      count: 230,
      source: "WB",
      highlights: ["запах", "упаковка", "релакс"],
      items: [
        {
          id: 'r12', author: 'Елена', rating: 5, date: '28 дек 2023',
          text: 'Маме очень понравилось! Запах на всю ванную.',
          tag: 'подарок маме'
        }
      ]
    }
  },
  {
    id: '13',
    title: 'Термокружка с дисплеем',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1517093157656-b9ec9c18981c?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Other',
    category: 'Кухня',
    tags: ['зима', 'кофе', 'авто', 'муж', 'папа'],
    reason: 'Горячий кофе всегда с собой, на прогулке или в машине.',
    ageRange: [16, 60],
    minBudget: 0,
    description: 'Стильная кружка показывает температуру напитка на крышке. Держит тепло до 8 часов. Не протекает в рюкзаке.',
  },
  {
    id: '14',
    title: 'Шелковая пижама',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1562213498-854720970725?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Amazon',
    category: 'Одежда',
    tags: ['одежда', 'уют', 'роскошь', 'девушка', 'жена'],
    reason: 'Встретить утро 1 января красиво и с комфортом.',
    ageRange: [20, 50],
    minBudget: 5000,
    description: 'Комплект из натурального или искусственного шелка благородного цвета. Невероятно приятная к телу ткань для идеального сна.',
    reviews: {
      rating: 4.9,
      count: 40,
      source: "Amazon",
      highlights: ["качество", "приятная ткань", "размер в размер"],
      items: []
    }
  },
  {
    id: '15',
    title: 'Набор сомелье (Электроштопор)',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Кухня',
    tags: ['технологии', 'кухня', 'праздник', 'папа', 'коллега'],
    reason: 'Открывает бутылку игристого за 6 секунд без усилий.',
    ageRange: [21, 70],
    minBudget: 2000,
    description: 'В наборе электрический штопор, аэратор для насыщения вина кислородом и вакуумная пробка для хранения. Выглядит очень стильно.',
  },
  {
    id: '16',
    title: 'Массажер для шеи и плеч',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    marketplace: 'WB',
    category: 'Здоровье',
    tags: ['здоровье', 'релакс', 'родители', 'муж'],
    reason: 'Лучший способ снять напряжение после рабочего года.',
    ageRange: [25, 80],
    minBudget: 2000,
    description: 'Роликовый массажер с подогревом. Имитирует руки массажиста, глубоко разминает мышцы. Идеально для тех, кто много сидит за компьютером.',
    reviews: {
      rating: 4.8,
      count: 560,
      source: "WB",
      highlights: ["сильно разминает", "греет", "спасение"],
      items: [
        {
          id: 'r16', author: 'Иван', rating: 5, date: '12 янв 2024',
          text: 'Подарил родителям, теперь пользуемся всей семьей по очереди.',
          tag: 'для семьи'
        }
      ]
    }
  },
  {
    id: '17',
    title: 'Зимний бокс сладостей',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Other',
    category: 'Еда',
    tags: ['еда', 'сладкое', 'дети', 'коллега'],
    reason: 'Вкусный подарок, с которым невозможно прогадать.',
    ageRange: [5, 99],
    minBudget: 0,
    description: 'Ассорти имбирного печенья, бельгийского шоколада, орехов в глазури и маршмеллоу. Красивая новогодняя открытка в комплекте.',
  },
  {
    id: '18',
    title: 'Увлажнитель воздуха "Пламя"',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1616627561839-074385245c47?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Ozon',
    category: 'Дом',
    tags: ['уют', 'технологии', 'дом', 'зима'],
    reason: 'Полезно для здоровья в отопительный сезон и очень красиво.',
    ageRange: [20, 60],
    minBudget: 2000,
    description: 'Увлажнитель с подсветкой пара, создающей эффект реалистичного огня. Можно добавлять аромамасла. Тихий и безопасный.',
  },
  {
    id: '19',
    title: 'Беспроводные наушники (Full Size)',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&w=800&q=80',
    marketplace: 'Amazon',
    category: 'Электроника',
    tags: ['технологии', 'музыка', 'подросток', 'зима'],
    reason: 'Греют уши вместо шапки и играют любимые треки.',
    ageRange: [14, 40],
    minBudget: 5000,
    description: 'Полноразмерные наушники с мягкими амбушюрами и качественным звуком. Отлично подходят для зимних прогулок.',
  },
  {
    id: '20',
    title: 'Набор свечей с деревянным фитилем',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1602524206684-fdf6393c7d89?auto=format&fit=crop&w=800&q=80',
    marketplace: 'WB',
    category: 'Дом',
    tags: ['уют', 'аромат', 'релакс', 'девушка'],
    reason: 'При горении потрескивают как дрова в камине.',
    ageRange: [18, 60],
    minBudget: 0,
    description: 'Натуральный соевый воск и ароматы "Хвоя и мандарин", "Пряная корица". Деревянный фитиль создает уютный звук потрескивания.',
     reviews: {
      rating: 4.9,
      count: 90,
      source: "WB",
      highlights: ["трещит", "запах", "уютно"],
      items: []
    }
  }
];