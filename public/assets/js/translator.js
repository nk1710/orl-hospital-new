/**
 * ORL International Hospital - Multilingual Translation Engine
 * 
 * Supported Languages:
 * 1. English (Original)
 * 2. Myanmar / Burmese (မြန်မာစာ)
 * 3. Hindi (हिन्दी)
 * 4. Nepali (नेपाली)
 * 5. Bengali (বাংলা)
 * 6. Arabic (العربية)
 * 7. Russian (Русский)
 * 8. Uzbek (Oʻzbekcha)
 * 9. French (Français)
 * 10. Swahili (Kiswahili)
 */

(function () {
  'use strict';

  var LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'my', name: 'Myanmar (Burmese)', native: 'မြန်မာစာ', flag: '🇲🇲' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
    { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺' },
    { code: 'uz', name: 'Uzbek', native: "O'zbek", flag: '🇺🇿' },
    { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' }
  ];

  function getLangInfo(code) {
    for (var i = 0; i < LANGUAGES.length; i++) {
      if (LANGUAGES[i].code === code) return LANGUAGES[i];
    }
    return LANGUAGES[0];
  }

  function getCurrentLang() {
    var match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-zA-Z\-]+)/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    return (localStorage.getItem('orl_language') || 'en').toLowerCase();
  }

  function clearAllGoogleTransCookies() {
    var host = window.location.hostname;
    var baseHost = host.replace(/^www\./, '');
    var domains = [
      host,
      '.' + host,
      baseHost,
      '.' + baseHost
    ];
    var paths = ['/', window.location.pathname];
    for (var d = 0; d < domains.length; d++) {
      for (var p = 0; p < paths.length; p++) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=' + paths[p] + '; domain=' + domains[d] + ';';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=' + paths[p] + ';';
      }
    }
  }

  function setGoogleTransCookie(lang) {
    clearAllGoogleTransCookies();
    var val = '/en/' + lang;
    var host = window.location.hostname;
    var baseHost = host.replace(/^www\./, '');

    document.cookie = 'googtrans=' + val + '; path=/;';
    if (baseHost && baseHost.indexOf('.') !== -1 && !baseHost.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      document.cookie = 'googtrans=' + val + '; path=/; domain=.' + baseHost + ';';
      document.cookie = 'googtrans=' + val + '; path=/; domain=' + baseHost + ';';
    }
  }

  // Ensure googleTranslateElementInit is defined
  window.googleTranslateElementInit = function () {
    var savedLang = getCurrentLang();
    if (savedLang && savedLang !== 'en') {
      setGoogleTransCookie(savedLang);
    }

    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }

    if (savedLang && savedLang !== 'en') {
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        var combo = document.querySelector('select.goog-te-combo');
        if (combo) {
          clearInterval(timer);
          if (combo.value !== savedLang) {
            combo.value = savedLang;
            combo.dispatchEvent(new Event('change', { bubbles: true }));
            if (typeof jQuery !== 'undefined') {
              $(combo).val(savedLang).trigger('change');
            }
          }
        }
        if (tries > 50) clearInterval(timer);
      }, 100);
    }
  };

  // If google.translate already exists in memory, initialize right away
  if (window.google && window.google.translate && window.google.translate.TranslateElement) {
    window.googleTranslateElementInit();
  }

  // Change Language Handler
  window.changeHospitalLanguage = function (langCode) {
    langCode = langCode.toLowerCase();

    if (langCode === 'en') {
      clearAllGoogleTransCookies();
      localStorage.removeItem('orl_language');
      window.location.reload();
      return;
    }

    setGoogleTransCookie(langCode);
    localStorage.setItem('orl_language', langCode);

    updateNavbarUI(langCode);

    var combo = document.querySelector('select.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      if (typeof jQuery !== 'undefined') {
        $(combo).val(langCode).trigger('change');
      }
    }

    // A fast reload re-executes Google Translate on the entire page DOM
    setTimeout(function () {
      window.location.reload();
    }, 200);
  };

  function buildDropdownMenuHTML(currentLang) {
    var html = '<ul class="orl-lang-nav-menu">';
    for (var i = 0; i < LANGUAGES.length; i++) {
      var l = LANGUAGES[i];
      var activeClass = (l.code === currentLang) ? ' active' : '';
      html += '<li class="orl-lang-item' + activeClass + '" data-lang="' + l.code + '">';
      html += '  <span class="flag">' + l.flag + '</span>';
      html += '  <span class="lang-en">' + l.name + '</span>';
      html += '  <span class="lang-native">' + l.native + '</span>';
      html += '</li>';
    }
    html += '</ul>';
    return html;
  }

  function updateNavbarUI(langCode) {
    var info = getLangInfo(langCode);
    var label = document.querySelector('.orl-lang-current-label');
    if (label) {
      label.textContent = info.flag + ' ' + info.native;
    }

    document.querySelectorAll('.orl-lang-item').forEach(function (item) {
      if (item.getAttribute('data-lang') === langCode) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function attachSwitcherEvents(container) {
    var toggleBtn = container.querySelector('.orl-lang-nav-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      container.classList.toggle('open');
    });

    container.querySelectorAll('.orl-lang-item').forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        var selectedLang = this.getAttribute('data-lang');
        container.classList.remove('open');
        window.changeHospitalLanguage(selectedLang);
      });
    });
  }

  document.addEventListener('click', function () {
    var switcher = document.querySelector('.orl-lang-navbar');
    if (switcher) {
      switcher.classList.remove('open');
    }
  });

  // Inject ONLY into the Navbar!
  function injectSingleLanguageSwitcher() {
    // Remove any old/duplicate switchers
    document.querySelectorAll('.orl-lang-floating, .orl-lang-desktop').forEach(function (el) {
      el.remove();
    });

    var currentLang = getCurrentLang();
    var currentInfo = getLangInfo(currentLang);

    var searchBtn = document.getElementById('search-btn');
    if (searchBtn && !document.querySelector('.orl-lang-navbar')) {
      var navDiv = document.createElement('div');
      navDiv.className = 'orl-lang-navbar';
      navDiv.innerHTML =
        '<button class="orl-lang-nav-btn" type="button" aria-label="Select Language" title="Translate Website">' +
        '  <span class="globe-icon">🌐</span>' +
        '  <span class="orl-lang-current-label">' + currentInfo.flag + ' ' + currentInfo.native + '</span>' +
        '  <i class="ti-angle-down arrow-icon"></i>' +
        '</button>' +
        buildDropdownMenuHTML(currentLang);

      searchBtn.parentNode.insertBefore(navDiv, searchBtn);
      attachSwitcherEvents(navDiv);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSingleLanguageSwitcher);
  } else {
    injectSingleLanguageSwitcher();
  }

})();
