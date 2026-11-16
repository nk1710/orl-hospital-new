 
$(function () {
    "use strict";
    var wind = $(window);
    
    
    // ScrollIt
    $.scrollIt({
        upKey: 38, // key code to navigate to the next section
        downKey: 40, // key code to navigate to the previous section
        easing: 'swing', // the easing function for animation
        scrollTime: 600, // how long (in ms) the animation takes
        activeClass: 'active', // class given to the active nav element
        onPageChange: null, // function(pageIndex) that is called when page is changed
        topOffset: -70 // offste (in px) for fixed top navigation
    });
    
    
     
     // Navbar scrolling background
     wind.on("scroll", function () {
        var bodyScroll = wind.scrollTop(),
            navbar = $(".navbar");
            // logo = $(".navbar .logo> img");
        if (bodyScroll > 200) {
            navbar.addClass("fixed"); 
            // logo.attr('src', 'public/assets/logo.png');
        } else {
            navbar.removeClass("fixed");
            // logo.attr('src', 'public/assets/logo.png');
        }
    });
    
    
    
    // Close navbar-collapse when a  clicked
    $(".navbar-nav .dropdown-item a").on('click', function () {
        $(".navbar-collapse").removeClass("show");
    });
    
    
    // Sections background image from data background
    var pageSection = $(".bg-img, section");
    pageSection.each(function (indx) {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });

    
    // Animations
// Animations
var contentWayPoint = function () {
    var i = 0;
    $('.animate-box').waypoint(function (direction) {
        if (direction === 'down' && !$(this.element).hasClass('animated')) {
            i++;
            $(this.element).addClass('item-animate');
            setTimeout(function () {
                $('body .animate-box.item-animate').each(function (k) {
                    var el = $(this);
                    setTimeout(function () {
                        var effect = el.data('animate-effect');
                        if (effect === 'fadeIn') {
                            el.addClass('fadeIn animated');
                        } else if (effect === 'fadeInLeft') {
                            el.addClass('fadeInLeft animated');
                        } else if (effect === 'fadeInRight') {
                            el.addClass('fadeInRight animated');
                        } else {
                            el.addClass('fadeInUp animated');
                        }
                        el.removeClass('item-animate');
                    }, k * 200, 'easeInOutExpo');
                });
            }, 100);
        }
    }, { offset: '85%' });
};

// Reset animation when scrolling back to the top
$(window).on("scroll", function () {
    if ($(window).scrollTop() === 0) {
        $('.animate-box').removeClass('animated fadeIn fadeInLeft fadeInRight fadeInUp');

        // Reinitialize the animation triggers
        setTimeout(() => {
            contentWayPoint();  
        }, 500); 
    }
});

$(function () {
    contentWayPoint();
});


    
    
    // YouTubePopUp
    $("a.vid").YouTubePopUp();
    
    
    // Testimonials owlCarousel *
    $('.testimonials .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: {
				delay: 1000,
				disableOnInteraction: true,
			},
        dots: false,

        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>", "<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
    
    // Rooms 1 owlCarousel *
    $('.rooms1 .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: true,
        autoplayHoverPause: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });
    
    // Rooms 2 owlCarousel *
    $('.rooms2 .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: true,
        autoplayHoverPause: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
    
    // Rooms 3 owlCarousel *
    $('.rooms3 .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: true,
        autoplayHoverPause: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 2
            },
            1000: {
                items: 3
            }
        }
    });
    
    // Rooms Page owlCarousel *
    $('.rooms-page .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: true,
        dots: false,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    });
    
    // Pricing owlCarousel *
    $('.pricing .owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        mouseDrag: true,
        autoplay: true,
        dots: false,
        autoplayHoverPause: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    });
    
    
    
    
    
    
    // News owlCarousel *
    $('.news .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: false,
        nav: true,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                dots: true,
                nav: false
            },
            600: {
                items: 2,
                dots: true,
                nav: false
            },
            1000: {
                items: 3
            }
        }
    });
    
    // Team owlCarousel *
    $('.team .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        dots: false,
        mouseDrag: true,
        autoplay: true,
        nav: true,
        navText: ["<span class='lnr ti-angle-left' aria-label='prev button'></span>","<span class='lnr ti-angle-right' aria-label='next button'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 4
            }
        }
    });
    
    // Clients owlCarousel *
    $('.clients .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: true,
        dots: false,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                margin: 10,
                items: 3
            },
            600: {
                items: 3
            },
            1000: {
                items: 3
            }
        }
    });
    
    // Restaurant Menu owlCarousel
    $('.restaurant-menu .owl-carousel').owlCarousel({
        loop: true,
        margin: 0,
        autoplay: false,
        dots: false,
        nav: true,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 2,
                nav: false
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4
            }
        }
    });
    
    // Restaurant Menu Tabs
    $(".restaurant-menu .tabs-icon").on("click", ".item", function () {
        $(".item").removeClass("active");
        var myID = $(this).attr("id");
        $(".restaurant-menu .cont").hide();
        $("#" + myID + "-content").fadeIn();
    });
    $(".restaurant-menu .tabs-icon").on("click", ".owl-item", function () {
        $(this).addClass("actived").siblings().removeClass("actived");
    });
    
    
    
    // Accordion Box (for Faqs)
    if ($(".accordion-box").length) {
        $(".accordion-box").on("click", ".acc-btn", function () {
            var outerBox = $(this).parents(".accordion-box");
            var target = $(this).parents(".accordion");
            if ($(this).next(".acc-content").is(":visible")) {
                //return false;
                $(this).removeClass("active");
                $(this).next(".acc-content").slideUp(300);
                $(outerBox).children(".accordion").removeClass("active-block");
            } else {
                $(outerBox).find(".accordion .acc-btn").removeClass("active");
                $(this).addClass("active");
                $(outerBox).children(".accordion").removeClass("active-block");
                $(outerBox).find(".accordion").children(".acc-content").slideUp(300);
                target.addClass("active-block");
                $(this).next(".acc-content").slideDown(300);
            }
        });
    }
    
    
    // MagnificPopup Gallery
    $('.gallery').magnificPopup({
        delegate: '.popimg',
        type: 'image',
        gallery: {
            enabled: true
        }
    });
    $(".img-zoom").magnificPopup({
        type: "image",
        closeOnContentClick: !0,
        mainClass: "mfp-fade",
        gallery: {
            enabled: !0,
            navigateByImgClick: !0,
            preload: [0, 1]
        }
    })
    $('.magnific-youtube, .magnific-vimeo, .magnific-custom').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 300,
        preloader: false,
        fixedContentPos: false
    });
    

    // Smooth Scrolling
    $('a[href*="#"]')
    // Remove links that don't actually link to anything
    .not('[href="#"]').not('[href="#0"]').click(function (event) {
        // On-page links
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            // Figure out element to scroll to
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            // Does a scroll target exist?
            if (target.length) {
                // Only prevent default if animation is actually gonna happen
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000, function () {
                    // Callback after animation
                    // Must change focus!
                    var $target = $(target);
                    $target.focus();
                    if ($target.is(":focus")) { // Checking if the target was focused
                        return false;
                    } else {
                        $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                        $target.focus(); // Set focus again
                    };
                });
            }
        }
    });
    
    //  Scroll back to top
    // var progressPath = document.querySelector('.progress-wrap path');
    // var pathLength = progressPath.getTotalLength();
    // progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
    // progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
    // progressPath.style.strokeDashoffset = pathLength;
    // progressPath.getBoundingClientRect();
    // progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
    // var updateProgress = function () {
    //     var scroll = $(window).scrollTop();
    //     var height = $(document).height() - $(window).height();
    //     var progress = pathLength - (scroll * pathLength / height);
    //     progressPath.style.strokeDashoffset = progress;
    // }
    // updateProgress();
    // $(window).scroll(updateProgress);
    // var offset = 150;
    // var duration = 550;
    // jQuery(window).on('scroll', function () {
    //     if (jQuery(this).scrollTop() > offset) {
    //         jQuery('.progress-wrap').addClass('active-progress');
    //     } else {
    //         jQuery('.progress-wrap').removeClass('active-progress');
    //     }
    // });
    // jQuery('.progress-wrap').on('click', function (event) {
    //     event.preventDefault();
    //     jQuery('html, body').animate({
    //         scrollTop: 0
    //     }, duration);
    //     return false;
    // })
    
    
    // Select2
    $('.select2').select2({
        minimumResultsForSearch: Infinity,
    });
    
    
    // Datapicker
    $(".datepicker").datepicker({
        orientation: "top"
    });
     
});


