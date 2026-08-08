import { prisma } from '../src/lib/prisma';

async function main() {
  const posts = [
    {
      slug: 'zatoka-blockposts-curfew-travel-rules-2026',
      date: '8 августа 2026',
      imageUrl: '/images/blog/zatoka-travel-road.png',
      readTime: 5,
      categoryRu: 'Правила и Советы',
      categoryUk: 'Правила та Поради',
      categoryEn: 'Rules & Tips',
      titleRu: 'Как проехать блокпосты и комендантский час по дороге в Затоку 2026: Полный чеклист документов',
      titleUk: 'Як пройти блокпости та комендантську годину по дорозі до Затоки 2026: Повний чекліст документів',
      titleEn: 'Checkpoints and Curfew Rules on the Way to Zatoka 2026: Full Document Checklist',
      excerptRu: 'Подробный гайд по проезду блокпостов в Одесской области 2026: какие документы иметь при себе, правила комендантского часа и безопасные автомаршруты.',
      excerptUk: 'Детальний гайд із проїзду блокпостів в Одеській області 2026: які документи мати при собі, правила комендантської години та безпечні автомаршрути.',
      excerptEn: 'Detailed guide to passing checkpoints in Odesa region 2026: required documents, curfew rules, and safe driving routes.',
      contentRu: [
        'Поездка на море в Затоку в 2026 году требует минимальной предварительной подготовки. Чтобы ваша дорога от Одессы или Днестра прошла без задержек и нервов, мы собрали все актуальные правила проезда блокпостов и комендантского часа.',
        '📌 Главный чеклист документов: Каждый взрослый пассажир авто должен иметь при себе оригинал паспорта (ID-карту или паспорт гражданина Украины, либо документ в приложении Дія). Для водителей обязательно наличие техпаспорта, водительского удостоверения и действующей автогражданки.',
        '🚘 Правила прохождения блокпостов: Снижайте скорость до 5-10 км/ч при приближении к контрольному пункту. Ночью выключайте дальний свет фар и включайте аварийный сигнал или ближний свет. Заблаговременно опустите боковое стекло водителя. Не используйте видеорегистраторы и мобильные телефоны для видеосъемки — фото и видеосъемка на блокпостах строго запрещена!',
        '⏰ Комендантский час: В Одесской области комендантский час действует с 00:00 до 05:00. Планируйте свой выезд так, чтобы прибыть в Затоку минимум за 1-1.5 часа до полуночи. Если вы задерживаетесь в пути, свяжитесь с администрацией нашего отеля Zatoka Resort по телефону +380 66 921 2275 — мы поможем скоординировать ваш въезд на территорию.',
        '💡 Состояние дорог и навигация: Дорога из Одессы через Овидиополь и Каролино-Бугаз находится в хорошем состоянии. Навигаторы Google Maps и Waze актуально отображают дорожную обстановку. Желаем вам спокойной и безопасной дороги!'
      ],
      contentUk: [
        'Поїздка на море до Затоки у 2026 році вимагає мінімальної попередньої підготовки. Щоб ваша дорога від Одеси чи Дністра пройшла без затримок та нервів, ми зібрали всі актуальні правила проїзду блокпостів та комендантської години.',
        '📌 Головний чекліст документів: Кожен дорослий пасажир авто повинен мати при собі оригінал паспорта (ID-картку або паспорт громадянина України, чи документ у додатку Дія). Для водіїв обов’язкова наявність техпаспорта, посвідчення водія та діючої автоцивілки.',
        '🚘 Правила проходження блокпостів: Знижуйте швидкість до 5-10 км/год при наближенні до контрольного пункту. Вночі вимикайте дальнє світло фар та вмикайте аварійний сигнал або ближнє світло. Заздалегідь опустіть бічне скло водія. Не використовуйте відеореєстратори та мобільні телефони для відеозйомки — фото та відеозйомка на блокпостах суворо заборонена!',
        '⏰ Комендантська година: В Одеській області комендантська година діє з 00:00 до 05:00. Плануйте свій виїзд так, щоб прибути до Затоки щонайменше за 1-1.5 години до півночі. Якщо ви затримуєтеся в дорозі, зв’яжіться з адміністрацією нашого готелю Zatoka Resort за телефоном +380 66 921 2275 — ми допоможемо скоординувати ваш в’їзд на територію.',
        '💡 Стан доріг та навігація: Дорога з Одеси через Овідіополь та Кароліно-Бугаз перебуває у гарному стані. Навігатори Google Maps та Waze актуально відображають дорожню обстановку. Бажаємо вам спокійної та безпечної дороги!'
      ],
      contentEn: [
        'A trip to the sea in Zatoka in 2026 requires minimal preparation. To make your journey smooth and hassle-free, we have gathered all current rules for passing checkpoints and respecting curfew hours.',
        '📌 Key Document Checklist: Every adult passenger must carry an original ID (ID card or Ukrainian passport, or digital document in the Diia app). Drivers must have vehicle registration, driver’s license, and valid insurance.',
        '🚘 Checkpoint Rules: Slow down to 5-10 km/h as you approach any checkpoint. At night, dim your high beams and turn on hazard lights or low beams. Roll down the driver’s window in advance. Do NOT use dashcams or mobile phones for filming — photography and video recording at checkpoints are strictly prohibited!',
        '⏰ Curfew Hours: In Odesa region, curfew is in effect from 00:00 to 05:00. Plan your trip to arrive in Zatoka at least 1-1.5 hours before midnight. If you run late, contact Zatoka Resort reception at +380 66 921 2275 — we will assist your late arrival.',
        '💡 Road Conditions & Navigation: The road from Odesa via Ovidiopol and Karolino-Buhaz is in good condition. Google Maps and Waze provide live traffic updates. Wishing you a safe and pleasant journey!'
      ],
      likes: 42,
      views: 310
    },
    {
      slug: 'zatoka-sea-water-quality-black-sea-open-beaches-2026',
      date: '8 августа 2026',
      imageUrl: '/images/blog/zatoka-clean-beach.png',
      readTime: 4,
      categoryRu: 'Пляжи и Отдых',
      categoryUk: 'Пляжі та Відпочинок',
      categoryEn: 'Beaches & Leisure',
      titleRu: 'Море и пляжи Затоки 2026: Открыты ли пляжные зоны, качество воды и безопасность купания',
      titleUk: 'Море та пляжі Затоки 2026: Чи відкриті пляжні зони, якість води та безпека купання',
      titleEn: 'Zatoka Sea & Beaches 2026: Open Beach Zones, Water Quality & Swimming Safety',
      excerptRu: 'Реальный обзор пляжного сезона 2026 в Затоке: состояние морской воды, официально разрешенные пляжные зоны, правила безопасности и температура моря.',
      excerptUk: 'Реальний огляд пляжного сезону 2026 у Затоці: стан морської води, офіційно дозволені пляжні зони, правила безпеки та температура моря.',
      excerptEn: 'Real review of the 2026 beach season in Zatoka: sea water status, officially permitted beach areas, safety guidelines, and sea temperature.',
      contentRu: [
        'Летний сезон 2026 в Затоке привлекает тысячи отдыхающих, соскучившихся по морскому бризу и теплому солнцу. В этой статье мы собрали честную и актуальную информацию о чистых пляжных зонах и правилах купания.',
        '🌊 Качество морской воды: Лабораторные проверки Одесского областного центра контроля болезней подтверждают, что показатели морской воды в районе Затоки и Каролино-Бугаза соответствуют всем санитарно-микробиологическим нормам. Соленость и чистота моря находятся на отличных летних отметках (+22°C - +24°C).',
        '⛱️ Разрешенные зоны для отдыха: Для безопасного отдыха открыты специально оборудованные прибрежные зоны и территории прибрежных комплексов. Территория отеля Zatoka Resort находится в 5 минутах ходьбы от чистой пляжной зоны с шезлонгами и зонтами.',
        '🚨 Правила безопасности на воде: Никогда не заплывайте за оградительные буйки и следите за предупреждающими флагами на берегу. В случае объявления воздушной тревоги рекомендуется покинуть прибрежную полосу и перейти в оборудованное укрытие отеля.',
        '☀️ Забронируйте комфортный номер в Zatoka Resort на первой линии и наслаждайтесь чистым Черным морем со всеми удобствами для семьи!'
      ],
      contentUk: [
        'Літній сезон 2026 у Затоці приваблює тисячі відпочивальників, які скучили за морським бризом та теплим сонцем. У цій статті ми зібрали чесну та актуальну інформацію про чисті пляжні зони та правила купання.',
        '🌊 Якість морської води: Лабораторні перевірки Одеського обласного центру контролю хвороб підтверджують, що показники морської води в районі Затоки та Кароліно-Бугаза відповідають усім санітарно-мікробіологічним нормам. Солоність та чистота моря перебувають на чудових літніх позначках (+22°C - +24°C).',
        '⛱️ Дозволені зони для відпочинку: Для безпечного відпочинку відкриті спеціально обладнані прибережні зони та території прибережних комплексів. Територія готелю Zatoka Resort розташована за 5 хвилин ходьби від чистої пляжної зони з шезлонгами та парасольками.',
        '🚨 Правила безпеки на воді: Ніколи не запливайте за огороджувальні буйки та стежте за попереджувальними прапорами на березі. У разі оголошення повітряної тривоги рекомендується залишити прибережну смугу та перейти в обладнане укриття готелю.',
        '☀️ Забронюйте комфортний номер у Zatoka Resort на першій лінії та насолоджуйтеся чистим Чорним морем з усіма зручностями для родини!'
      ],
      contentEn: [
        'The 2026 summer season in Zatoka attracts thousands of vacationers seeking fresh sea breeze and warm sun. In this article, we provide transparent and up-to-date info regarding clean beach zones and swimming safety.',
        '🌊 Sea Water Quality: Official water sample tests in the Zatoka and Karolino-Buhaz areas confirm that seawater parameters meet all sanitary and microbiological standards. The sea is clean and warm (+22°C to +24°C).',
        '⛱️ Permitted Leisure Areas: Designated and equipped coastal zones and resort beach grounds are open for visitors. Zatoka Resort is located just 5 minutes away from clean beach grounds with sun loungers and umbrellas.',
        '🚨 Water Safety Guidelines: Never swim beyond safety buoys and pay attention to warning flags. In case of an air raid alarm, guests are advised to step away from the shore and proceed to the resort shelter.',
        '☀️ Book your comfortable stay at Zatoka Resort and enjoy the Black Sea with all essential family amenities!'
      ],
      likes: 38,
      views: 285
    }
  ];

  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      await prisma.blogPost.create({ data: post });
      console.log(`Created post: ${post.slug}`);
    } else {
      console.log(`Post already exists: ${post.slug}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
