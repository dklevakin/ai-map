import type { LanguageCode } from '../types/catalog';

export const COPY = {
  heroTitle: {
    ua: 'Ваш компас у світі ШІ сервісів',
    en: 'Your compass through the AI service landscape',
  },
  heroSubtitle: {
    ua: 'Відкривайте перевірені платформи для бізнесу, творчості й автоматизації.',
    en: 'Discover trusted platforms for business, creativity, and automation.',
  },
  heroDescription: {
    ua: 'Перемикайте мову, обирайте категорію та відкривайте картки сервісів із описом, посиланнями й корисними матеріалами.',
    en: 'Switch languages, explore categories, and open service cards to review descriptions, links, and helpful resources.',
  },
  languageToggleLabel: {
    ua: 'Перемикач мови',
    en: 'Language switcher',
  },
  languageToggleOptionUa: {
    ua: 'Українська мова',
    en: 'Ukrainian language',
  },
  languageToggleOptionEn: {
    ua: 'Англійська мова',
    en: 'English language',
  },
  heroCtaLabel: {
    ua: 'Перейти до каталогу',
    en: 'Explore the catalog',
  },
  heroCtaTitle: {
    ua: 'Перейти до розділу з мапою та списком сервісів',
    en: 'Jump to the map and list of services',
  },
  quickNavLabel: {
    ua: 'Швидка навігація',
    en: 'Quick navigation',
  },
  quickNavCatalog: {
    ua: 'До каталогу сервісів',
    en: 'To the service catalog',
  },
  quickNavResources: {
    ua: 'До блоку ресурсів',
    en: 'To the resource panel',
  },
  quickNavFooter: {
    ua: 'До підвалу сайту',
    en: 'To the site footer',
  },
  banner: {
    ua: 'Бібліотека перевірених AI сервісів для маркетингу, автоматизації та аналітики.',
    en: 'Curated AI tools for marketing, automation, and analytics teams.',
  },
  mapHeading: {
    ua: 'Мапа категорій AI‑сервісів',
    en: 'Map of AI service categories',
  },
  listHeading: {
    ua: 'Альтернативний перелік сервісів',
    en: 'Alternative service list',
  },
  searchPlaceholder: {
    ua: 'Пошук сервісів…',
    en: 'Search services…',
  },
  searchAria: {
    ua: 'Пошук сервісів на мапі',
    en: 'Search services on the map',
  },
  infoNote: {
    ua: 'Клікніть категорію, щоб побачити сервіси. Натисніть на вузол — відкриється картка з описом і добіркою посилань. Наведіть, щоб підсвітити.',
    en: 'Click a category to reveal services. Select any node to open a detail card with the description and curated links. Hover to highlight.',
  },
  accordionNote: {
    ua: 'На вузьких екранах доступний списковий режим із акордеонами — оберіть сервіс, щоб побачити деталі.',
    en: 'On narrow screens you can switch to the accordion list view — pick a service to reveal its details.',
  },
  footerRights: {
    ua: 'Усі права захищені · 2024',
    en: 'All rights reserved · 2024',
  },
  footerTagline: {
    ua: 'Створено, щоб допомогти досліджувати й порівнювати AI-рішення впевнено.',
    en: 'Crafted to help you explore and compare AI solutions with confidence.',
  },
  themeDark: {
    ua: 'Темна',
    en: 'Dark',
  },
  themeLight: {
    ua: 'Світла',
    en: 'Light',
  },
  themeToggleLabel: {
    ua: 'Перемикач теми',
    en: 'Theme switcher',
  },
  themeToggleDark: {
    ua: 'Темна тема',
    en: 'Dark theme',
  },
  themeToggleLight: {
    ua: 'Світла тема',
    en: 'Light theme',
  },
  viewMap: {
    ua: 'Мапа',
    en: 'Map',
  },
  viewList: {
    ua: 'Список',
    en: 'List',
  },
  viewModeMapDescription: {
    ua: 'Показати мапу зв’язків сервісів',
    en: 'Show the relationship map',
  },
  viewModeListDescription: {
    ua: 'Перейти до спискового вигляду',
    en: 'Switch to the list view',
  },
  loading: {
    ua: 'Завантаження…',
    en: 'Loading…',
  },
  loadError: {
    ua: 'Не вдалося завантажити дані',
    en: 'Failed to load data',
  },
  noResults: {
    ua: 'Немає результатів за запитом',
    en: 'No results for this query',
  },
  detailsRegion: {
    ua: 'Картка вибраного сервісу',
    en: 'Selected service details',
  },
  detailsEmpty: {
    ua: 'Оберіть сервіс на мапі або в списку, щоб побачити опис і корисні матеріали.',
    en: 'Pick a service on the map or list to see its description and helpful resources.',
  },
  detailsPrimary: {
    ua: 'Відкрити сайт',
    en: 'Open website',
  },
  detailsPrimaryTitle: {
    ua: 'Відкрити сайт сервісу в новій вкладці',
    en: 'Open the service website in a new tab',
  },
  detailsTagsLabel: {
    ua: 'Теги',
    en: 'Tags',
  },
  detailsLinksLabel: {
    ua: 'Корисні посилання',
    en: 'Helpful links',
  },
  detailsClose: {
    ua: 'Закрити картку',
    en: 'Close card',
  },
  heroBadge: {
    ua: 'AI Compass',
    en: 'AI Compass',
  },
  viewModeLabel: {
    ua: 'Режим відображення',
    en: 'View mode',
  },
};

export function t<T extends keyof typeof COPY>(key: T, lang: LanguageCode): (typeof COPY)[T][LanguageCode] {
  return COPY[key][lang];
}