// Slider  
$(document).ready(function () {
    var owl = $('.header .owl-carousel');
    
    // Slider owlCarousel - (Inner Page Slider)
    $('.slider .owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 5000,
        nav: false,
        navText: ['<i class="ti-angle-left" aria-hidden="true"></i>', '<i class="ti-angle-right" aria-hidden="true"></i>'],
        responsiveClass: true,
        responsive: {
            0: {
                dots: true
            },
            600: {
                dots: true
            },
            1000: {
                dots: true
            }
        }
    });
    
    // Slider owlCarousel (Homepage Slider)
    $('.slider-fade .owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        margin: 0,
        autoplay: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        nav: true,
        navText: ['<i class="ti-angle-left" aria-hidden="true"></i>', '<i class="ti-angle-right" aria-hidden="true"></i>'],
        responsiveClass: true,
        responsive: {
            0: {
                dots: false
            },
            600: {
                dots: false
            },
            1000: {
                dots: true
            }
        }
    });
    owl.on('changed.owl.carousel', function (event) {
        var item = event.item.index - 2; // Position of the current item
        $('span').removeClass('animated fadeInUp');
        $('h4').removeClass('animated fadeInUp');
        $('h1').removeClass('animated fadeInUp');
        $('p').removeClass('animated fadeInUp');
        $('.butn-light').removeClass('animated fadeInUp');
        $('.butn-dark').removeClass('animated fadeInUp');
        $('.owl-item').not('.cloned').eq(item).find('span').addClass('animated fadeInUp');
        $('.owl-item').not('.cloned').eq(item).find('h4').addClass('animated fadeInUp');
        $('.owl-item').not('.cloned').eq(item).find('h1').addClass('animated fadeInUp');
        $('.owl-item').not('.cloned').eq(item).find('p').addClass('animated fadeInUp');
        $('.owl-item').not('.cloned').eq(item).find('.butn-light').addClass('animated fadeInUp');
        $('.owl-item').not('.cloned').eq(item).find('.butn-dark').addClass('animated fadeInUp');
    });
});


