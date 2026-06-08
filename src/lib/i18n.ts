"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ru: {
    translation: {
      // Header
      home: "Главная",
      about: "О нас",
      booking: "Бронирование",
      admin: "Админка",
      logout: "Выйти",
      welcomeAdmin: "Привет, Admin",
      brandName: "Отдых в Затоке",

      // Sticky Booking Bar
      reviews: "отзывов",
      scarcityTitle: "Лето",
      scarcityText: "осталось мало свободных дат. Бронируйте сейчас.",
      selectDates: "Выбрать даты",

      // Hero
      premiumBadge: "Премиум курорт на Черном море",
      heroTitle1: "Ваш идеальный",
      heroTitle2: "морской побег",
      heroTitle3: "в Затоке",
      heroDescription: "Испытайте несравненный пятизвездочный комфорт, ласковые волны и захватывающие дух панорамные виды на Черное море.",
      firstLine: "Первая линия",
      beachDistance: "10м до пляжа",
      security: "Безопасность",
      securedArea: "Охраняемая зона",
      bookStay: "Забронировать отдых",
      learnMore: "Узнать больше",
      waterTemp: "Температура воды",
      guestRating: "Рейтинг гостей",
      excellent: "Превосходно",

      // Welcome Section
      exclusiveService: "Эксклюзивный сервис",
      welcomeTitle: 'Добро пожаловать в "Отдых в Затоке"',
      welcomeDesc: 'Расположенный на безмятежном побережье Черного моря, "Отдых в Затоке" предлагает идеальное сочетание роскоши, комфорта и природной красоты. Ищете ли вы романтический уик-энд или семейное приключение, наш отель — ваше идеальное место для незабываемого отдыха.',

      // Featured Rooms
      perfectComfort: "Идеальный комфорт",
      featuredRooms: "Наши избранные номера",
      featuredRoomsDesc: "Элегантно оформленные номера и роскошные люксы для вашего максимального расслабления.",

      // Amenities
      allInclusive: "Всё включено",
      hotelAmenities: "Удобства отеля",
      hotelAmenitiesDesc: "Всё, что вам может понадобиться для безупречного и беззаботного отпуска у моря.",
      
      // Amenities names & descriptions
      pool: "Бассейн",
      poolDesc: "Большой открытый бассейн с зоной для загара.",
      wifi: "Бесплатный Wi-Fi",
      wifiDesc: "Высокоскоростной доступ в Интернет на всей территории отеля.",
      restaurant: "Ресторан",
      restaurantDesc: "Ресторан на территории отеля, предлагающий блюда местной и международной кухни.",
      privateBeach: "Частный пляж",
      privateBeachDesc: "Прямой доступ к чистому и частному пляжу.",
      spa: "Спа и оздоровление",
      spaDesc: "Расслабьтесь и омолодитесь в нашем современном спа-центре.",
      parking: "Парковка",
      parkingDesc: "Безопасная парковка для всех наших гостей.",
      roomService: "Обслуживание номеров",
      roomServiceDesc: "Круглосуточное обслуживание номеров для вашего удобства.",
      fitness: "Фитнес-центр",
      fitnessDesc: "Поддерживайте форму в нашем полностью оборудованном тренажерном зале.",

      // Bottom CTA
      readyForHoliday: "Готовы к вашему идеальному отдыху?",
      bottomCtaDesc: "Берега Затоки зовут. Забронируйте отпуск своей мечты сегодня и создайте воспоминания, которые останутся на всю жизнь.",
      bookNowBtn: "Забронировать номер сейчас",

      // About Page
      aboutService: "Премиум сервис у моря",
      aboutTitle: "Создавая незабываемый отдых",
      aboutDesc: 'Откройте для себя историю, страсть и людей, которые делают "Отдых в Затоке" уникальным местом на побережье Черного моря.',
      ourStory: "Наша история",
      storyDesc1: 'Основанный в 2010 году, "Отдых в Затоке" родился из мечты создать оазис спокойствия и роскоши в одном из самых красивых прибрежных городов Украины. Наши основатели, семья с глубокими корнями в Одесском регионе, представляли себе место, где современный комфорт сочетается с вечной красотой Черного моря.',
      storyDesc2: "За годы мы выросли из небольшого очаровательного гостевого дома в полноценный отель, но наше стремление предоставлять личный, теплый и гостеприимный опыт никогда не ослабевало. Мы гордимся тем, что являемся краеугольным камнем гостеприимства в Затоке.",
      ourMission: "Наша миссия",
      missionDesc: "Предоставлять исключительный опыт гостеприимства на берегу моря, сочетая роскошь, комфорт и индивидуальное обслуживание, создавая незабываемые воспоминания для каждого гостя.",
      ourValues: "Наши ценности",
      valGuest: "Ориентация на гостя: Наши гости находятся в центре всего, что мы делаем.",
      valExcel: "Превосходность: Мы стремимся к самым высоким стандартам качества и обслуживания.",
      valInteg: "Честность: Мы работаем честно и прозрачно.",
      ourTeam: "Наша преданная команда",
      teamDesc: "Улыбающиеся лица, стоящие за вашим идеальным отдыхом на море.",
      roleGM: "Генеральный менеджер",
      roleConcierge: "Начальник консьерж-службы",
      roleChef: "Шеф-повар",
      amenitiesServices: "Удобства и услуги",
      amenitiesServicesDesc: "Мы предоставляем широкий спектр услуг премиум-класса, чтобы сделать ваше пребывание комфортным и незабываемым.",

      // Booking Page
      bookingService: "Бронирование номеров",
      bookingTitle: "Забронируйте ваш номер",
      bookingDesc: "Выберите даты, чтобы найти идеальный номер для вашего отпуска на море.",
      availableRooms: "Доступные номера",
      allRooms: "Наши номера и люксы",
      roomsFound: "Найдено {{count}} номеров по вашему запросу.",
      findPerfectSpace: "Найдите идеальное пространство для вашего пребывания.",
      checkInOut: "Заезд / Выезд",
      selectDateRange: "Выберите диапазон дат",
      guests: "Гости",
      guestsPlaceholder: "Количество гостей",
      checkAvailability: "Проверить наличие",
      roomsNotFoundToastTitle: "Номера не найдены",
      roomsNotFoundToastDesc: "К сожалению, на выбранные даты нет доступных номеров с подходящей вместимостью.",
      roomsFoundToastTitle: "Найдено номеров",
      roomsFoundToastDesc: "Найдено {{count}} доступных номеров на выбранные даты.",
      dateRequired: "Дата заезда обязательна.",
      dateOutRequired: "Дата выезда обязательна.",
      minGuests: "Требуется как минимум один гость.",
    },
  },
  uk: {
    translation: {
      // Header
      home: "Головна",
      about: "Про нас",
      booking: "Бронювання",
      admin: "Адмінка",
      logout: "Вийти",
      welcomeAdmin: "Привіт, Admin",
      brandName: "Відпочинок у Затоці",

      // Sticky Booking Bar
      reviews: "відгуків",
      scarcityTitle: "Літо",
      scarcityText: "залишилося мало вільних дат. Бронюйте зараз.",
      selectDates: "Обрати дати",

      // Hero
      premiumBadge: "Преміум курорт на Чорному морі",
      heroTitle1: "Ваша ідеальна",
      heroTitle2: "морська втеча",
      heroTitle3: "в Затоці",
      heroDescription: "Відчуйте незрівнянний п'ятизірковий комфорт, ласкаві хвилі та захоплюючі панорамні види на Чорне море.",
      firstLine: "Перша лінія",
      beachDistance: "10м до пляжу",
      security: "Безпека",
      securedArea: "Охоронювана зона",
      bookStay: "Забронювати відпочинок",
      learnMore: "Дізнатися більше",
      waterTemp: "Температура води",
      guestRating: "Рейтинг гостей",
      excellent: "Чудово",

      // Welcome Section
      exclusiveService: "Ексклюзивний сервіс",
      welcomeTitle: 'Ласкаво просимо до "Відпочинок у Затоці"',
      welcomeDesc: 'Розташований на безтурботному узбережжі Чорного моря, "Відпочинок у Затоці" пропонує ідеальне поєднання розкоші, комфорту та природної краси. Шукаєте ви романтичний вікенд чи сімейну пригоду, наш готель — ваше ідеальне місце для незабутнього відпочинку.',

      // Featured Rooms
      perfectComfort: "Ідеальний комфорт",
      featuredRooms: "Наші обрані номери",
      featuredRoomsDesc: "Елегантно оформлені номери та розкішні люкси для вашого максимального розслаблення.",

      // Amenities
      allInclusive: "Все включено",
      hotelAmenities: "Зручності готелю",
      hotelAmenitiesDesc: "Все, що вам може знадобитися для бездоганної та безтурботної відпустки біля моря.",

      // Amenities names & descriptions
      pool: "Басейн",
      poolDesc: "Великий відкритий басейн із зоною для засмаги.",
      wifi: "Безкоштовний Wi-Fi",
      wifiDesc: "Високошвидкісний доступ до Інтернету на всій території готелю.",
      restaurant: "Ресторан",
      restaurantDesc: "Ресторан на території готелю, що пропонує страви місцевої та міжнародної кухні.",
      privateBeach: "Приватний пляж",
      privateBeachDesc: "Прямий доступ до чистого та приватного пляжу.",
      spa: "Спа та оздоровлення",
      spaDesc: "Розслабтеся та відновіть сили у нашому сучасному спа-центрі.",
      parking: "Парковка",
      parkingDesc: "Безпечна парковка для всіх наших гостей.",
      roomService: "Обслуговування номерів",
      roomServiceDesc: "Цілодобове обслуговування номерів для вашої зручності.",
      fitness: "Фітнес-центр",
      fitnessDesc: "Підтримуйте форму у нашому повністю обладнаному тренажерному залі.",

      // Bottom CTA
      readyForHoliday: "Готові до вашого ідеального відпочинку?",
      bottomCtaDesc: "Береги Затоки кличуть. Забронюйте відпустку своєї мрії сьогодні та створіть спогади, які залишаться на все життя.",
      bookNowBtn: "Забронювати номер зараз",

      // About Page
      aboutService: "Преміум сервіс біля моря",
      aboutTitle: "Створюючи незабутній відпочинок",
      aboutDesc: 'Відкрийте для себя історію, пристрасть та людей, які роблять "Відпочинок у Затоці" унікальним місцем на узбережжі Чорного моря.',
      ourStory: "Наша історія",
      storyDesc1: 'Заснований у 2010 році, "Відпочинок у Затоці" народився з мрії створити оазу спокою та розкоші в одному з найкрасивіших прибережних міст України. Наші засновники, родина з глибоким корінням в Одеському регіоні, уявляли собі місце, де сучасний комфорт поєднується з вічною красаю Чорного моря.',
      storyDesc2: "За роки ми виросли з невеликого чарівного гостьового будинку в повноцінний готель, но наше прагнення надавати особистий, теплий та гостинний досвід ніколи не слабшало. Ми пишаємося тим, що є наріжним каменем гостинності в Затоці.",
      ourMission: "Наша місія",
      missionDesc: "Надавати винятковий досвід гостинності на березі моря, поєднуючи розкіш, комфорт та індивідуальне обслуговування, створюючи незабутні спогади для кожного гостя.",
      ourValues: "Наші цінності",
      valGuest: "Орієнтація на гостя: Наші гості перебувають у центрі всього, що ми робимо.",
      valExcel: "Досконалість: Ми прагемо найвищих стандартів якості та обслуговування.",
      valInteg: "Чесність: Ми працюємо чесно та прозоро.",
      ourTeam: "Наша віддана команда",
      teamDesc: "Посмішки людей, які створюють ваш ідеальний відпочинок на морі.",
      roleGM: "Генеральний менеджер",
      roleConcierge: "Керівник консьєрж-служби",
      roleChef: "Шеф-кухар",
      amenitiesServices: "Зручності та послуги",
      amenitiesServicesDesc: "Ми надаємо широкий спектр послуг преміум-класу, щоб зробити ваше перебування комфортним та незабутнім.",

      // Booking Page
      bookingService: "Бронювання номерів",
      bookingTitle: "Забронюйте ваш номер",
      bookingDesc: "Оберіть дати, щоб знайти ідеальний номер для вашої відпустки біля моря.",
      availableRooms: "Доступні номери",
      allRooms: "Наші номери та люкси",
      roomsFound: "Знайдено {{count}} номерів за вашим запитом.",
      findPerfectSpace: "Знайдіть ідеальний простір для вашого перебування.",
      checkInOut: "Заїзд / Виїзд",
      selectDateRange: "Оберіть діапазон дат",
      guests: "Гості",
      guestsPlaceholder: "Кількість гостей",
      checkAvailability: "Перевірити наявність",
      roomsNotFoundToastTitle: "Номери не знайдено",
      roomsNotFoundToastDesc: "На жаль, на вибрані дати немає доступних номерів з відповідною місткістю.",
      roomsFoundToastTitle: "Знайдено номерів",
      roomsFoundToastDesc: "Знайдено {{count}} доступних номерів на вибрані дати.",
      dateRequired: "Дата заїзду є обов'язковою.",
      dateOutRequired: "Дата виїзду є обов'язковою.",
      minGuests: "Потрібно щонайменше одного гостя.",
    },
  },
  en: {
    translation: {
      // Header
      home: "Home",
      about: "About",
      booking: "Booking",
      admin: "Admin",
      logout: "Logout",
      welcomeAdmin: "Hello, Admin",
      brandName: "Zatoka Resort",

      // Sticky Booking Bar
      reviews: "reviews",
      scarcityTitle: "Summer",
      scarcityText: "few dates available. Book now.",
      selectDates: "Choose dates",

      // Hero
      premiumBadge: "Premium Black Sea Resort",
      heroTitle1: "Your Perfect",
      heroTitle2: "Seaside Escape",
      heroTitle3: "in Zatoka",
      heroDescription: "Experience unparalleled five-star comfort, gentle waves, and breathtaking panoramic views of the Black Sea.",
      firstLine: "First Beachline",
      beachDistance: "10m to beach",
      security: "Security",
      securedArea: "Protected territory",
      bookStay: "Book Your Stay",
      learnMore: "Learn More",
      waterTemp: "Water Temperature",
      guestRating: "Guest Rating",
      excellent: "Excellent",

      // Welcome Section
      exclusiveService: "Exclusive Service",
      welcomeTitle: 'Welcome to "Zatoka Resort"',
      welcomeDesc: 'Located on the serene shores of the Black Sea, "Zatoka Resort" offers the perfect blend of luxury, comfort, and natural beauty. Whether you seek a romantic weekend or a family adventure, our hotel is your ideal destination for an unforgettable vacation.',

      // Featured Rooms
      perfectComfort: "Perfect Comfort",
      featuredRooms: "Our Featured Rooms",
      featuredRoomsDesc: "Elegantly designed rooms and luxury suites for your ultimate relaxation.",

      // Amenities
      allInclusive: "All Inclusive",
      hotelAmenities: "Hotel Amenities",
      hotelAmenitiesDesc: "Everything you might need for an immaculate and carefree vacation by the sea.",

      // Amenities names & descriptions
      pool: "Pool",
      poolDesc: "Large outdoor swimming pool with a sunbathing area.",
      wifi: "Free Wi-Fi",
      wifiDesc: "High-speed Internet access throughout the entire hotel property.",
      restaurant: "Restaurant",
      restaurantDesc: "On-site restaurant offering delicious local and international cuisine.",
      privateBeach: "Private Beach",
      privateBeachDesc: "Direct access to a clean, private sandy beach.",
      spa: "Spa & Wellness",
      spaDesc: "Relax and rejuvenate in our state-of-the-art spa center.",
      parking: "Parking",
      parkingDesc: "Secure parking space for all of our guests.",
      roomService: "Room Service",
      roomServiceDesc: "24/7 room service for your maximum convenience.",
      fitness: "Fitness Center",
      fitnessDesc: "Stay in shape in our fully equipped modern gym.",

      // Bottom CTA
      readyForHoliday: "Ready for your perfect getaway?",
      bottomCtaDesc: "The shores of Zatoka are calling. Book your dream vacation today and make memories that will last a lifetime.",
      bookNowBtn: "Book a Room Now",

      // About Page
      aboutService: "Premium Seaside Service",
      aboutTitle: "Creating Unforgettable Vacations",
      aboutDesc: 'Discover the story, passion, and people who make "Zatoka Resort" a unique destination on the Black Sea coast.',
      ourStory: "Our Story",
      storyDesc1: 'Founded in 2010, "Zatoka Resort" was born from a dream to create an oasis of tranquility and luxury in one of Ukraine\'s most beautiful coastal towns. Our founders, a family with deep roots in the Odesa region, envisioned a place where modern comfort meets the eternal beauty of the Black Sea.',
      storyDesc2: "Over the years, we have grown from a small charming guest house into a full-scale hotel, yet our commitment to providing a personal, warm, and hospitable experience has never wavered. We are proud to be a cornerstone of hospitality in Zatoka.",
      ourMission: "Our Mission",
      missionDesc: "To provide an exceptional seaside hospitality experience, combining luxury, comfort, and personalized service, creating unforgettable memories for every guest.",
      ourValues: "Our Values",
      valGuest: "Guest Centricity: Our guests are at the center of everything we do.",
      valExcel: "Excellence: We strive for the highest standards of quality and service.",
      valInteg: "Integrity: We operate with honesty and transparency.",
      ourTeam: "Our Dedicated Team",
      teamDesc: "The smiling faces behind your perfect seaside getaway.",
      roleGM: "General Manager",
      roleConcierge: "Head of Concierge",
      roleChef: "Executive Chef",
      amenitiesServices: "Amenities & Services",
      amenitiesServicesDesc: "We provide a wide range of premium services to make your stay comfortable and unforgettable.",

      // Booking Page
      bookingService: "Room Booking",
      bookingTitle: "Book Your Room",
      bookingDesc: "Select dates to find the perfect room for your seaside holiday.",
      availableRooms: "Available Rooms",
      allRooms: "Our Rooms & Suites",
      roomsFound: "Found {{count}} rooms matching your request.",
      findPerfectSpace: "Find the perfect space for your stay.",
      checkInOut: "Check-in / Check-out",
      selectDateRange: "Select date range",
      guests: "Guests",
      guestsPlaceholder: "Number of guests",
      checkAvailability: "Check Availability",
      roomsNotFoundToastTitle: "No Rooms Found",
      roomsNotFoundToastDesc: "Unfortunately, there are no rooms available with the requested capacity for the selected dates.",
      roomsFoundToastTitle: "Rooms Found",
      roomsFoundToastDesc: "Found {{count}} available rooms for the selected dates.",
      dateRequired: "Check-in date is required.",
      dateOutRequired: "Check-out date is required.",
      minGuests: "At least one guest is required.",
    },
  },
};

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      supportedLngs: ["ru", "uk", "en"],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
        caches: ["cookie", "localStorage"],
        lookupCookie: "lang",
      },
    });
}

export default i18n;
