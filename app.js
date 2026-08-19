document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  // Multilanguage setup
  let translations = {};
  let currentLang = localStorage.getItem('lang') || getBrowserLanguage();

  // Change navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile navigation menu
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      } else {
        mobileNav.classList.add('open');
        menuToggle.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close mobile navigation when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav && menuToggle) {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Load translations from translations.js global object
  if (window.translations) {
    translations = window.translations;
    setLanguage(currentLang);
  } else {
    console.error('Translations object not found');
  }

  // Handle language selectors click
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  // Contact form submission translation check
  const contactForm = document.getElementById('contact-form-el');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = translations[currentLang]?.contact?.alertSuccess || '¡Gracias! Nos pondremos en contacto contigo a la brevedad.';
      alert(message);
      contactForm.reset();
    });
  }

  function getBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('en') ? 'en' : 'es';
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    // Highlight active language button
    document.querySelectorAll('.btn-lang').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Translate DOM elements
    if (translations[lang]) {
      // Text translations
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translatedText = getNestedValue(translations[lang], key);
        if (translatedText) {
          el.textContent = translatedText;
        }
      });

      // Placeholder translations
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translatedPlaceholder = getNestedValue(translations[lang], key);
        if (translatedPlaceholder) {
          el.setAttribute('placeholder', translatedPlaceholder);
        }
      });

      // Dynamic SEO tags updates
      updateSEOMetadata(translations[lang]);
    }
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  function updateSEOMetadata(langData) {
    const metaDesc = document.getElementById('meta-description');
    const ogDesc = document.getElementById('og-description');
    const twitterDesc = document.getElementById('twitter-description');
    const docTitle = document.getElementById('doc-title');
    const ogTitle = document.getElementById('og-title');
    const twitterTitle = document.getElementById('twitter-title');

    // Title translations
    const titleVal = `${langData.hero.tag} | Bless Pilates`;
    if (docTitle) docTitle.innerText = titleVal;
    if (ogTitle) ogTitle.setAttribute('content', titleVal);
    if (twitterTitle) twitterTitle.setAttribute('content', titleVal);

    // Description translations
    const descVal = langData.hero.desc;
    if (metaDesc) metaDesc.setAttribute('content', descVal);
    if (ogDesc) ogDesc.setAttribute('content', descVal);
    if (twitterDesc) twitterDesc.setAttribute('content', descVal);
  }
});
