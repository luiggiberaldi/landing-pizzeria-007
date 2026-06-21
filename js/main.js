/* =====================================================
   PIZZERÍA 007 — Script principal
   Mejoras: dark mode, carrito, scroll-to-top, active nav,
   mobile menu overlay, validación de formulario, localStorage,
   carrusel con teclado, micro-interacciones
   ===================================================== */
(function () {
  'use strict';

  // ---------- Utilidades ----------
  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function safeGet(id) { return document.getElementById(id); }

  function on(el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); }

  function toast(message) {
    var container = $('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<svg class="ico ico-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>' + message + '</span>';
    container.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 350);
    }, 2400);
  }

  // ---------- Año dinámico ----------
  var yearEl = safeGet('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Skip link focus ----------
  var skip = $('.skip-link');
  if (skip) {
    on(skip, 'click', function (e) {
      var target = $('#hero') || $('main') || document.body;
      if (target) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: false });
      }
    });
  }

  // ============================================================
  // 1. DARK MODE (con persistencia + preferencia del SO)
  // ============================================================
  var themeToggle = $('#themeToggle');
  var STORAGE_KEY_THEME = 'pizzeria007_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#141414' : '#C8102E');
  }

  (function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY_THEME); } catch (e) {}
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  })();

  on(themeToggle, 'click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY_THEME, next); } catch (e) {}
    themeToggle.setAttribute('aria-pressed', next === 'dark' ? 'true' : 'false');
  });

  // Sincronizar cambios del SO si el usuario no ha elegido manualmente
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY_THEME); } catch (err) {}
        if (!saved) applyTheme(e.matches ? 'dark' : 'light');
      });
    } catch (e) {}
  }

  // ============================================================
  // 2. NAV: burger, overlay, scroll shrink, active link
  // ============================================================
  var burger   = $('#burger');
  var navLinks = $('#navLinks');
  var navOverlay = $('#navOverlay');
  var header   = $('.nav');
  var links    = $$('.nav-links a.link');

  function openMobileNav(open) {
    if (!navLinks) return;
    navLinks.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (navOverlay) navOverlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  on(burger, 'click', function () {
    var willOpen = !navLinks.classList.contains('open');
    openMobileNav(willOpen);
  });

  on(navOverlay, 'click', function () { openMobileNav(false); });

  links.forEach(function (a) {
    on(a, 'click', function () { openMobileNav(false); });
  });

  // Cerrar menú con tecla Escape
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      openMobileNav(false);
      burger.focus();
    }
  });

  // Navbar shrink on scroll
  var lastScroll = 0;
  function onScrollNav() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    // Scroll-to-top
    var st = safeGet('scrollTop');
    if (st) st.classList.toggle('visible', y > 600);
    // Mobile order bar visible cuando NO estamos en el hero
    var mob = safeGet('mobileOrderBar');
    if (mob) mob.classList.toggle('visible', y > window.innerHeight * 0.6);
    lastScroll = y;
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  // Active link con IntersectionObserver
  var sections = links.map(function (a) {
    var id = a.getAttribute('href');
    return id && id.startsWith('#') ? document.querySelector(id) : null;
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var id = '#' + en.target.id;
          links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  // ============================================================
  // 3. SCROLL TO TOP
  // ============================================================
  var scrollTopBtn = safeGet('scrollTop');
  on(scrollTopBtn, 'click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================================
  // 4. WHATSAPP FLOATING MENU
  // ============================================================
  var waBtn  = safeGet('waBtn');
  var waMenu = safeGet('waMenu');
  on(waBtn, 'click', function (e) {
    e.stopPropagation();
    waMenu.classList.toggle('open');
  });
  on(document, 'click', function () { waMenu.classList.remove('open'); });

  // ============================================================
  // 5. CUSTOM SELECT DROPDOWNS
  // ============================================================
  $$('.custom-select').forEach(function (select) {
    var trigger = select.querySelector('.select-trigger');
    var hiddenInput = select.querySelector('input[type="hidden"]');
    var options = select.querySelectorAll('.select-option');

    on(trigger, 'click', function (e) {
      e.stopPropagation();
      $$('.custom-select').forEach(function (other) {
        if (other !== select) other.classList.remove('open');
      });
      select.classList.toggle('open');
      trigger.setAttribute('aria-expanded', select.classList.contains('open'));
    });

    options.forEach(function (opt) {
      on(opt, 'click', function (e) {
        e.stopPropagation();
        var val = opt.getAttribute('data-value');
        var text = opt.textContent.trim();
        // Mantener el icono del trigger si existe
        trigger.childNodes[0].textContent = text + ' ';
        if (hiddenInput) hiddenInput.value = val;
        options.forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        select.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        // Guardar en localStorage
        if (hiddenInput) {
          try { localStorage.setItem('pizzeria007_' + hiddenInput.id, val); } catch (e) {}
        }
      });
    });
  });

  on(document, 'click', function () {
    $$('.custom-select').forEach(function (s) {
      s.classList.remove('open');
      var tr = s.querySelector('.select-trigger');
      if (tr) tr.setAttribute('aria-expanded', 'false');
    });
  });

  // ============================================================
  // 6. FORMULARIO DE PEDIDO (validación + persistencia + WhatsApp)
  // ============================================================
  var orderForm = safeGet('orderForm');
  var nombre    = safeGet('nombre');
  var msg       = safeGet('msg');

  // Restaurar valores guardados
  ['nombre', 'msg'].forEach(function (id) {
    var el = safeGet(id);
    if (!el) return;
    try {
      var v = localStorage.getItem('pizzeria007_' + id);
      if (v) el.value = v;
    } catch (e) {}
    on(el, 'input', function () {
      try { localStorage.setItem('pizzeria007_' + id, el.value); } catch (e) {}
    });
  });

  function showFieldError(input, msg) {
    var err = input.parentElement.querySelector('.field-error');
    if (!err) return;
    err.textContent = msg;
    err.classList.add('show');
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
  }
  function clearFieldError(input) {
    var err = input.parentElement.querySelector('.field-error');
    if (err) err.classList.remove('show');
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
  }
  [nombre, msg].forEach(function (el) {
    if (!el) return;
    on(el, 'input', function () { clearFieldError(el); });
  });

  on(orderForm, 'submit', function (e) {
    e.preventDefault();
    var valid = true;
    if (!nombre.value.trim()) { showFieldError(nombre, 'Por favor dinos tu nombre'); valid = false; }
    if (!msg.value.trim())    { showFieldError(msg, 'Cuéntanos qué quieres pedir');    valid = false; }
    if (!valid) {
      var firstInvalid = orderForm.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var sedeSel = safeGet('sedeSel');
    var tipoEl  = safeGet('tipo');
    var sede = sedeSel ? sedeSel.value : '584144369559';
    var tipo = tipoEl ? tipoEl.value : 'Delivery a domicilio';
    var text = 'Hola Pizzería 007! Soy ' + nombre.value.trim() + '.\n' +
               'Tipo: ' + tipo + '\n' +
               'Pedido: ' + msg.value.trim();

    // Si hay items en el carrito, agregarlos
    if (cart.items.length) {
      text += '\n\n*Carrito:*\n' + cart.items.map(function (it) {
        return '• ' + it.qty + 'x ' + it.name + ' (' + formatPrice(it.price) + ')';
      }).join('\n');
      text += '\n*Total: ' + formatPrice(cart.getTotal()) + '*';
    }

    window.open('https://wa.me/' + sede + '?text=' + encodeURIComponent(text), '_blank');
    toast('Abriendo WhatsApp…');
  });

  // ============================================================
  // 7. REVEAL ON SCROLL
  // ============================================================
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('show');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('show'); });
  }

  // ============================================================
  // 8. CONTADORES ANIMADOS
  // ============================================================
  var counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    $$('[data-count]').forEach(function (el) {
      var target = +el.getAttribute('data-count');
      var suf = el.getAttribute('data-suffix') || '';
      var cur = 0;
      var step = Math.max(1, Math.round(target / 45));
      var iv = setInterval(function () {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = cur + suf;
      }, 26);
    });
  }
  var heroStats = $('.hero-stats');
  if (heroStats && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) runCounters(); });
    }, { threshold: 0.4 });
    io2.observe(heroStats);
  } else if (heroStats) {
    runCounters();
  }

  // ============================================================
  // 9. CARRUSEL DE RESEÑAS (con teclado + autoplay)
  // ============================================================
  (function carousel() {
    var wrapper = safeGet('carouselWrapper');
    var prev = safeGet('carouselPrev');
    var next = safeGet('carouselNext');
    var dotsContainer = safeGet('carouselDots');
    if (!wrapper || !prev || !next || !dotsContainer) return;

    var cards = wrapper.querySelectorAll('.review-card');
    var totalCards = cards.length;
    if (totalCards === 0) return;

    var currentPage = 0;
    var autoPlayTimer = null;

    function getGap() { return 24; }
    function getCardWidth() { return cards[0].offsetWidth + getGap(); }
    function getVisibleCount() {
      var ww = wrapper.offsetWidth;
      var cw = getCardWidth();
      return Math.max(1, Math.floor((ww + getGap()) / cw));
    }
    function getTotalPages() { return Math.max(1, totalCards - getVisibleCount() + 1); }

    function buildDots() {
      dotsContainer.innerHTML = '';
      var pages = getTotalPages();
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.setAttribute('aria-label', 'Ir a la página ' + (i + 1));
        dot.addEventListener('click', (function (idx) {
          return function () { goToPage(idx); resetAutoPlay(); };
        })(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateActiveDot() {
      $$('.carousel-dot', dotsContainer).forEach(function (d, idx) {
        d.classList.toggle('active', idx === currentPage);
      });
    }

    function goToPage(page) {
      var pages = getTotalPages();
      currentPage = Math.max(0, Math.min(page, pages - 1));
      wrapper.scrollTo({ left: currentPage * getCardWidth(), behavior: 'smooth' });
      updateActiveDot();
    }

    function nextPage() {
      var pages = getTotalPages();
      goToPage(currentPage >= pages - 1 ? 0 : currentPage + 1);
    }
    function prevPage() {
      var pages = getTotalPages();
      goToPage(currentPage <= 0 ? pages - 1 : currentPage - 1);
    }

    on(next, 'click', function () { nextPage(); resetAutoPlay(); });
    on(prev, 'click', function () { prevPage(); resetAutoPlay(); });

    // Teclado cuando el carrusel tiene foco
    on(wrapper, 'keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextPage(); resetAutoPlay(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prevPage(); resetAutoPlay(); }
    });

    var scrollTimeout;
    wrapper.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        var cw = getCardWidth();
        var newPage = Math.round(wrapper.scrollLeft / cw);
        var pages = getTotalPages();
        if (newPage >= 0 && newPage < pages && newPage !== currentPage) {
          currentPage = newPage;
          updateActiveDot();
        }
      }, 80);
    }, { passive: true });

    function startAutoPlay() { stopAutoPlay(); autoPlayTimer = setInterval(nextPage, 5000); }
    function stopAutoPlay() { if (autoPlayTimer) { clearInterval(autoPlayTimer); autoPlayTimer = null; } }
    function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    wrapper.addEventListener('focusin', stopAutoPlay);
    wrapper.addEventListener('focusout', startAutoPlay);
    wrapper.addEventListener('touchstart', stopAutoPlay, { passive: true });
    wrapper.addEventListener('touchend', function () { setTimeout(startAutoPlay, 3000); });

    // Respeta prefers-reduced-motion: si está activado, no auto-play
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) startAutoPlay();

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        var pages = getTotalPages();
        if (currentPage >= pages) currentPage = pages - 1;
        buildDots();
      }, 150);
    });

    buildDots();
  })();

  // ============================================================
  // 10. CARRITO DE PEDIDO RÁPIDO
  // ============================================================
  function formatPrice(n) { return '$' + n.toFixed(2); }

  var cart = {
    items: [],
    STORAGE_KEY: 'pizzeria007_cart',

    load: function () {
      try {
        var raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) this.items = JSON.parse(raw) || [];
      } catch (e) { this.items = []; }
    },
    save: function () {
      try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items)); } catch (e) {}
    },
    add: function (item) {
      var existing = this.items.find(function (i) { return i.name === item.name; });
      if (existing) existing.qty++;
      else this.items.push({ name: item.name, price: item.price, qty: 1, img: item.img });
      this.save();
      this.render();
    },
    remove: function (idx) {
      this.items.splice(idx, 1);
      this.save();
      this.render();
    },
    setQty: function (idx, qty) {
      if (qty <= 0) { this.remove(idx); return; }
      this.items[idx].qty = qty;
      this.save();
      this.render();
    },
    clear: function () {
      this.items = [];
      this.save();
      this.render();
    },
    getTotal: function () {
      return this.items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
    },
    getCount: function () {
      return this.items.reduce(function (s, i) { return s + i.qty; }, 0);
    },
    render: function () {
      var body = safeGet('cartBody');
      var totalEl = safeGet('cartTotal');
      var countEls = $$('.cart-count');
      var checkoutBtn = safeGet('cartCheckout');

      if (!body) return;

      if (this.items.length === 0) {
        body.innerHTML = '<div class="cart-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
          '<p>Tu carrito está vacío.<br>Agrega pizzas del menú para empezar tu pedido.</p></div>';
        if (totalEl) totalEl.textContent = formatPrice(0);
        countEls.forEach(function (e) { e.classList.remove('visible'); e.textContent = '0'; });
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
      }

      body.innerHTML = this.items.map(function (it, idx) {
        return '<div class="cart-item">' +
          '<img class="cart-item-img" src="' + (it.img || '') + '" alt="">' +
          '<div class="cart-item-info">' +
            '<h4>' + escapeHtml(it.name) + '</h4>' +
            '<div class="qty-row">' +
              '<button class="qty-btn" data-act="dec" data-idx="' + idx + '" aria-label="Quitar uno">−</button>' +
              '<span class="qty-val">' + it.qty + '</span>' +
              '<button class="qty-btn" data-act="inc" data-idx="' + idx + '" aria-label="Agregar uno">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="cart-item-price">' + formatPrice(it.price * it.qty) + '</div>' +
          '<button class="cart-item-remove" data-act="del" data-idx="' + idx + '" aria-label="Eliminar">' +
            '<svg class="ico ico-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>' +
          '</button>' +
        '</div>';
      }).join('');

      if (totalEl) totalEl.textContent = formatPrice(this.getTotal());
      var total = this.getCount();
      countEls.forEach(function (e) {
        e.textContent = total;
        e.classList.toggle('visible', total > 0);
      });
      if (checkoutBtn) checkoutBtn.disabled = false;

      // Eventos de los botones
      $$('.qty-btn, .cart-item-remove', body).forEach(function (btn) {
        on(btn, 'click', function () {
          var act = btn.getAttribute('data-act');
          var idx = +btn.getAttribute('data-idx');
          if (act === 'inc') cart.setQty(idx, cart.items[idx].qty + 1);
          else if (act === 'dec') cart.setQty(idx, cart.items[idx].qty - 1);
          else if (act === 'del') cart.remove(idx);
        });
      });
    }
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  }

  // Cargar carrito al inicio
  cart.load();
  cart.render();

  // Botón "Agregar al carrito" en cada card del menú
  $$('.add-to-cart').forEach(function (btn) {
    on(btn, 'click', function () {
      var name  = btn.getAttribute('data-name');
      var price = parseFloat(btn.getAttribute('data-price'));
      var img   = btn.getAttribute('data-img');
      if (!name || isNaN(price)) return;
      cart.add({ name: name, price: price, img: img });

      // Flash visual en la card
      var card = btn.closest('.card');
      if (card) {
        var flash = card.querySelector('.added-flash');
        if (!flash) {
          flash = document.createElement('div');
          flash.className = 'added-flash';
          flash.textContent = '¡Agregado!';
          card.querySelector('.ph').appendChild(flash);
        }
        flash.classList.add('show');
        setTimeout(function () { flash.classList.remove('show'); }, 800);
      }
      toast(name + ' agregado al carrito');
    });
  });

  // Abrir/cerrar panel del carrito
  var cartBtn      = safeGet('cartBtn');
  var cartBtnMobile = safeGet('cartBtnMobile');
  var cartOverlay  = safeGet('cartOverlay');
  var cartPanel    = safeGet('cartPanel');
  var cartClose    = safeGet('cartClose');

  function openCart(open) {
    if (!cartPanel) return;
    cartPanel.classList.toggle('open', open);
    cartOverlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && cart.items.length === 0) {
      setTimeout(function () {
        var firstFocusable = cartPanel.querySelector('button, a, input');
        if (firstFocusable) firstFocusable.focus();
      }, 100);
    }
  }
  on(cartBtn, 'click', function () { openCart(true); });
  if (cartBtnMobile) on(cartBtnMobile, 'click', function () { openCart(true); });
  on(cartClose, 'click', function () { openCart(false); });
  on(cartOverlay, 'click', function () { openCart(false); });

  // Tecla Escape para cerrar carrito
  on(document, 'keydown', function (e) {
    if (e.key === 'Escape' && cartPanel && cartPanel.classList.contains('open')) {
      openCart(false);
    }
  });

  // Checkout del carrito → WhatsApp con todos los items
  on(safeGet('cartCheckout'), 'click', function () {
    if (cart.items.length === 0) return;
    var sedeSel = safeGet('sedeSel');
    var sede = sedeSel ? sedeSel.value : '584144369559';
    var text = 'Hola Pizzería 007! Quiero hacer este pedido:\n\n';
    text += cart.items.map(function (it) {
      return '• ' + it.qty + 'x ' + it.name + ' — ' + formatPrice(it.price * it.qty);
    }).join('\n');
    text += '\n\n*Total: ' + formatPrice(cart.getTotal()) + '*\n\nGracias!';
    window.open('https://wa.me/' + sede + '?text=' + encodeURIComponent(text), '_blank');
    toast('Abriendo WhatsApp con tu pedido…');
  });

  // CTA directa en barra móvil → WhatsApp con sede por defecto
  on(safeGet('mobileCtaWa'), 'click', function () {
    var sedeSel = safeGet('sedeSel');
    var sede = sedeSel ? sedeSel.value : '584144369559';
    var text = 'Hola Pizzería 007! Quiero hacer un pedido.';
    if (cart.items.length) {
      text += '\n\n*Mi pedido:*\n' + cart.items.map(function (it) {
        return '• ' + it.qty + 'x ' + it.name + ' — ' + formatPrice(it.price * it.qty);
      }).join('\n') + '\n*Total: ' + formatPrice(cart.getTotal()) + '*';
    }
    window.open('https://wa.me/' + sede + '?text=' + encodeURIComponent(text), '_blank');
  });

  // ============================================================
  // 11. HERO PARALLAX SUTIL (solo si no prefiere menos movimiento)
  // ============================================================
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.matchMedia('(min-width: 1024px)').matches) {
    var hero = $('.hero');
    if (hero) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var y = window.scrollY;
            if (y < window.innerHeight) {
              hero.style.backgroundPositionY = (50 + y * 0.15) + '%';
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // ============================================================
  // 14. LIGHTBOX para galería y fotos de menú
  // ============================================================
  (function initLightbox() {
    var galleryImgs = $$('.gallery img, .card .ph img, .about-media img');
    if (!galleryImgs.length) return;

    // Crear markup del lightbox
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Visor de imágenes');
    lb.innerHTML =
      '<button class="lightbox-close" aria-label="Cerrar">' +
        '<svg class="ico ico-lg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<button class="lightbox-nav prev" aria-label="Anterior"><svg class="ico ico-lg" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>' +
      '<img class="lightbox-img" alt="">' +
      '<button class="lightbox-nav next" aria-label="Siguiente"><svg class="ico ico-lg" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></button>' +
      '<div class="lightbox-caption"></div>' +
      '<div class="lightbox-counter"></div>';
    document.body.appendChild(lb);

    var lbImg = $('.lightbox-img', lb);
    var lbCap = $('.lightbox-caption', lb);
    var lbCnt = $('.lightbox-counter', lb);
    var lbClose = $('.lightbox-close', lb);
    var lbPrev = $('.prev', lb);
    var lbNext = $('.next', lb);

    var items = galleryImgs.map(function (img) {
      // Usar la versión full (la foto original del srcset si existe)
      var src = img.currentSrc || img.src;
      // Para imágenes en /assets/instagram/, reemplazar la thumb por la foto original
      return { src: src, alt: img.alt || '' };
    });
    var current = 0;
    var lastFocus = null;

    function show(idx) {
      current = (idx + items.length) % items.length;
      var it = items[current];
      lbImg.src = it.src;
      lbImg.alt = it.alt;
      lbCap.textContent = it.alt;
      lbCnt.textContent = (current + 1) + ' / ' + items.length;
    }

    function open(idx) {
      lastFocus = document.activeElement;
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      show(idx);
      setTimeout(function () { lbClose.focus(); }, 50);
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    // Click en cualquier imagen de galería/menu/nosotros abre el lightbox
    galleryImgs.forEach(function (img, idx) {
      on(img, 'click', function (e) {
        // Solo abrir si la imagen no está dentro de un <a> con href externo
        var parentA = img.closest('a');
        if (parentA && parentA.getAttribute('href') && parentA.getAttribute('href').indexOf('#') !== 0) {
          // Si es un enlace externo (instagram), dejamos que funcione normal
          return;
        }
        e.preventDefault();
        open(idx);
      });
      // Hacer la imagen "clickeable" visualmente
      img.style.cursor = 'zoom-in';
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      on(img, 'keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(idx);
        }
      });
    });

    on(lbClose, 'click', close);
    on(lbPrev, 'click', function () { show(current - 1); });
    on(lbNext, 'click', function () { show(current + 1); });
    on(lb, 'click', function (e) { if (e.target === lb) close(); });

    on(document, 'keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(current - 1);
      else if (e.key === 'ArrowRight') show(current + 1);
    });
  })();

  // ============================================================
  // 15. Scroll progress bar
  // ============================================================
  (function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
      bar.style.width = (scrolled * 100) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  // ============================================================
  // 16. PWA install prompt (beforeinstallprompt)
  // ============================================================
  (function initPWAInstall() {
    var deferredPrompt = null;
    var installed = false;
    try { installed = localStorage.getItem('pwa_installed') === '1'; } catch (e) {}

    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      if (installed) return;
      // Mostrar banner después de 25s si el usuario no lo ha dismissado
      var dismissed = false;
      try { dismissed = localStorage.getItem('pwa_dismissed') === '1'; } catch (e) {}
      if (dismissed) return;
      setTimeout(showInstallBanner, 25000);
    });

    function showInstallBanner() {
      if (!deferredPrompt || document.querySelector('.pwa-install')) return;
      var banner = document.createElement('div');
      banner.className = 'pwa-install';
      banner.innerHTML =
        '<div class="icon"><svg class="ico ico-md" viewBox="0 0 24 24"><path d="M12 3v12"/><polyline points="7 8 12 3 17 8"/><path d="M5 21h14"/></svg></div>' +
        '<div class="text"><b>Instala Pizzería 007</b>Acceso rápido desde tu pantalla de inicio.' +
          '<div class="actions">' +
            '<button class="btn-accept">Instalar</button>' +
            '<button class="btn-dismiss">Ahora no</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(banner);
      requestAnimationFrame(function () { banner.classList.add('show'); });

      $('.btn-accept', banner).addEventListener('click', function () {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choice) {
          if (choice.outcome === 'accepted') {
            try { localStorage.setItem('pwa_installed', '1'); } catch (e) {}
          }
          deferredPrompt = null;
          banner.classList.remove('show');
          setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
        });
      });
      $('.btn-dismiss', banner).addEventListener('click', function () {
        try { localStorage.setItem('pwa_dismissed', '1'); } catch (e) {}
        banner.classList.remove('show');
        setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
      });
    }

    window.addEventListener('appinstalled', function () {
      try { localStorage.setItem('pwa_installed', '1'); } catch (e) {}
      var b = document.querySelector('.pwa-install');
      if (b) b.classList.remove('show');
    });
  })();

  // ============================================================
  // 17. Service Worker registration (offline cache)
  // ============================================================
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').then(function (reg) {
        // SW registrado
      }).catch(function (e) {
        // Fallo silencioso (no afecta al usuario)
        if (window.console) console.warn('SW registration failed:', e);
      });
    });
  }

})();
