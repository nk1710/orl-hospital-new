/**
 * ORL International Hospital - Multilingual Translation Engine
 * 
 * Languages supported:
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

  // Helper to get language info
  function getLangInfo(code) {
    for (var i = 0; i < LANGUAGES.length; i++) {
      if (LANGUAGES[i].code === code) return LANGUAGES[i];
    }
    return LANGUAGES[0];
  }

  // Get current language from cookie or localStorage
  function getCurrentLang() {
    var match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-zA-Z\-]+)/);
    if (match && match[1]) {
      return match[1].toLowerCase();
    }
    return (localStorage.getItem('orl_language') || 'en').toLowerCase();
  }

  // Set Google Translate cookie
  function setLangCookie(lang) {
    var cookieVal = '/en/' + lang;
    var host = window.location.hostname;

    // Current path
    document.cookie = 'googtrans=' + cookieVal + '; path=/;';

    // Domain cookie (if not localhost or raw IP)
    var parts = host.split('.');
    if (parts.length >= 2 && !host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      var rootDomain = parts.slice(-2).join('.');
      document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=.' + rootDomain + ';';
    }

    if (lang === 'en') {
      // Clear cookie to ensure native English
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      if (parts.length >= 2 && !host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        var rootDomain = parts.slice(-2).join('.');
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + rootDomain + ';';
      }
    }
  }

  // Google Translate initialization function
  window.googleTranslateElementInit = function () {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,my,hi,ne,bn,ar,ru,uz,fr,sw',
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }
  };

  // Ensure Google Translate Script is loaded
  function ensureGoogleTranslate() {
    // Hidden container
    if (!document.getElementById('google_translate_element')) {
      var div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    if (!document.querySelector('script[src*="translate_a/element.js"]')) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.head.appendChild(script);
    }
  }

  // Change language logic
  window.changeHospitalLanguage = function (langCode) {
    langCode = langCode.toLowerCase();
    setLangCookie(langCode);
    localStorage.setItem('orl_language', langCode);

    updateAllSwitcherUI(langCode);

    // Trigger Google Translate combo
    var combo = document.querySelector('select.goog-te-combo');
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
    } else {
      // Poll briefly for combo, otherwise reload
      var attempts = 0;
      var interval = setInterval(function () {
        attempts++;
        var c = document.querySelector('select.goog-te-combo');
        if (c) {
          clearInterval(interval);
          c.value = langCode;
          c.dispatchEvent(new Event('change'));
        } else if (attempts >= 6) {
          clearInterval(interval);
          window.location.reload();
        }
      }, 150);
    }
  };

  // Build the dropdown HTML for a switcher
  function buildDropdownMenuHTML(currentLang) {
    var html = '<ul class="orl-lang-menu">';
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

  // Update all switcher UIs to reflect selected language
  function updateAllSwitcherUI(langCode) {
    var info = getLangInfo(langCode);

    // Update labels
    document.querySelectorAll('.orl-lang-current-label').forEach(function (el) {
      el.textContent = info.flag + ' ' + info.native;
    });

    document.querySelectorAll('.orl-lang-current-code').forEach(function (el) {
      el.textContent = info.flag + ' ' + info.code.toUpperCase();
    });

    // Update active classes
    document.querySelectorAll('.orl-lang-item').forEach(function (item) {
      if (item.getAttribute('data-lang') === langCode) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update footer select if present
    var footerSelect = document.getElementById('language-selector');
    if (footerSelect && footerSelect.value !== langCode) {
      footerSelect.value = langCode;
    }
  }

  // Attach event handlers to switcher items
  function attachSwitcherEvents(container) {
    var toggleBtn = container.querySelector('.orl-lang-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = container.classList.contains('open');
      // Close all other open menus
      document.querySelectorAll('.orl-lang-switcher').forEach(function (s) {
        s.classList.remove('open');
      });
      if (!isOpen) {
        container.classList.add('open');
      }
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

  // Close menus on outside click
  document.addEventListener('click', function () {
    document.querySelectorAll('.orl-lang-switcher').forEach(function (s) {
      s.classList.remove('open');
    });
  });

  // Inject UI onto the page
  function injectLanguageSwitchers() {
    var currentLang = getCurrentLang();
    var currentInfo = getLangInfo(currentLang);

    // 1. Top Header Switcher (Desktop)
    var topHeaderRight = document.querySelector('.top-header .me-lg-5');
    if (topHeaderRight && !topHeaderRight.querySelector('.orl-lang-desktop')) {
      var topDiv = document.createElement('div');
      topDiv.className = 'orl-lang-switcher orl-lang-desktop';
      topDiv.innerHTML =
        '<button class="orl-lang-toggle" type="button" aria-label="Select Language">' +
        '  <span class="globe-icon">🌐</span>' +
        '  <span class="orl-lang-current-label">' + currentInfo.flag + ' ' + currentInfo.native + '</span>' +
        '  <i class="ti-angle-down arrow-icon"></i>' +
        '</button>' +
        buildDropdownMenuHTML(currentLang);

      topHeaderRight.prepend(topDiv);
      attachSwitcherEvents(topDiv);
    }

    // 2. Navbar Switcher (Accessible on both Desktop and Mobile view)
    var searchBtn = document.getElementById('search-btn');
    if (searchBtn && !document.querySelector('.orl-lang-nav')) {
      var navDiv = document.createElement('div');
      navDiv.className = 'orl-lang-switcher orl-lang-nav';
      navDiv.innerHTML =
        '<button class="orl-lang-toggle" type="button" aria-label="Select Language" title="Change Language">' +
        '  <span class="globe-icon">🌐</span>' +
        '  <span class="orl-lang-current-code">' + currentInfo.flag + ' ' + currentInfo.code.toUpperCase() + '</span>' +
        '  <i class="ti-angle-down arrow-icon"></i>' +
        '</button>' +
        buildDropdownMenuHTML(currentLang);

      searchBtn.parentNode.insertBefore(navDiv, searchBtn);
      attachSwitcherEvents(navDiv);
    }

    // 3. Floating Quick Switcher (Bottom-Left on all devices)
    if (!document.querySelector('.orl-lang-floating')) {
      var floatDiv = document.createElement('div');
      floatDiv.className = 'orl-lang-switcher orl-lang-floating';
      floatDiv.innerHTML =
        '<button class="orl-lang-toggle" type="button" aria-label="Select Language" title="Translate Website">' +
        '  <span class="globe-icon">🌐</span>' +
        '  <span class="orl-lang-current-label">' + currentInfo.flag + ' ' + currentInfo.native + '</span>' +
        '  <i class="ti-angle-up arrow-icon"></i>' +
        '</button>' +
        buildDropdownMenuHTML(currentLang);

      document.body.appendChild(floatDiv);
      attachSwitcherEvents(floatDiv);
    }

    // 4. Enhance Footer Selector if present
    var footerSelect = document.getElementById('language-selector');
    if (footerSelect) {
      footerSelect.innerHTML = '';
      for (var i = 0; i < LANGUAGES.length; i++) {
        var opt = document.createElement('option');
        opt.value = LANGUAGES[i].code;
        opt.textContent = LANGUAGES[i].name + ' (' + LANGUAGES[i].native + ')';
        if (LANGUAGES[i].code === currentLang) {
          opt.selected = true;
        }
        footerSelect.appendChild(opt);
      }
      footerSelect.addEventListener('change', function () {
        window.changeHospitalLanguage(this.value);
      });
    }

    // Initialize Google Translate
    ensureGoogleTranslate();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLanguageSwitchers);
  } else {
    injectLanguageSwitchers();
  }

})();
