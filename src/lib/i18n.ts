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
      blog: "Блог",
      quiz: "Викторина",
      blogTitle: "Блог и полезные советы",
      searchArticles: "Поиск статей...",
      readMore: "Читать далее",
      noArticles: "Статьи не найдены.",
      relatedPosts: "Похожие статьи",
      publishedOn: "Опубликовано",
      allCategories: "Все категории",

      // Sticky Booking Bar
      reviews: "отзывов",
      scarcityTitle: "Лето",
      scarcityText: "осталось мало свободных дат. Бронируйте сейчас.",
      selectDates: "Выбрать даты",

      // Callback / Contact
      callbackButton: "Связаться с нами",
      callbackTitle: "Обратный звонок",
      callbackDesc: "Оставьте контакты, и мы перезвоним вам в течение 15 минут.",
      callbackName: "Ваше имя",
      callbackPhone: "Номер телефона",
      callbackMessage: "Вопрос или пожелание (необязательно)",
      callbackSubmit: "Перезвоните мне",
      callbackSuccess: "Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
      callbackError: "Произошла ошибка. Пожалуйста, попробуйте еще раз.",
      trustBadge1: "Отмена за 7 дней",
      trustBadge2: "Оплата на месте",
      trustBadge3: "Цена ниже рынка",

      // Hero
      premiumBadge: "Уютный семейный гостевой дом",
      heroTitle1: "Уютный летний отдых",
      heroTitle2: "для всей вашей семьи",
      heroTitle3: "в Zatoka Getaway",
      heroDescription: "Семейный отель «Отдых в Затоке». Зеленый двор с мангалами, детская игровая зона, общая кухня, кондиционеры, Wi-Fi и бесплатная парковка. Всего 10 минут ходьбы до песчаного пляжа.",
      firstLine: "Уютный двор",
      beachDistance: "10 минут до пляжа",
      security: "Конфиденциальность",
      securedArea: "Закрытая зеленая территория",
      bookStay: "Забронировать отдых",
      learnMore: "Исследовать комнаты",
      waterTemp: "Температура воды",
      guestRating: "Рейтинг гостей",
      excellent: "Превосходно",

      // Welcome Section
      exclusiveService: "Семейный уют",
      welcomeTitle: 'Добро пожаловать в «Отдых в Затоке»',
      welcomeDesc: 'Наш уютный семейный гостевой дом расположен в тихой части Затоки, всего в 10 минутах ходьбы от песчаного пляжа. Мы предлагаем комфортабельные комнаты со всеми удобствами (кондиционер, Wi-Fi, санузел), зеленый двор с мангалом для барбекю, детскую площадку и общую кухню для самостоятельного приготовления еды. Это идеальное место для спокойного и теплого семейного отдыха.',

      // Featured Rooms
      perfectComfort: "Уют и забота",
      featuredRooms: "Наши уютные комнаты",
      featuredRoomsDesc: "Чистые и комфортабельные комнаты со всеми необходимыми удобствами для вашей семьи.",

      // Amenities
      allInclusive: "Удобство и комфорт",
      hotelAmenities: "Наши удобства",
      hotelAmenitiesDesc: "Всё необходимое для приятного отдыха всей семьей без лишних забот.",
      
      // Amenities names & descriptions
      pool: "Кондиционер",
      poolDesc: "Современный тихий кондиционер в каждом номере для вашего комфорта.",
      wifi: "Бесплатный Wi-Fi",
      wifiDesc: "Высокоскоростной доступ в Интернет на всей территории гостевого дома.",
      restaurant: "Общая кухня",
      restaurantDesc: "Полностью оборудованная кухня со всей необходимой посудой и техникой.",
      privateBeach: "Песчаный пляж",
      privateBeachDesc: "Песчаный пляж с пологим входом в воду всего в 10 минутах ходьбы.",
      spa: "Детская площадка",
      spaDesc: "Безопасная детская площадка с качелями и песочницей во дворе.",
      parking: "Парковка во дворе",
      parkingDesc: "Безопасные парковочные места для наших гостей на закрытой территории.",
      roomService: "Мангальная зона",
      roomServiceDesc: "Просторный тенистый двор с мангалами, решетками и беседками.",
      fitness: "Зеленый двор",
      fitnessDesc: "Ухоженная территория с цветами и зонами для отдыха в тени деревьев.",

      // Bottom CTA
      readyForHoliday: "Хотите приехать к нам отдыхать?",
      bottomCtaDesc: "Забронируйте комнату заранее, чтобы гарантировать свободные даты для вашей семьи по лучшей цене.",
      bookNowBtn: "Забронировать комнату сейчас",

      // Season Banner
      seasonBefore: "До начала сезона",
      seasonBookEarly: "бронируйте заранее по лучшей цене!",
      seasonDuring: "Сезон в разгаре! Осталось",
      seasonHurry: "лучшие даты уходят!",

      // Why Choose Us
      whyChooseBadge: "Ваш комфорт",
      whyChooseTitle: "Почему выбирают нас",
      whyChooseDesc: "Простые и понятные условия отдыха — мы делаем всё, чтобы вы чувствовали себя как дома.",
      whyBeach: "10 минут до пляжа",
      whyBeachDesc: "Песчаный пляж всего в 10 минутах спокойной ходьбы от гостевого дома — приятная прогулка.",
      whyPayment: "Оплата на месте",
      whyPaymentDesc: "Никакой предоплаты. Оплачивайте при заселении — наличными или картой.",
      whyCancel: "Бесплатная отмена",
      whyCancelDesc: "Планы изменились? Отмените бронирование за 7 дней без каких-либо штрафов.",
      whyFamily: "Идеально для семей",
      whyFamilyDesc: "Детская площадка, тихий закрытый двор, общая кухня — всё для комфортного отдыха с детьми.",

      // Exit Intent Popup
      exitTitle: "Не нашли подходящий номер?",
      exitDesc: "Оставьте номер — мы подберём лучший вариант и перезвоним за 10 минут. Бесплатно.",
      exitCta: "Перезвоните мне",
      exitSuccessTitle: "Отлично!",
      exitSuccessDesc: "Мы перезвоним вам в течение 10 минут и поможем подобрать идеальный номер.",
      exitPrivacy: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных",

      // Guest Impressions
      reviewsBadge: "Отзывы наших гостей",
      reviewsTitle: "Впечатления гостей",
      reviewsDesc: "Наши гости ценят нас за домашний уют и гостеприимство. Вот их отзывы.",
      reviewsCount: "отзывов гостей",
      reviewsRecommend: "рекомендуют",

      // Mobile Sticky
      stickyMobileFrom: "от",
      stickyMobileNight: "ночь",

      // About Page
      aboutService: "Семейный уют у моря",
      aboutTitle: "Создавая атмосферу дома",
      aboutDesc: 'Откройте для себя историю гостевого дома «Отдых в Затоке» и людей, которые заботятся о вашем комфорте.',
      ourStory: "Наша история",
      storyDesc1: 'Основанный в 2010 году, наш гостевой дом родился из желания создать уютный уголок для доступного семейного отдыха в Затоке. Мы — семейное дело, и с самого начала стремились сделать место, где каждый гость будет чувствовать себя желанным другом.',
      storyDesc2: "За прошедшие годы мы обустроили комфортабельные комнаты со всеми удобствами, посадили прекрасный зеленый сад, сделали мангальную зону и детскую площадку, сохранив теплоту домашнего приема и заботу о каждом госте.",
      ourMission: "Наша миссия",
      missionDesc: "Обеспечить комфортный, душевный и доступный отдых для всей семьи, окружая каждого гостя домашней заботой и вниманием.",
      ourValues: "Наши ценности",
      valGuest: "Домашнее гостеприимство: Мы принимаем гостей как близких друзей.",
      valExcel: "Чистота и порядок: Мы поддерживаем идеальный порядок в комнатах и во дворе.",
      valInteg: "Честность: Открытые цены без скрытых платежей и предоплаты.",
      ourTeam: "Наша семья",
      teamDesc: "Люди, которые ежедневно заботятся о вашем комфорте и уюте.",
      roleGM: "Владелица гостевого дома",
      roleConcierge: "Администратор двора",
      roleChef: "Помощник по хозяйству",
      amenitiesServices: "Удобства и услуги",
      amenitiesServicesDesc: "Всё необходимое для беззаботного семейного отдыха у Черного моря.",

      // Booking Page
      bookingService: "Бронирование комнат",
      bookingTitle: "Забронируйте вашу комнату",
      bookingDesc: "Выберите даты, чтобы найти свободную комнату для вашей семьи.",
      availableRooms: "Доступные комнаты",
      allRooms: "Наши комнаты",
      roomsFound: "Найдено {{count}} свободных комнат по вашему запросу.",
      findPerfectSpace: "Найдите идеальную комнату для отдыха.",
      checkInOut: "Заезд / Выезд",
      selectDateRange: "Выберите даты проживания",
      guests: "Гости",
      guestsPlaceholder: "Количество гостей",
      checkAvailability: "Проверить наличие",
      roomsNotFoundToastTitle: "Комнаты не найдены",
      dateAlreadyBooked: "Этот день уже занят",
      roomsNotFoundToastDesc: "К сожалению, на выбранные даты нет свободных комнат с подходящей вместимостью.",
      roomsFoundToastTitle: "Найдено комнат",
      roomsFoundToastDesc: "Найдено {{count}} свободных комнат на выбранные даты.",
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
      blog: "Блог",
      quiz: "Вікторина",
      blogTitle: "Блог та корисні поради",
      searchArticles: "Пошук статей...",
      readMore: "Читати далі",
      noArticles: "Статті не знайдено.",
      relatedPosts: "Схожі статті",
      publishedOn: "Опубліковано",
      allCategories: "Всі категорії",

      // Sticky Booking Bar
      reviews: "відгуків",
      scarcityTitle: "Літо",
      scarcityText: "залишилося мало вільних дат. Бронюйте зараз.",
      selectDates: "Обрати дати",

      // Callback / Contact
      callbackButton: "Зв'язатися з нами",
      callbackTitle: "Зворотний дзвінок",
      callbackDesc: "Залиште контакти, і ми передзвонимо вам протягом 15 хвилин.",
      callbackName: "Ваше ім'я",
      callbackPhone: "Номер телефону",
      callbackMessage: "Питання або побажання (необов'язково)",
      callbackSubmit: "Передзвоніть мені",
      callbackSuccess: "Заявку відправлено! Ми зв'яжемося з вами найближчим часом.",
      callbackError: "Сталася помилка. Будь ласка, спробуйте ще раз.",
      trustBadge1: "Скасування за 7 днів",
      trustBadge2: "Оплата на місці",
      trustBadge3: "Ціна нижча за ринок",

      // Hero
      premiumBadge: "Затишний сімейний гостьовий будинок",
      heroTitle1: "Затишний літній відпочинок",
      heroTitle2: "для всієї вашої родини",
      heroTitle3: "в Zatoka Getaway",
      heroDescription: "Сімейний готель «Відпочинок у Затоці». Зелений двір з мангалами, дитячий майданчик, спільна кухня, кондиціонери, Wi-Fi та безкоштовна парковка. Лише 10 хвилин пішки до моря.",
      firstLine: "Затишний двір",
      beachDistance: "10 хвилин до пляжу",
      security: "Конфіденційність",
      securedArea: "Закрита зелена територія",
      bookStay: "Забронювати відпочинок",
      learnMore: "Дослідити кімнати",
      waterTemp: "Температура води",
      guestRating: "Рейтинг гостей",
      excellent: "Чудово",

      // Welcome Section
      exclusiveService: "Сімейний затишок",
      welcomeTitle: 'Ласкаво просимо до «Відпочинку у Затоці»',
      welcomeDesc: 'Наш затишний сімейний гостьовий будинок розташований у тихій частині Затоки, всього за 10 хвилин ходьби від піщаного пляжу. Ми пропонуємо комфортабельні кімнати з усіма зручностями (кондиціонер, Wi-Fi, санвузол), зелений двір з мангалом для барбекю, дитячий майданчик та спільну кухню для самостійного приготування їжі. Це ідеальне місце для спокійного сімейного відпочинку.',

      // Featured Rooms
      perfectComfort: "Затишок та турбота",
      featuredRooms: "Наші затишні кімнати",
      featuredRoomsDesc: "Чисті та комфортні кімнати з усіма зручностями для сімейного відпочинку.",

      // Amenities
      allInclusive: "Зручність та комфорт",
      hotelAmenities: "Наші зручності",
      hotelAmenitiesDesc: "Все необхідне для приємного відпочинку всією родиною без зайвих турбот.",

      // Amenities names & descriptions
      pool: "Кондиціонер",
      poolDesc: "Сучасний тихий кондиціонер у кожній кімнаті для вашого комфорту.",
      wifi: "Безкоштовний Wi-Fi",
      wifiDesc: "Високошвидкісний доступ до Інтернету на всій території гостьового будинку.",
      restaurant: "Спільна кухня",
      restaurantDesc: "Повністю обладнана кухня з усім необхідним посудом та технікою.",
      privateBeach: "Піщаний пляж",
      privateBeachDesc: "Піщаний пляж з пологим входом у воду всього в 10 хвилинах ходьби.",
      spa: "Дитячий майданчик",
      spaDesc: "Безпечний дитячий майданчик з гойдалками та пісочницею у дворі.",
      parking: "Парковка у дворі",
      parkingDesc: "Безпечні паркувальні місця для наших гостей на закритій території.",
      roomService: "Мангальна зона",
      roomServiceDesc: "Просторий затінений двір з мангалами, решітками та альтанками.",
      fitness: "Зелений двір",
      fitnessDesc: "Доглянута територія з квітами та зонами для відпочинку в тіні дерев.",

      // Bottom CTA
      readyForHoliday: "Бажаєте приїхати до нас відпочивати?",
      bottomCtaDesc: "Забронюйте кімнату заздалегідь, щоб гарантувати вільні дати для вашої родини за найкращою ціною.",
      bookNowBtn: "Забронювати кімнату зараз",

      // Season Banner
      seasonBefore: "До початку сезону",
      seasonBookEarly: "бронюйте заздалегідь за найкращою ціною!",
      seasonDuring: "Сезон у розпалі! Залишилось",
      seasonHurry: "найкращі дати розбирають!",

      // Why Choose Us
      whyChooseBadge: "Ваш комфорт",
      whyChooseTitle: "Чому обирають нас",
      whyChooseDesc: "Прості та зрозумілі умови відпочинку — ми робимо все, щоб ви почувалися як вдома.",
      whyBeach: "10 хвилин до пляжу",
      whyBeachDesc: "Піщаний пляж всього в 10 хвилинах спокійної ходьби від гостьового будинку — приємна прогулянка.",
      whyPayment: "Оплата на місці",
      whyPaymentDesc: "Жодної передоплати. Оплачуйте при заселенні — готівкою або карткою.",
      whyCancel: "Безкоштовне скасування",
      whyCancelDesc: "Плани змінилися? Скасуйте бронювання за 7 днів без будь-яких штрафів.",
      whyFamily: "Ідеально для сімей",
      whyFamilyDesc: "Дитячий майданчик, тихий закритий двір, спільна кухня — все для комфортного відпочинку з дітьми.",

      // Exit Intent Popup
      exitTitle: "Не знайшли підходящий номер?",
      exitDesc: "Залиште номер — ми підберемо найкращий варіант і передзвонимо за 10 хвилин. Безкоштовно.",
      exitCta: "Передзвоніть мені",
      exitSuccessTitle: "Чудово!",
      exitSuccessDesc: "Ми передзвонимо вам протягом 10 хвилин і допоможемо підібрати ідеальну кімнату.",
      exitPrivacy: "Натискаючи кнопку, ви погоджуєтесь на обробку персональних даних",

      // Guest Impressions
      reviewsBadge: "Відгуки наших гостей",
      reviewsTitle: "Враження гостей",
      reviewsDesc: "Наші гості цінують нас за домашній затишок та гостинність. Ось їхні відгуки.",
      reviewsCount: "відгуків гостей",
      reviewsRecommend: "рекомендують",

      // Mobile Sticky
      stickyMobileFrom: "від",
      stickyMobileNight: "ніч",

      // About Page
      aboutService: "Сімейний затишок біля моря",
      aboutTitle: "Створюючи атмосферу дому",
      aboutDesc: 'Відкрийте для себе історію гостьового будинку «Відпочинок у Затоці» та людей, які дбають про ваш комфорт.',
      ourStory: "Наша історія",
      storyDesc1: 'Заснований у 2010 році, наш гостьовий будинок народився з бажання створити затишний куточок для доступного сімейного відпочинку в Затоці. Ми — сімейна справа, і з самого початку прагнули зробити місце, де кожен гість почуватиметься бажаним другом.',
      storyDesc2: "За минулі роки ми облаштували комфортабельні кімнати з усіма зручностями, посадили чудовий зелений сад, зробили мангальну зону та дитячий майданчик, зберігши теплоту домашнього прийому та турботу про кожного гостя.",
      ourMission: "Наша місія",
      missionDesc: "Забезпечити комфортний, душевний та доступний відпочинок для всієї родини, оточуючи кожного гостя домашньою турботою та увагою.",
      ourValues: "Наші цінності",
      valGuest: "Домашня гостинність: Ми приймаємо гостей як близьких друзів.",
      valExcel: "Чистота та порядок: Ми підтримуємо ідеальний порядок у кімнатах та у дворі.",
      valInteg: "Чесність: Відкриті ціни без прихованих платежів та передоплати.",
      ourTeam: "Наша родина",
      teamDesc: "Люди, які щодня дбають про ваш комфорт та затишок.",
      roleGM: "Власниця гостьового будинку",
      roleConcierge: "Адміністратор двору",
      roleChef: "Помічник по господарству",
      amenitiesServices: "Зручності та послуги",
      amenitiesServicesDesc: "Все необхідне для безтурботного сімейного відпочинку біля Чорного моря.",

      // Booking Page
      bookingService: "Бронювання кімнат",
      bookingTitle: "Забронюйте вашу кімнату",
      bookingDesc: "Оберіть дати, щоб знайти вільну кімнату для вашої родини.",
      availableRooms: "Доступні кімнати",
      allRooms: "Наші кімнати",
      roomsFound: "Знайдено {{count}} вільних кімнат за вашим запитом.",
      findPerfectSpace: "Знайдіть ідеальну кімнату для відпочинку.",
      checkInOut: "Заїзд / Виїзд",
      selectDateRange: "Оберіть дати проживання",
      guests: "Гості",
      guestsPlaceholder: "Кількість гостей",
      checkAvailability: "Перевірити наявність",
      roomsNotFoundToastTitle: "Кімнати не знайдено",
      dateAlreadyBooked: "Цей день вже зайнятий",
      roomsNotFoundToastDesc: "На жаль, на вибрані дати немає вільних кімнат з відповідною місткістю.",
      roomsFoundToastTitle: "Знайдено кімнат",
      roomsFoundToastDesc: "Знайдено {{count}} вільних кімнат на вибрані дати.",
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
      brandName: "Zatoka Getaway",
      blog: "Blog",
      quiz: "Quiz",
      blogTitle: "Blog & Helpful Tips",
      searchArticles: "Search articles...",
      readMore: "Read More",
      noArticles: "No articles found.",
      relatedPosts: "Related Articles",
      publishedOn: "Published on",
      allCategories: "All Categories",

      // Sticky Booking Bar
      reviews: "reviews",
      scarcityTitle: "Summer",
      scarcityText: "few dates available. Book now.",
      selectDates: "Choose dates",

      // Callback / Contact
      callbackButton: "Contact Us",
      callbackTitle: "Request a Callback",
      callbackDesc: "Leave your details and we will call you back within 15 minutes.",
      callbackName: "Your Name",
      callbackPhone: "Phone Number",
      callbackMessage: "Question or message (optional)",
      callbackSubmit: "Call Me Back",
      callbackSuccess: "Request sent! We will contact you shortly.",
      callbackError: "An error occurred. Please try again.",
      trustBadge1: "7-day cancellation",
      trustBadge2: "Pay on arrival",
      trustBadge3: "Below-market price",

      // Hero
      premiumBadge: "Cozy Family Guesthouse",
      heroTitle1: "Cozy Summer Getaway",
      heroTitle2: "for Your Entire Family",
      heroTitle3: "at Zatoka Getaway",
      heroDescription: "Family guesthouse 'Zatoka Getaway'. Cozy yard with BBQ zone, kids playground, shared kitchen, air conditioning, Wi-Fi, and free parking. Just a 10-minute walk to the beach.",
      firstLine: "Cozy yard",
      beachDistance: "10-minute walk to beach",
      security: "Privacy",
      securedArea: "Gated green territory",
      bookStay: "Book Your Stay",
      learnMore: "Explore Rooms",
      waterTemp: "Water Temp",
      guestRating: "Guest Rating",
      excellent: "Excellent",

      // Welcome Section
      exclusiveService: "Cozy Atmosphere",
      welcomeTitle: 'Welcome to "Zatoka Getaway"',
      welcomeDesc: 'Our cozy family guesthouse is located in a quiet area of Zatoka, just a 10-minute walk from the sandy beach. We offer comfortable rooms with all essential amenities (AC, Wi-Fi, private bathroom), a green yard with a BBQ area, a kids playground, and a shared kitchen. It is the perfect place for a relaxed and warm family holiday.',

      // Featured Rooms
      perfectComfort: "Care & Comfort",
      featuredRooms: "Our Cozy Rooms",
      featuredRoomsDesc: "Clean and comfortable rooms with all essential amenities for your family.",

      // Amenities
      allInclusive: "Convenience & Comfort",
      hotelAmenities: "Guesthouse Amenities",
      hotelAmenitiesDesc: "Everything needed for a pleasant family holiday without extra hassle.",

      // Amenities names & descriptions
      pool: "Air Conditioning",
      poolDesc: "Modern quiet air conditioning in every room for your comfort.",
      wifi: "Free Wi-Fi",
      wifiDesc: "High-speed Internet access throughout the entire guesthouse property.",
      restaurant: "Shared Kitchen",
      restaurantDesc: "Fully equipped kitchen with all necessary utensils and appliances.",
      privateBeach: "Sandy Beach",
      privateBeachDesc: "Sandy beach with a gentle slope into the water just a 10-minute walk away.",
      spa: "Kids Playground",
      spaDesc: "Safe playground with swings and a sandbox in the yard.",
      parking: "Parking in the Yard",
      parkingDesc: "Safe parking spaces for our guests on closed territory.",
      roomService: "BBQ Zone",
      roomServiceDesc: "Spacious shaded yard with BBQ grills, skewers, and gazebos.",
      fitness: "Green Yard",
      fitnessDesc: "Well-maintained territory with flowers and shadows under the trees.",

      // Bottom CTA
      readyForHoliday: "Want to spend your holiday with us?",
      bottomCtaDesc: "Book your room in advance to secure the best dates for your family at the best rate.",
      bookNowBtn: "Book a Room Now",

      // Season Banner
      seasonBefore: "Until the season starts",
      seasonBookEarly: "book early for the best rates!",
      seasonDuring: "Season is in full swing!",
      seasonHurry: "best dates are going fast!",

      // Why Choose Us
      whyChooseBadge: "Your Comfort",
      whyChooseTitle: "Why Choose Us",
      whyChooseDesc: "Simple and transparent booking conditions — we make you feel at home.",
      whyBeach: "10-Minute Walk to Beach",
      whyBeachDesc: "Sandy beach is just a 10-minute leisurely walk from the guesthouse — a pleasant stroll.",
      whyPayment: "Pay on Arrival",
      whyPaymentDesc: "No prepayment required. Pay at check-in — cash or card.",
      whyCancel: "Free Cancellation",
      whyCancelDesc: "Plans changed? Cancel up to 7 days before with no penalties.",
      whyFamily: "Perfect for Families",
      whyFamilyDesc: "Kids playground, quiet closed yard, shared kitchen — everything for a comfortable vacation with kids.",

      // Exit Intent Popup
      exitTitle: "Haven't found the right room?",
      exitDesc: "Leave your number — we'll find the best option and call you back in 10 minutes. Free.",
      exitCta: "Call Me Back",
      exitSuccessTitle: "Great!",
      exitSuccessDesc: "We will call you back within 10 minutes and help you find the perfect room.",
      exitPrivacy: "By clicking, you agree to the processing of personal data",

      // Guest Impressions
      reviewsBadge: "Guest Reviews",
      reviewsTitle: "Guest Impressions",
      reviewsDesc: "Our guests love us for the home comfort and warm hospitality. Here is what they say.",
      reviewsCount: "guest reviews",
      reviewsRecommend: "recommend",

      // Mobile Sticky
      stickyMobileFrom: "from",
      stickyMobileNight: "night",

      // About Page
      aboutService: "Cozy Guesthouse by the Sea",
      aboutTitle: "Creating a Home Atmosphere",
      aboutDesc: 'Discover the story of "Zatoka Getaway" guesthouse and the people who care about your comfort.',
      ourStory: "Our Story",
      storyDesc1: 'Founded in 2010, our guesthouse was born from a desire to create a cozy place for affordable family vacations in Zatoka. We are a family-run business, and we wanted to make a place where everyone feels like a welcomed friend.',
      storyDesc2: "Over the years, we have built comfortable rooms with private bathrooms, planted a beautiful green garden, set up a BBQ area and a playground, keeping the warm family welcome and care for every guest.",
      ourMission: "Our Mission",
      missionDesc: "To provide a comfortable, warm, and affordable vacation for the whole family, surrounding every guest with care and attention.",
      ourValues: "Our Values",
      valGuest: "Warm Hospitality: We welcome guests like close friends.",
      valExcel: "Cleanliness: We maintain absolute cleanliness in rooms and the yard.",
      valInteg: "Honesty: Transparent pricing with no hidden fees and no prepayment.",
      ourTeam: "Our Family",
      teamDesc: "The people who take care of your comfort and cozy stay every day.",
      roleGM: "Guesthouse Owner",
      roleConcierge: "Yard Administrator",
      roleChef: "Guesthouse Assistant",
      amenitiesServices: "Amenities & Services",
      amenitiesServicesDesc: "Everything you need for a carefree family vacation by the Black Sea.",

      // Booking Page
      bookingService: "Room Booking",
      bookingTitle: "Book Your Room",
      bookingDesc: "Select dates to find a free room for your family.",
      availableRooms: "Available Rooms",
      allRooms: "Our Rooms",
      roomsFound: "Found {{count}} free rooms matching your request.",
      findPerfectSpace: "Find the perfect room for your stay.",
      checkInOut: "Check-in / Check-out",
      selectDateRange: "Select dates of your stay",
      guests: "Guests",
      guestsPlaceholder: "Number of guests",
      checkAvailability: "Check Availability",
      roomsNotFoundToastTitle: "No Rooms Found",
      dateAlreadyBooked: "This date is already booked",
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
      },
    });
}

export default i18n;
