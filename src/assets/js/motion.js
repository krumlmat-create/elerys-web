/* Elerys – pohyb webu: GSAP + ScrollTrigger.
   Zásady: jeden výrazný moment (úvod + razítko „Zapsáno do ENEX“), jinak jen jemné odhalení obsahu.
   Žádný pohyb při prefers-reduced-motion; bez JS je vše vidět (třída .motion se přidá jen s JS). */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('motion') || !window.gsap) { root.classList.remove('motion'); return; }
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  window.__motionReady = true;
  var fine = window.matchMedia('(pointer: fine)').matches;
  var EASE = 'power3.out';

  // Plynulé rolování (Lenis) vypnuto: na Windows s kolečkem myši působilo zpožděně. Rolování je nativní,
  // kotvy řeší CSS (scroll-behavior + scroll-padding-top).

  // ---------- rozdělení nadpisu na slova (maska) ----------
  function split(el) {
    if (!el || el.dataset.split) return [];
    el.dataset.split = '1';
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement('span'); w.className = 'sw';
            var i = document.createElement('span'); i.className = 'swi'; i.textContent = p;
            w.appendChild(i); frag.appendChild(w); out.push(i);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !/^(BR|SVG)$/.test(n.tagName)) walk(n);
      });
    })(el);
    return out;
  }

  // ---------- úvodní sekce ----------
  var hero = document.querySelector('.hero') || document.querySelector('.page-hero');
  if (hero) {
    var tl = gsap.timeline({ defaults: { ease: EASE } });
    var h1 = hero.querySelector('h1');
    var words = split(h1);
    var bg = hero.querySelector('.hero-bg img, .page-hero-bg img');
    var media = hero.querySelector('.xhero-portrait img, .page-hero-media img');
    if (bg) tl.fromTo(bg, { scale: 1.14 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0);
    tl.from(hero.querySelectorAll('.eyebrow, .breadcrumbs'), { y: 14, autoAlpha: 0, duration: 0.6 }, 0.1);
    if (words.length) tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.045 }, 0.18);
    tl.from(hero.querySelectorAll('.lead, .hero-cta > *, .hero-proof li, .hero-note, .updated'), { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.55);
    if (media) {
      var fig = media.closest('figure');
      tl.fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut' }, 0.25);
      tl.fromTo(media, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0.25);
      tl.from(hero.querySelectorAll('.xhero-portrait figcaption'), { autoAlpha: 0, y: 10, duration: 0.6 }, 1.1);
    }
    // parallax pozadí
    if (bg) gsap.to(bg, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    if (media && fine) gsap.to(media, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---------- nadpisy sekcí ----------
  gsap.utils.toArray('main h2').forEach(function (h) {
    if (h.closest('.hero, .page-hero, .checker, .form-card, .cookie-bar, .collapse')) return;
    var w = split(h);
    if (!w.length) return;
    gsap.fromTo(w, { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: EASE, stagger: 0.035, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });

  // ---------- štítky nad nadpisy: linka se protáhne, text dojede ----------
  gsap.utils.toArray('main .kick').forEach(function (k) {
    if (k.closest('.hero, .page-hero, .ck-result')) return;
    var st = { trigger: k, start: 'top 90%', once: true };
    gsap.fromTo(k, { '--kick': 0 }, { '--kick': 1, duration: 0.7, ease: 'power2.inOut', scrollTrigger: st });
    gsap.from(k, { x: -10, autoAlpha: 0, duration: 0.6, ease: EASE, scrollTrigger: st });
  });

  // ---------- linkované přehledy: linka se protáhne, řádky naskočí ----------
  gsap.utils.toArray('.timeline').forEach(function (list) {
    var items = list.children;
    var st = { trigger: list, start: 'top 85%', once: true };
    gsap.fromTo(list, { '--rule': 0 }, { '--rule': 1, duration: 1.1, ease: 'power2.inOut', scrollTrigger: st });
    gsap.from(items, { y: 22, autoAlpha: 0, duration: 0.8, ease: EASE, stagger: 0.08, scrollTrigger: st });
  });

  // ---------- obrázky: odhalení zdola + jemný zoom ----------
  gsap.utils.toArray('.person-photo, .ref-img').forEach(function (f) {
    var im = f.querySelector('img');
    if (!im) return;
    var st = { trigger: f, start: 'top 88%', once: true };
    gsap.fromTo(f, { clipPath: 'inset(18% 0% 0% 0%)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: st });
    gsap.fromTo(im, { scale: 1.12 }, { scale: 1, duration: 1.4, ease: 'power3.out', scrollTrigger: st });
  });

  // ---------- karty v karuselech a mřížkách ----------
  gsap.utils.toArray('.works').forEach(function (g) {
    gsap.from(g.children, { y: 30, autoAlpha: 0, duration: 0.9, ease: EASE, stagger: 0.07, scrollTrigger: { trigger: g, start: 'top 88%', once: true } });
  });

  // ---------- ukázka zprávy: řádky, štítky, razítko ----------
  var report = document.querySelector('.report-paper');
  if (report) {
    var rtl = gsap.timeline({ scrollTrigger: { trigger: report, start: 'top 75%', once: true }, defaults: { ease: EASE } });
    rtl.fromTo(report, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, clearProps: 'transform' })
      .from(report.querySelectorAll('.report-rows li'), { x: -14, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, '-=0.4')
      .from(report.querySelectorAll('.chip'), { scale: 0.6, autoAlpha: 0, duration: 0.45, stagger: 0.09, ease: 'back.out(2.2)' }, '-=0.3')
      .from(report.querySelector('.report-foot'), { y: 12, autoAlpha: 0, duration: 0.5 }, '-=0.1')
      .fromTo(report.querySelector('.report-stamp'), { scale: 2.4, rotate: -30, autoAlpha: 0 }, { scale: 1, rotate: -12, autoAlpha: 1, duration: 0.42, ease: 'power4.in' }, '+=0.15')
      .fromTo(report, { rotate: 0 }, { rotate: 0.6, duration: 0.06, yoyo: true, repeat: 3, ease: 'none', transformOrigin: '50% 100%', clearProps: 'transform' });
  }

  // ---------- mapa: body naskočí od západu na východ ----------
  gsap.utils.toArray('.czmap').forEach(function (m) {
    var dots = Array.prototype.slice.call(m.querySelectorAll('.map-dot'));
    dots.sort(function (a, b) { return a.getBBox().x - b.getBBox().x; });
    var tlm = gsap.timeline({ scrollTrigger: { trigger: m, start: 'top 80%', once: true } });
    tlm.from(m.querySelector('.map-edge'), { strokeDasharray: 4000, strokeDashoffset: 4000, duration: 1.6, ease: 'power2.inOut' })
      .from(dots, { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: { each: 0.012 }, ease: 'back.out(3)' }, 0.5)
      .from(m.querySelectorAll('.map-label'), { autoAlpha: 0, duration: 0.6, stagger: 0.05 }, 1.1);
  });

  // ---------- magnetická hlavní tlačítka (jen myš) ----------
  if (fine) {
    gsap.utils.toArray('.btn-primary').forEach(function (b) {
      var xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
      b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.18); yTo((e.clientY - r.top - r.height / 2) * 0.28); });
      b.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  root.classList.add('motion-ready');
  window.addEventListener('load', function () { ST.refresh(); });
})();
