const supportedLangs = ['zh', 'en', 'de'];
const params = new URLSearchParams(window.location.search);
const requestedLang = params.get('lang');
const storedLang = localStorage.getItem('site-lang');
const browserLang = navigator.language?.toLowerCase().startsWith('de') ? 'de' : navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
let currentLang = supportedLangs.includes(requestedLang) ? requestedLang : supportedLangs.includes(storedLang) ? storedLang : browserLang;
localStorage.setItem('site-lang', currentLang);

function t(key) {
  const row = window.SITE_CONTENT?.[key];
  if (!row) return key;
  return row[currentLang] || row.en || row.zh || key;
}

function renderText() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang === 'de' ? 'de' : 'en';
  document.body.dataset.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-alt]').forEach((node) => {
    node.setAttribute('alt', t(node.dataset.i18nAlt));
  });
  const titleKey = document.body.dataset.titleKey || 'site_title';
  document.title = t(titleKey);
  document.querySelectorAll('.lang-btn').forEach((button) => {
    const active = button.dataset.lang === currentLang;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function setLang(lang) {
  if (!supportedLangs.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('site-lang', lang);
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
  renderText();
}

const page = document.body.dataset.page;
document.querySelectorAll('.site-nav a[data-link]').forEach((link) => {
  if (link.dataset.link === page) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

document.querySelectorAll('.lang-btn').forEach((button) => {
  button.addEventListener('click', () => setLang(button.dataset.lang));
});

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

renderText();

