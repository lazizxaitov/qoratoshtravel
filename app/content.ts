export const languages = {
  ru: { code: "RU", label: "Русский", flag: "\u{1F1F7}\u{1F1FA}" },
  uz: { code: "UZ", label: "O'zbekcha", flag: "\u{1F1FA}\u{1F1FF}" },
  en: { code: "EN", label: "English", flag: "\u{1F1EC}\u{1F1E7}" },
} as const;
export type Lang = keyof typeof languages;

export const content = {
  ru: {
    nav: {
      destinations: "Направления",
      hot: "Горячие туры",
      about: "О нас",
      reviews: "Отзывы",
      contacts: "Контакты",
    },
    header: {
      contact: "Связаться",
      marquee:
        "Горящие туры недели · Шарм-эль-Шейх от 900$ · Дубай с прямым вылетом · Скидки до 20% на семейные туры ·",
    },
    hero: {
      badge: "2025 сезон",
      title: "Откройте для себя мир с Qoratosh Travel",
      description:
        "Авторские маршруты, городские туры и горячие предложения с полным сопровождением. Мы создаем путешествия, о которых приятно вспоминать.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      stats: [
        "300+ направлений",
        "24/7 поддержка",
        "Гарантия лучшей цены",
      ],
      slides: [
        {
          badge: "2025 сезон",
          title: "Откройте для себя мир с Qoratosh Travel",
          description:
            "Авторские маршруты, городские туры и горячие предложения с полным сопровождением. Мы создаем путешествия, о которых приятно вспоминать.",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
          stats: [
            "300+ направлений",
            "24/7 поддержка",
            "Гарантия лучшей цены",
          ],
        },
        {
          badge: "Новые маршруты",
          title: "Городские туры и пляжные направления",
          description:
            "Собираем лучшие предложения недели, проверяем отели и рейсы, чтобы отдых был без лишних хлопот.",
          image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
          stats: ["Вылеты из Ташкента", "Гарантия цены", "Личный менеджер"],
        },
        {
          badge: "Горячие предложения",
          title: "Выбирайте туры с максимальной выгодой",
          description:
            "Планируйте отпуск заранее или берите горящие туры — у нас всегда есть актуальные предложения.",
          image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
          stats: ["Скидки до 20%", "Лучшие даты", "Проверенные отели"],
        },
      ],
    },
    tourPage: {
      label: "Тур",
      back: "Назад",
      infoTitle: "Информация о туре",
      aboutTitle: "Описание тура",
      aboutText: "Детали тура будут загружаться из админ-панели.",
      bookButton: "Забронировать",
    },
    search: {
      destinationLabel: "Направление",
      destinationPlaceholder: "Шарм-эль-Шейх",
      peopleLabel: "Персон",
      peopleValue: "2 взрослых",
      peopleUnit: "чел.",
      adultsLabel: "Количество",
      startLabel: "Заезд",
      endLabel: "Выезд",
      dateLabel: "Дата",
      dateValue: "12 - 13 Октябрь",
      typeLabel: "Тип",
      typeValue: "Все",
      typeOptions: [
        { value: "all", label: "Все" },
        { value: "hot", label: "Горящие" },
      ],
      button: "Бронировать",
      priceFrom: "от",
      nightsLabel: "ночей",
      resultsTitle: "Найденные туры",
      empty: "Туры по выбранным параметрам не найдены.",
      loading: "Ищем лучшие варианты...",
      error: "Не удалось выполнить поиск. Попробуйте позже.",
      resetLabel: "Сбросить даты",
    },
    about: {
      label: "О нас",
      title: "Туристическая компания Qoratosh Travel",
      text:
        "Мы создаем продуманные маршруты и берем на себя все детали путешествия: билеты, отели, трансферы, экскурсии и поддержку на месте. Наша команда работает с проверенными партнерами и предлагает честные цены без сюрпризов.",
      perks: [
        "Отборные отели и локации",
        "Персональный менеджер",
        "Поддержка 24/7",
        "Туры по всему миру",
      ],
      whyLabel: "Почему мы",
      whyPoints: [
        "Экспертные маршруты по городам и направлениям.",
        "Гибкие пакеты и скидки на раннее бронирование.",
        "Сильная партнерская сеть в 30+ странах.",
      ],
      foundedTitle: "Основаны в 2015",
      foundedText:
        "Более 12 000 довольных клиентов и растущая база постоянных путешественников.",
    },
    destinations: {
      label: "Выберите тур по желанию",
      title: "Туры и направления",
      button: "Все направления",
    },
    gallery: {
      images: [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    hot: {
      label: "Горячие туры",
      title: "Успейте забронировать по лучшим ценам",
      description:
        "Обновляем подборку каждую неделю. Лучшие даты, прямые рейсы и проверенные отели.",
      promoBadge: "Акция",
      promoTitle: "-20% на семейные туры",
      promoButton: "Получить предложение",
      detailsButton: "Подробнее",
      slides: [
        {
          badge: "Акция недели",
          title: "-20% на семейные туры",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
        },
        {
          badge: "Лимит",
          title: "Шарм-эль-Шейх от 900$",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        },
        {
          badge: "Горящее",
          title: "Дубай с прямым вылетом",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    promos: {
      monthLabel: "Акции месяца",
      monthTitle: "Городские туры выходного дня",
      monthText:
        "Идеально для короткого перерыва. Самые красивые города Европы с продуманными маршрутами и гидом.",
      monthHref: "/hot",
      monthButton: "Смотреть туры",
      specialLabel: "Спецпредложение",
      specialTitle: "Медовый месяц у моря",
      specialText:
        "Пакеты для двоих с романтическими ужинами, спа и персональным трансфером.",
      specialHref: "/hot",
      specialButton: "Забронировать",
    },
    reviews: {
      label: "Отзывы клиентов",
      title: "Впечатления наших путешественников",
    },
    cta: {
      kicker: "Путешествуй по миру",
      title: "#QORATOSH TRAVEL",
      button: "Получить консультацию",
      formTitle: "Заполните форму",
      formSubtitle: "Наши менеджеры свяжутся с вами.",
      formName: "Имя",
      formLastName: "Фамилия",
      formPhone: "Телефон",
      formComment: "Комментарий",
      formSubmit: "Отправить",
    },
    footer: {
      title: "Qoratosh Travel",
      text:
        "Городские туры, пляжные направления, горящие предложения и индивидуальные маршруты.",
      contactsTitle: "Контакты",
      address: "Ташкент, ул. Амир Темур, 12",
      phone: "+998 90 000 00 00",
      email: "info@qoratosh.uz",
      socialLabel: "Мы в соцсетях",
      socialLinks: [
        { href: "https://t.me/qoratosh", label: "Telegram" },
        { href: "https://instagram.com/qoratosh", label: "Instagram" },
        { href: "https://wa.me/998900000000", label: "WhatsApp" },
      ],
    },
    tours: [
      {
        id: "sharm",
        title: "Шарм-эль-Шейх",
        city: "Египет",
        price: "от 900$",
        days: "7 ночей",
        people: "1-4",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "istanbul",
        title: "Стамбул",
        city: "Турция",
        price: "от 520$",
        days: "4 ночи",
        people: "1-3",
        image:
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "dubai",
        title: "Дубай",
        city: "ОАЭ",
        price: "от 1200$",
        days: "6 ночей",
        people: "2-6",
        image:
          "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    hotTours: [
      {
        id: "antalya",
        title: "Анталья",
        city: "Турция",
        price: "от 430$",
        badge: "Горящий тур",
        people: "2-4",
      },
      {
        id: "bali",
        title: "Бали",
        city: "Индонезия",
        price: "от 1490$",
        badge: "Лимитировано",
        people: "2-4",
      },
      {
        id: "prague",
        title: "Прага",
        city: "Чехия",
        price: "от 610$",
        badge: "Осенний хит",
        people: "1-3",
      },
    ],
    reviewsList: [
      {
        id: "madina",
        name: "Мадина",
        city: "Ташкент",
        text: "Организация на высоте, все время на связи. Вернулись с эмоциями и лучшими фото!",
      },
      {
        id: "azamat",
        name: "Азамат",
        city: "Самарканд",
        text: "Подобрали тур под наш бюджет. Отель чистый, трансферы точные.",
      },
      {
        id: "saida",
        name: "Саида",
        city: "Наманган",
        text: "Детям понравилось! Удобные перелеты и сопровождение на месте.",
      },
    ],
  },
  uz: {
    nav: {
      destinations: "Yo'nalishlar",
      hot: "Issiq turlar",
      about: "Biz haqimizda",
      reviews: "Sharhlar",
      contacts: "Kontaktlar",
    },
    header: {
      contact: "Bog'lanish",
      marquee:
        "Haftalik issiq turlar · Sharm el-Sheyx 900$ dan · Dubayga to'g'ridan-to'g'ri reys · Oilaviy turlarga 20% gacha chegirma ·",
    },
    hero: {
      badge: "2025 mavsum",
      title: "Qoratosh Travel bilan dunyoni kashf eting",
      description:
        "Mualliflik marshrutlari, shahar turlari va issiq takliflar to'liq hamrohlik bilan. Biz esda qoladigan sayohatlarni yaratamiz.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      stats: [
        "300+ yo'nalish",
        "24/7 qo'llab-quvvatlash",
        "Eng yaxshi narx kafolati",
      ],
      slides: [
        {
          badge: "2025 mavsum",
          title: "Qoratosh Travel bilan dunyoni kashf eting",
          description:
            "Mualliflik marshrutlari, shahar turlari va issiq takliflar to'liq hamrohlik bilan. Biz esda qoladigan sayohatlarni yaratamiz.",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
          stats: [
            "300+ yo'nalish",
            "24/7 qo'llab-quvvatlash",
            "Eng yaxshi narx kafolati",
          ],
        },
        {
          badge: "Yangi yo'nalishlar",
          title: "Shahar turlari va plyaj yo'nalishlari",
          description:
            "Haftalik takliflar, sinovdan o'tgan mehmonxonalar va qulay reyslar — hammasi bizdan.",
          image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
          stats: ["Toshkentdan parvozlar", "Eng yaxshi narx", "Shaxsiy menejer"],
        },
        {
          badge: "Issiq takliflar",
          title: "Eng foydali narxlarda tur tanlang",
          description:
            "Oldindan rejalashtiring yoki issiq turlarni oling — doim dolzarb takliflar bor.",
          image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
          stats: ["20% gacha chegirma", "Yaxshi sanalar", "Ishonchli mehmonxonalar"],
        },
      ],
    },
    tourPage: {
      label: "Tur",
      back: "Orqaga",
      infoTitle: "Tur haqida",
      aboutTitle: "Tur tavsifi",
      aboutText: "Tur tafsilotlari admin paneldan yuklanadi.",
      bookButton: "Bron qilish",
    },
    search: {
      destinationLabel: "Yo'nalish",
      destinationPlaceholder: "Sharm el-Sheyx",
      peopleLabel: "Mehmonlar",
      peopleValue: "2 kattalar",
      peopleUnit: "kishi",
      adultsLabel: "Miqdor",
      startLabel: "Kirish",
      endLabel: "Chiqish",
      dateLabel: "Sana",
      dateValue: "12 - 13 Oktabr",
      typeLabel: "Tur",
      typeValue: "Barchasi",
      typeOptions: [
        { value: "all", label: "Barchasi" },
        { value: "hot", label: "Issiq" },
      ],
      button: "Bron qilish",
      priceFrom: "dan",
      nightsLabel: "kecha",
      resultsTitle: "Topilgan turlar",
      empty: "Tanlangan parametrlar bo'yicha tur topilmadi.",
      loading: "Eng yaxshi variantlar qidirilmoqda...",
      error: "Qidiruvda xatolik. Qayta urinib ko'ring.",
      resetLabel: "Sanalarni tozalash",
    },
    about: {
      label: "Biz haqimizda",
      title: "Qoratosh Travel sayyohlik kompaniyasi",
      text:
        "Biz puxta marshrutlar yaratamiz va sayohatning barcha tafsilotlarini o'z zimmamizga olamiz: chipta, mehmonxona, transfer, ekskursiya va joyida yordam.",
      perks: [
        "Saralangan mehmonxonalar",
        "Shaxsiy menejer",
        "24/7 yordam",
        "Butun dunyo bo'ylab turlar",
      ],
      whyLabel: "Nega biz",
      whyPoints: [
        "Shaharlar va yo'nalishlar bo'yicha ekspert marshrutlar.",
        "Moslashuvchan paketlar va erta bron chegirmalari.",
        "30+ mamlakatda kuchli hamkorlar tarmog'i.",
      ],
      foundedTitle: "2015 yildan",
      foundedText: "12 000+ mamnun mijoz va sodiq sayohatchilar bazasi.",
    },
    destinations: {
      label: "O'zingizga mos turni tanlang",
      title: "Turlar va yo'nalishlar",
      button: "Barcha yo'nalishlar",
    },
    gallery: {
      images: [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    hot: {
      label: "Issiq turlar",
      title: "Eng yaxshi narxlarda bron qiling",
      description:
        "Tanlov har hafta yangilanadi. Eng yaxshi sanalar va tekshirilgan mehmonxonalar.",
      promoBadge: "Aksiya",
      promoTitle: "Oilaviy turlarga -20%",
      promoButton: "Taklif olish",
      detailsButton: "Batafsil",
      slides: [
        {
          badge: "Hafta aksiyasi",
          title: "Oilaviy turlarga -20%",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
        },
        {
          badge: "Limit",
          title: "Sharm el-Sheyx 900$ dan",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        },
        {
          badge: "Issiq taklif",
          title: "Dubay to'g'ridan-to'g'ri reys",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    promos: {
      monthLabel: "Oyning aksiyalari",
      monthTitle: "Dam olish kunlari shahar turlari",
      monthText:
        "Qisqa tanaffus uchun ideal. Evropaning eng chiroyli shaharlari gid bilan.",
      monthHref: "/hot",
      monthButton: "Turlarni ko'rish",
      specialLabel: "Maxsus taklif",
      specialTitle: "Dengiz bo'yida asal oyi",
      specialText:
        "Romantik kechki ovqatlar, spa va shaxsiy transfer bilan paketlar.",
      specialHref: "/hot",
      specialButton: "Bron qilish",
    },
    reviews: {
      label: "Mijozlar sharhlari",
      title: "Sayohatchilar taassurotlari",
    },
    cta: {
      kicker: "Dunyoni kez",
      title: "#QORATOSH TRAVEL",
      button: "Maslahat olish",
      formTitle: "Formani to'ldiring",
      formSubtitle: "Menejerlarimiz siz bilan bog'lanadi.",
      formName: "Ism",
      formLastName: "Familiya",
      formPhone: "Telefon",
      formComment: "Izoh",
      formSubmit: "Yuborish",
    },
    footer: {
      title: "Qoratosh Travel",
      text:
        "Shahar turlari, plyaj yo'nalishlari, issiq takliflar va individual marshrutlar.",
      contactsTitle: "Kontaktlar",
      address: "Toshkent, Amir Temur ko'chasi, 12",
      phone: "+998 90 000 00 00",
      email: "info@qoratosh.uz",
      socialLabel: "Ijtimoiy tarmoqlar",
      socialLinks: [
        { href: "https://t.me/qoratosh", label: "Telegram" },
        { href: "https://instagram.com/qoratosh", label: "Instagram" },
        { href: "https://wa.me/998900000000", label: "WhatsApp" },
      ],
    },
    tours: [
      {
        id: "sharm",
        title: "Sharm el-Sheyx",
        city: "Misr",
        price: "900$ dan",
        days: "7 kecha",
        people: "1-4",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "istanbul",
        title: "Istanbul",
        city: "Turkiya",
        price: "520$ dan",
        days: "4 kecha",
        people: "1-3",
        image:
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "dubai",
        title: "Dubay",
        city: "BAA",
        price: "1200$ dan",
        days: "6 kecha",
        people: "2-6",
        image:
          "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    hotTours: [
      {
        id: "antalya",
        title: "Antalya",
        city: "Turkiya",
        price: "430$ dan",
        badge: "Issiq tur",
        people: "2-4",
      },
      {
        id: "bali",
        title: "Bali",
        city: "Indoneziya",
        price: "1490$ dan",
        badge: "Cheklangan",
        people: "2-4",
      },
      {
        id: "prague",
        title: "Praga",
        city: "Chexiya",
        price: "610$ dan",
        badge: "Kuzgi hit",
        people: "1-3",
      },
    ],
    reviewsList: [
      {
        id: "madina",
        name: "Madina",
        city: "Toshkent",
        text: "Tashkilot yuqori darajada, doimo aloqada. Ajoyib taassurotlar bilan qaytdik!",
      },
      {
        id: "azamat",
        name: "Azamat",
        city: "Samarqand",
        text:
          "Byudjetimizga mos tur tanlab berishdi. Transferlar aniq, mehmonxona toza.",
      },
      {
        id: "saida",
        name: "Saida",
        city: "Namangan",
        text: "Bolalarga juda yoqdi! Parvozlar qulay, joyida yordam bor.",
      },
    ],
  },
  en: {
    nav: {
      destinations: "Destinations",
      hot: "Hot tours",
      about: "About",
      reviews: "Reviews",
      contacts: "Contacts",
    },
    header: {
      contact: "Contact",
      marquee:
        "Hot tours this week · Sharm El Sheikh from $900 · Dubai direct flights · Up to 20% off family tours ·",
    },
    hero: {
      badge: "2025 season",
      title: "Discover the world with Qoratosh Travel",
      description:
        "Curated routes, city tours, and hot deals with full support. We craft journeys worth remembering.",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
      stats: ["300+ destinations", "24/7 support", "Best price guarantee"],
      slides: [
        {
          badge: "2025 season",
          title: "Discover the world with Qoratosh Travel",
          description:
            "Curated routes, city tours, and hot deals with full support. We craft journeys worth remembering.",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
          stats: ["300+ destinations", "24/7 support", "Best price guarantee"],
        },
        {
          badge: "New routes",
          title: "City tours and beach escapes",
          description:
            "Weekly picks, verified hotels, and great flight options for a smooth getaway.",
          image:
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
          stats: ["Departures from Tashkent", "Best price", "Personal manager"],
        },
        {
          badge: "Hot deals",
          title: "Pick tours with maximum savings",
          description:
            "Plan ahead or grab last-minute offers — we keep the best options updated.",
          image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
          stats: ["Up to 20% off", "Prime dates", "Verified hotels"],
        },
      ],
    },
    tourPage: {
      label: "Tour",
      back: "Back",
      infoTitle: "Tour info",
      aboutTitle: "Tour description",
      aboutText: "Tour details will be loaded from the admin panel.",
      bookButton: "Book now",
    },
    search: {
      destinationLabel: "Destination",
      destinationPlaceholder: "Sharm El Sheikh",
      peopleLabel: "Guests",
      peopleValue: "2 adults",
      peopleUnit: "people",
      adultsLabel: "Travelers",
      startLabel: "Check-in",
      endLabel: "Check-out",
      dateLabel: "Dates",
      dateValue: "Oct 12 - 13",
      typeLabel: "Type",
      typeValue: "All",
      typeOptions: [
        { value: "all", label: "All" },
        { value: "hot", label: "Hot" },
      ],
      button: "Book now",
      priceFrom: "from",
      nightsLabel: "nights",
      resultsTitle: "Matching tours",
      empty: "No tours found for the selected filters.",
      loading: "Searching for the best options...",
      error: "Search failed. Please try again.",
      resetLabel: "Clear dates",
    },
    about: {
      label: "About",
      title: "Qoratosh Travel agency",
      text:
        "We design thoughtful routes and handle every detail: tickets, hotels, transfers, excursions, and on-site support. We work with trusted partners and honest pricing.",
      perks: [
        "Curated hotels and locations",
        "Personal manager",
        "24/7 support",
        "Tours worldwide",
      ],
      whyLabel: "Why us",
      whyPoints: [
        "Expert routes across cities and regions.",
        "Flexible packages and early-bird discounts.",
        "Partner network in 30+ countries.",
      ],
      foundedTitle: "Founded in 2015",
      foundedText:
        "12,000+ happy clients and a growing base of loyal travelers.",
    },
    destinations: {
      label: "Choose a tour that fits you",
      title: "Tours & destinations",
      button: "All destinations",
    },
    gallery: {
      images: [
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
      ],
    },
    hot: {
      label: "Hot tours",
      title: "Book now at the best prices",
      description:
        "Updated weekly. Prime dates, direct flights, and verified hotels.",
      promoBadge: "Deal",
      promoTitle: "20% off family tours",
      promoButton: "Get offer",
      detailsButton: "Details",
      slides: [
        {
          badge: "Deal of the week",
          title: "20% off family tours",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1200&auto=format&fit=crop",
        },
        {
          badge: "Limited",
          title: "Sharm El Sheikh from $900",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
        },
        {
          badge: "Hot deal",
          title: "Dubai with direct flight",
          href: "#hot",
          image:
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
        },
      ],
    },
    promos: {
      monthLabel: "Monthly offers",
      monthTitle: "Weekend city breaks",
      monthText:
        "Perfect for a short escape. Europe's most beautiful cities with a guide.",
      monthHref: "/hot",
      monthButton: "View tours",
      specialLabel: "Special offer",
      specialTitle: "Honeymoon by the sea",
      specialText:
        "Packages for two with romantic dinners, spa, and private transfer.",
      specialHref: "/hot",
      specialButton: "Book now",
    },
    reviews: {
      label: "Client reviews",
      title: "Travelers' impressions",
    },
    cta: {
      kicker: "Travel the world",
      title: "#QORATOSH TRAVEL",
      button: "Get consultation",
      formTitle: "Fill out the form",
      formSubtitle: "Our managers will contact you.",
      formName: "First name",
      formLastName: "Last name",
      formPhone: "Phone",
      formComment: "Comment",
      formSubmit: "Send",
    },
    footer: {
      title: "Qoratosh Travel",
      text: "City tours, beach destinations, hot deals, and bespoke routes.",
      contactsTitle: "Contacts",
      address: "Tashkent, Amir Temur st., 12",
      phone: "+998 90 000 00 00",
      email: "info@qoratosh.uz",
      socialLabel: "Social networks",
      socialLinks: [
        { href: "https://t.me/qoratosh", label: "Telegram" },
        { href: "https://instagram.com/qoratosh", label: "Instagram" },
        { href: "https://wa.me/998900000000", label: "WhatsApp" },
      ],
    },
    tours: [
      {
        id: "sharm",
        title: "Sharm El Sheikh",
        city: "Egypt",
        price: "from $900",
        days: "7 nights",
        people: "1-4",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "istanbul",
        title: "Istanbul",
        city: "Turkey",
        price: "from $520",
        days: "4 nights",
        people: "1-3",
        image:
          "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop",
      },
      {
        id: "dubai",
        title: "Dubai",
        city: "UAE",
        price: "from $1200",
        days: "6 nights",
        people: "2-6",
        image:
          "https://images.unsplash.com/photo-1504270997636-07ddfbd48945?q=80&w=1200&auto=format&fit=crop",
      },
    ],
    hotTours: [
      {
        id: "antalya",
        title: "Antalya",
        city: "Turkey",
        price: "from $430",
        badge: "Hot deal",
        people: "2-4",
      },
      {
        id: "bali",
        title: "Bali",
        city: "Indonesia",
        price: "from $1490",
        badge: "Limited",
        people: "2-4",
      },
      {
        id: "prague",
        title: "Prague",
        city: "Czechia",
        price: "from $610",
        badge: "Autumn hit",
        people: "1-3",
      },
    ],
    reviewsList: [
      {
        id: "madina",
        name: "Madina",
        city: "Tashkent",
        text:
          "Excellent organization and constant support. We came back with amazing emotions!",
      },
      {
        id: "azamat",
        name: "Azamat",
        city: "Samarkand",
        text:
          "They matched a tour to our budget. Clean hotel and on-time transfers.",
      },
      {
        id: "saida",
        name: "Saida",
        city: "Namangan",
        text: "Kids loved it! Convenient flights and support on site.",
      },
    ],
  },
} as const;

export const defaultLang: Lang = "ru";