// Preloader
$("#preloader").fadeOut(700);
	$(".preloader-bg").delay(700).fadeOut(700);
	var wind = $(window);


// Contact Form
var form = $('.contact__form'),
    message = $('.contact__msg'),
    form_data;
    // success function
    function done_func(response) {
        message.fadeIn().removeClass('alert-danger').addClass('alert-success');
        message.text(response);
        setTimeout(function () {
            message.fadeOut();
        }, 2000);
        form.find('input:not([type="submit"]), textarea').val('');
    }
    // fail function
    function fail_func(data) {
        message.fadeIn().removeClass('alert-success').addClass('alert-success');
        message.text(data.responseText);
        setTimeout(function () {
            message.fadeOut();
        }, 2000);
    }
    form.submit(function (e) {
        e.preventDefault();
        form_data = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: form.attr('action'),
            data: form_data
        }).done(done_func).fail(fail_func);
    });


// Slider Grid Background
  (function () {
    var imageElements = document.querySelectorAll('.grid-img');
    var itemElements = document.querySelectorAll('.grid-con');
    if (itemElements.length) {
      itemElements.forEach(function (item, index) {
        item.addEventListener('mouseenter', function () {
          imageElements.forEach(function (image) {
            image.classList.remove('grid-img-active');
          });
          itemElements.forEach(function (card) {
            card.classList.remove('grid-con-active');
          });
          item.classList.add('grid-con-active');
          imageElements[index].classList.add('grid-img-active');
        });
      });
    }
  })();

// Slider Grid Background owlCarousel *
    $('.slider-grid-bg .owl-carousel').owlCarousel({
        loop: true,
        margin: 30,
        mouseDrag: true,
        autoplay: false,
        dots: true,
        nav: false,
        navText: ["<span class='lnr ti-angle-left'></span>","<span class='lnr ti-angle-right'></span>"],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                dots: true,
                nav: false
            },
            600: {
                items: 2,
                dots: true,
                nav: false
            },
            1000: {
                items: 3
            }
        }
    });


    var searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            let searchArea = document.querySelector('.search-area');
            let icon = this.querySelector('i');

            if (searchArea) {
                if (searchArea.style.display === 'none' || searchArea.style.display === '') {
                    searchArea.style.display = 'flex';
                    if (icon) {
                        icon.classList.remove('ti-search');
                        icon.classList.add('ti-close');
                    }
                } else {
                    searchArea.style.display = 'none';
                    if (icon) {
                        icon.classList.remove('ti-close');
                        icon.classList.add('ti-search');
                    }
                }
            }
        });
    }

    // ==========================================================================
    // ORL International Hospital - Multilingual Translation Engine
    // Single Location: In Navbar right next to search button
    // Languages: English, Myanmar, Hindi, Nepali, Bengali, Arabic, Russian, Uzbek, French, Swahili
    // ==========================================================================
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

        function setLangCookie(lang) {
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

        window.googleTranslateElementInit = function () {
            var savedLang = getCurrentLang();
            if (savedLang && savedLang !== 'en') {
                setLangCookie(savedLang);
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

        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            window.googleTranslateElementInit();
        }

        window.changeHospitalLanguage = function (langCode) {
            langCode = langCode.toLowerCase();

            if (langCode === 'en') {
                clearAllGoogleTransCookies();
                localStorage.removeItem('orl_language');
                window.location.reload();
                return;
            }

            setLangCookie(langCode);
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

            ensureGoogleTranslate();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectSingleLanguageSwitcher);
        } else {
            injectSingleLanguageSwitcher();
        }
    })();
