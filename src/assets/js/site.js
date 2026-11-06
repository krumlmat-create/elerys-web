/* Elerys – minimální vanilla JS (menu, cookies/Consent Mode v2, formuláře, konverze) */
(function () {
  'use strict';
  var MK = window.MK || {};
  var store = {
    get: function (s, k) { try { return window[s].getItem(k); } catch (e) { return null; } },
    set: function (s, k, v) { try { window[s].setItem(k, v); } catch (e) {} },
    del: function (s, k) { try { window[s].removeItem(k); } catch (e) {} }
  };
  // souhlas platí 12 měsíců, pak se lišta zobrazí znovu
  var CONSENT_MAX = 365 * 24 * 3600 * 1000;
  var consentNow = null;
  try { consentNow = JSON.parse(store.get('localStorage', 'el_consent')); } catch (e) {}
  if (consentNow && !(consentNow.ts && Date.now() - consentNow.ts < CONSENT_MAX)) { consentNow = null; store.del('localStorage', 'el_consent'); }
  function tagConsent() { return !!(consentNow && (consentNow.ads || consentNow.analytics)); }
  // Google tag se načítá až po souhlasu (základní režim Consent Mode); do té doby se žádné události neodesílají
  var rawGtag = window.gtag || function () {};
  var gtag = function () { if (tagConsent()) rawGtag.apply(null, arguments); };

  // ---------- mobilní menu ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('hlavni-menu');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }
  // zavření rozbalovacích menu kliknutím mimo / klávesou Esc
  var subs = document.querySelectorAll('.nav-sub');
  document.addEventListener('click', function (e) {
    subs.forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') subs.forEach(function (d) { if (d.open) { d.removeAttribute('open'); d.querySelector('summary').focus(); } });
  });
  // na počítači se podnabídky otevírají najetím myši
  var hoverMQ = window.matchMedia('(min-width: 1180px) and (pointer: fine)');
  subs.forEach(function (d) {
    var t = null;
    d.parentNode.addEventListener('mouseenter', function () { if (!hoverMQ.matches) return; clearTimeout(t); subs.forEach(function (o) { if (o !== d) o.removeAttribute('open'); }); d.setAttribute('open', ''); });
    d.parentNode.addEventListener('mouseleave', function () { if (!hoverMQ.matches) return; t = setTimeout(function () { d.removeAttribute('open'); }, 160); });
  });
  subs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) subs.forEach(function (o) { if (o !== d) o.removeAttribute('open'); });
      // rozmazání stránky pod rozbaleným panelem (jen na počítači)
      var any = Array.prototype.some.call(subs, function (o) { return o.open; });
      document.body.classList.toggle('nav-flyout', any && window.matchMedia('(min-width: 1180px)').matches);
    });
  });

  // ---------- Google tag (načtení až po načtení stránky kvůli výkonu) ----------
  var tagLoaded = false;
  function loadTag() {
    if (tagLoaded || !MK.gtagId || !tagConsent()) return;
    tagLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MK.gtagId;
    document.head.appendChild(s);
  }
  if (MK.loadTagNow) loadTag();
  else if (document.readyState === 'complete') setTimeout(loadTag, 1500);
  else window.addEventListener('load', function () { setTimeout(loadTag, 1500); });
  ['scroll', 'pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, loadTag, { once: true, passive: true });
  });

  // ---------- Sklik (Seznam) – načte se jen se souhlasem s reklamními cookies ----------
  // SEM (Seznam Event Measurement): sul.js se načte až se souhlasem; události do té doby čekají ve frontě
  var sklikQueue = [];
  var sklikLoaded = false;
  function sklikConsent() { return !!(consentNow && consentNow.ads); }
  function semFlush() {
    if (typeof window.SEM !== 'function') return;
    sklikQueue.splice(0).forEach(function (args) { window.SEM.apply(window, args); });
  }
  function loadSklik() {
    if (sklikLoaded || !MK.sklikSem || !sklikConsent()) return;
    sklikLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://l.seznam.cz/sul.js?id=' + encodeURIComponent(MK.sklikSem);
    s.onload = function () {
      if (typeof window.SEM !== 'function') return;
      window.SEM('updateConsent', { consent_mode: { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', functionality_storage: 'denied', analytics_storage: consentNow && consentNow.analytics ? 'granted' : 'denied' } });
      window.SEM('track', 'PageView');
      semFlush();
    };
    document.head.appendChild(s);
  }
  /** Sklik událost (SubmitApplication = poptávka, Contact = klik na telefon) – jen se souhlasem */
  function sklikConversion(eventName) {
    if (!eventName || !MK.sklikSem || !sklikConsent()) return;
    sklikQueue.push(['track', eventName]);
    if (typeof window.SEM === 'function' && sklikLoaded) semFlush();
    else loadSklik();
  }
  /** Jednotné měření událostí: gtag event (+ Google Ads konverze) + Sklik (SEM) událost */
  function track(name, params, adsSendTo, sklikEvent, value) {
    loadTag();
    gtag('event', name, params || {});
    if (adsSendTo) gtag('event', 'conversion', Object.assign({ send_to: adsSendTo }, value ? { value: value, currency: MK.currency || 'CZK' } : {}, params && params.transaction_id ? { transaction_id: params.transaction_id } : {}));
    sklikConversion(sklikEvent);
  }
  window.MKtrack = track;
  if (window.addEventListener) window.addEventListener('load', loadSklik);

  // ---------- cookie lišta / Consent Mode v2 ----------
  var bar = document.getElementById('cookie-bar');
  function setBarOpen(open) {
    if (!bar) return;
    bar.hidden = !open;
    document.body.classList.toggle('cookie-open', open);
  }
  function applyConsent(c) {
    rawGtag('consent', 'update', {
      ad_storage: c.ads ? 'granted' : 'denied',
      ad_user_data: c.ads ? 'granted' : 'denied',
      ad_personalization: c.ads ? 'granted' : 'denied',
      analytics_storage: c.analytics ? 'granted' : 'denied'
    });
    consentNow = { ads: !!c.ads, analytics: !!c.analytics, ts: Date.now() };
    store.set('localStorage', 'el_consent', JSON.stringify(consentNow));
    setBarOpen(false);
    loadTag();
    loadSklik();
    if (window.MKpersistAttr) window.MKpersistAttr();
  }
  if (bar) {
    var prefs = bar.querySelector('.cookie-prefs');
    if (!consentNow) setBarOpen(true);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var mode = b.getAttribute('data-consent');
      if (mode === 'all') applyConsent({ ads: true, analytics: true });
      else if (mode === 'none') applyConsent({ ads: false, analytics: false });
      else if (mode === 'custom') {
        if (prefs.hidden) { prefs.hidden = false; b.textContent = 'Uložit výběr'; }
        else applyConsent({ ads: prefs.elements.ads.checked, analytics: prefs.elements.analytics.checked });
      }
    });
    document.querySelectorAll('[data-cookie-settings]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (consentNow) { prefs.elements.ads.checked = !!consentNow.ads; prefs.elements.analytics.checked = !!consentNow.analytics; }
        prefs.hidden = false;
        bar.querySelector('[data-consent="custom"]').textContent = 'Uložit výběr';
        setBarOpen(true);
        bar.querySelector('button').focus();
      });
    });
  }

  // ---------- konverze: klik na telefon a e-mail ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (!a) return;
    if (a.getAttribute('href').indexOf('tel:') === 0) track('phone_click', { link_url: a.getAttribute('href') }, MK.convPhone, 'Contact', MK.convPhoneValue);
    else track('email_click', { link_url: a.getAttribute('href').split('?')[0] }, null, null);
  });

  // ---------- WhatsApp a sdílení ----------
  document.addEventListener('click', function (e) {
    var w = e.target.closest('a[data-track="whatsapp"]');
    if (w) track('whatsapp_click', { link_url: 'wa.me' });
    var c = e.target.closest('.share-copy');
    if (c && navigator.clipboard) { navigator.clipboard.writeText(c.getAttribute('data-copy')).then(function () { c.classList.add('is-done'); setTimeout(function () { c.classList.remove('is-done'); }, 1600); }); }
  });
  // ---------- UTM / gclid – jen se souhlasem ----------
  // gclid/gbraid/wbraid: jen se souhlasem s reklamními cookies; UTM a vstupní stránka: se souhlasem analytickým nebo reklamním.
  var ADS_KEYS = ['gclid', 'gbraid', 'wbraid'];
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var params = new URLSearchParams(location.search);
  var pending = { vstupni_stranka: location.pathname + location.search, referrer: document.referrer || '' };
  ADS_KEYS.concat(UTM_KEYS).forEach(function (k) { if (params.get(k)) pending[k] = params.get(k); });
  var hasCampaign = ADS_KEYS.concat(UTM_KEYS).some(function (k) { return pending[k]; });
  function allowed(k) {
    if (!consentNow) return false;
    if (ADS_KEYS.indexOf(k) >= 0) return !!consentNow.ads;
    return !!(consentNow.ads || consentNow.analytics);
  }
  function persistAttr() {
    if (!consentNow || !(consentNow.ads || consentNow.analytics)) { store.del('sessionStorage', 'mk_attr'); return; }
    var saved = {};
    try { saved = JSON.parse(store.get('sessionStorage', 'mk_attr')) || {}; } catch (e) {}
    if (hasCampaign || !saved.vstupni_stranka) {
      Object.keys(pending).forEach(function (k) { if (allowed(k)) saved[k] = pending[k]; });
    }
    Object.keys(saved).forEach(function (k) { if (!allowed(k)) delete saved[k]; });
    store.set('sessionStorage', 'mk_attr', JSON.stringify(saved));
  }
  persistAttr();
  window.MKpersistAttr = persistAttr;
  function attrForForm() {
    var saved = {};
    try { saved = JSON.parse(store.get('sessionStorage', 'mk_attr')) || {}; } catch (e) {}
    var out = {};
    Object.keys(saved).forEach(function (k) { if (allowed(k)) out[k] = saved[k]; });
    return out;
  }

  // ---------- ověření povinností budovy ----------
  // Pravidla odpovídají ověřeným faktům v src/config.mjs (facts) – při změně předpisu upravit obojí.
  var LAW = {
    heat: '§ 6a zákona č. 406/2000 Sb., vyhláška č. 38/2022 Sb.',
    ac: '§ 6a zákona č. 406/2000 Sb., vyhláška č. 284/2022 Sb.',
    penb: '§ 7a zákona č. 406/2000 Sb., vyhláška č. 264/2020 Sb.',
    audit: '§ 9 zákona č. 406/2000 Sb., vyhláška č. 183/2026 Sb.',
    pos: '§ 9a zákona č. 406/2000 Sb., vyhláška č. 141/2021 Sb.'
  };
  var TAG = { yes: 'týká se', maybe: 'ověřit', no: 'netýká se' };
  function ckEval(v) {
    var out = [], s = v.situace || [];
    var has = function (x) { return s.indexOf(x) > -1; };
    if (v.teplo) {
      if (v.teplo === 'nad70') out.push({ st: 'yes', t: 'Kontrola systému vytápění', d: 'Systém nad 70 kW se kontroluje nejméně jednou za 5 let, nový systém do 3 let od uvedení do provozu. Výjimkou je například systém řízený vyhovujícím systémem automatizace a řízení budovy.', law: LAW.heat, href: '/kontrola-vytapeni/', svc: 'kontrola vytápění' });
      else if (v.teplo === 'czt') out.push({ st: 'maybe', t: 'Kontrola systému vytápění', d: 'U dálkového tepla je zdrojem předávací stanice. Pokud má výkon nad 70 kW, kontrola je povinná nejméně jednou za 5 let.', law: LAW.heat, href: '/kontrola-vytapeni/', svc: 'kontrola vytápění' });
      else if (v.teplo === 'nevim') out.push({ st: 'maybe', t: 'Kontrola systému vytápění', d: 'Rozhoduje jmenovitý výkon zdroje (štítek kotle, revizní zpráva). Nad 70 kW je kontrola povinná – výkon rádi určíme z fotek.', law: LAW.heat, href: '/kontrola-vytapeni/', svc: 'kontrola vytápění' });
      else out.push({ st: 'no', t: 'Kontrola systému vytápění', d: 'Zdroj do 70 kW zákonné kontrole nepodléhá.', law: LAW.heat, href: '/kontrola-vytapeni/' });
    }
    if (v.klima) {
      if (v.klima === 'nad70') out.push({ st: 'yes', t: 'Kontrola klimatizačního systému', d: 'Systém nad 70 kW se kontroluje nejméně jednou za 5 let, nový systém do 3 let od uvedení do provozu.', law: LAW.ac, href: '/kontrola-klimatizace/', svc: 'kontrola klimatizace' });
      else if (v.klima === 'nevim') out.push({ st: 'maybe', t: 'Kontrola klimatizačního systému', d: 'Zjistěte jmenovitý výkon systému – nad 70 kW je kontrola povinná.', law: LAW.ac, href: '/kontrola-klimatizace/', svc: 'kontrola klimatizace' });
      else out.push({ st: 'no', t: 'Kontrola klimatizačního systému', d: v.klima === 'zadna' ? 'Budova klimatizaci nemá.' : 'Systém do 70 kW zákonné kontrole nepodléhá.', law: LAW.ac, href: '/kontrola-klimatizace/' });
    }
    if (v.situace || v.vlastnik) {
      var why = [];
      if (has('prodej')) why.push('prodej – průkaz předložíte zájemci před uzavřením smlouvy');
      if (has('najem')) why.push('pronájem budovy nebo její ucelené části');
      if (has('stavba')) why.push('nová stavba');
      if (has('zmena')) why.push('větší změna – více než 25 % plochy obálky budovy');
      if (v.vlastnik === 'ovm' && v.plocha250) why.push('budova užívaná orgánem veřejné moci nad 250 m² – průkaz umístit na viditelném místě');
      if (why.length) out.push({ st: 'yes', t: 'Průkaz energetické náročnosti (PENB)', d: 'Důvod: ' + why.join('; ') + '. Platný průkaz (do 10 let, bez větší změny budovy) lze použít znovu.', law: LAW.penb, href: v.typ === 'bd' || v.typ === 'verejna' ? '/penb/bytove-domy-a-verejne-budovy/' : '/penb/', svc: 'PENB' });
      else if (v.vlastnik === 'ovm') out.push({ st: 'maybe', t: 'Průkaz energetické náročnosti (PENB)', d: 'Budova užívaná orgánem veřejné moci musí mít průkaz, pokud má energeticky vztažnou plochu nad 250 m².', law: LAW.penb, href: '/penb/bytove-domy-a-verejne-budovy/', svc: 'PENB' });
      else if (has('dotace') && (v.typ === 'bd' || v.typ === 'rd')) out.push({ st: 'maybe', t: 'Průkaz nebo renovační pas (NZÚ)', d: 'V programu Nová zelená úsporám je podkladem pro komplexní renovaci průkaz, pro dílčí renovaci renovační pas.', law: 'podmínky programu Nová zelená úsporám 2026', href: '/energeticke-poradenstvi/dotace-nzu/', svc: 'poradenství' });
      else if (v.situace) out.push({ st: 'no', t: 'Průkaz energetické náročnosti (PENB)', d: 'Z uvedených situací teď povinnost nevzniká. Vznikne při prodeji, pronájmu, stavbě nebo větší změně budovy.', law: LAW.penb, href: '/penb/' });
      if (has('dotace')) out.push({ st: 'maybe', t: 'Energetický posudek', d: 'U projektů úspor financovaných z veřejných programů je posudek povinný, pokud program nestanoví jinak. Ověříme podle podmínek konkrétní výzvy.', law: LAW.pos, href: '/energeticky-posudek/', svc: 'energetický posudek' });
    }
    var org = v.vlastnik;
    if ((org === 'firma' || org === 'ovm' || org === 'verejny') && v.spotreba) {
      var pub = org !== 'firma', sp = v.spotreba, a = null;
      if (sp === 'nevim') a = { st: 'maybe', d: pub ? 'Veřejný sektor má povinnost auditu nad 500 MWh průměrné roční spotřeby, nad 2 778 MWh jednou za 4 roky, nad 23 611 MWh certifikovaný systém hospodaření s energií.' : 'Podnikatel má povinnost auditu nad 2 778 MWh průměrné roční spotřeby skupiny (jednou za 4 roky), nad 23 611 MWh certifikovaný systém hospodaření s energií.' };
      else if (sp === 'nad') a = { st: 'yes', d: 'Nad 23 611 MWh je povinný certifikovaný systém hospodaření s energií.' };
      else if (sp === 'do23611') a = { st: 'yes', d: 'Nad 2 778 MWh je povinný energetický audit jednou za 4 roky.' };
      else if (sp === 'do2778' && pub) a = { st: 'yes', d: 'Veřejný sektor má povinnost energetického auditu už nad 500 MWh průměrné roční spotřeby.' };
      else a = { st: 'no', d: pub ? 'Pod 500 MWh povinnost auditu ve veřejném sektoru nevzniká.' : (sp === 'do200' ? 'Pod 200 MWh se povinnost na podnikatele nevztahuje.' : 'Pod 2 778 MWh povinnost auditu nevzniká.') };
      out.push({ st: a.st, t: 'Energetický audit / systém hospodaření s energií', d: a.d + ' Počítá se průměrná roční konečná spotřeba za poslední 3 kalendářní roky.', law: LAW.audit, href: pub ? '/energeticky-audit/obce/' : '/energeticky-audit/', svc: 'energetický audit' });
    }
    return out;
  }
  document.querySelectorAll('form[data-checker]').forEach(function (cf) {
    var out = cf.querySelector('.ck-result');
    cf.addEventListener('submit', function (e) { e.preventDefault(); });
    function upd() {
      var v = {};
      ['typ', 'teplo', 'klima', 'vlastnik', 'spotreba'].forEach(function (n) { var el = cf.querySelector('input[name="' + n + '"]:checked'); if (el) v[n] = el.value; });
      var sit = Array.prototype.map.call(cf.querySelectorAll('input[name="situace"]:checked'), function (x) { return x.value; });
      if (sit.length) v.situace = sit;
      var p = cf.querySelector('input[name="plocha250"]'); v.plocha250 = !!(p && p.checked);
      cf.querySelectorAll('[data-show-for]').forEach(function (el) { el.hidden = !v.vlastnik || el.getAttribute('data-show-for').split(' ').indexOf(v.vlastnik) < 0; });
      if (v.vlastnik !== 'ovm' && p) p.checked = false;
      var items = ckEval(v);
      if (!items.length) { out.innerHTML = '<p class="ck-empty">Odpovězte na otázky – přehled povinností se sestaví průběžně.</p>'; return; }
      var order = { yes: 0, maybe: 1, no: 2 };
      items.sort(function (a, b) { return order[a.st] - order[b.st]; });
      var first = items.filter(function (x) { return x.st !== 'no' && x.svc; })[0];
      var svcs = items.filter(function (x) { return x.st !== 'no'; }).map(function (x) { return x.t; });
      var summary = 'Ověření povinností: ' + (svcs.length ? svcs.join(', ') : 'žádná povinnost z vybraných');
      store.set('sessionStorage', 'mk_test', summary);
      var orgMap = { svj: 'SVJ / bytové družstvo', ovm: 'obec / škola / veřejná instituce', verejny: 'obec / škola / veřejná instituce', firma: 'firma' };
      var q = '?sluzba=' + encodeURIComponent(first ? (svcs.length > 1 ? 'péče o budovy' : first.svc) : 'nevím') + (v.vlastnik ? '&org=' + encodeURIComponent(orgMap[v.vlastnik]) : '');
      out.innerHTML = '<p class="kick">Výsledek</p><ul class="ck-list" role="list">' + items.map(function (x) {
        return '<li class="ck-item is-' + x.st + '"><h3><span>' + x.t + '</span><span class="ck-tag">' + TAG[x.st] + '</span></h3><p>' + x.d + '</p><p class="ck-law">' + x.law + ' · <a href="' + x.href + '">Více o službě</a></p></li>';
      }).join('') + '</ul><div class="ck-actions"><a class="btn btn-primary" href="/kontakt/' + q + '#poptavka">Poptat zajištění</a><a class="btn btn-outline" href="/povinnosti-budov/#faq">Jak ověření funguje</a></div><p class="small">Orientační výsledek podle hlavních pravidel zákona č. 406/2000 Sb. Výjimky a zvláštní případy posoudíme individuálně.</p>';
      gtag('event', 'checker_result', { items: svcs.length });
    }
    cf.addEventListener('change', upd);
    upd();
  });

  // ---------- rozbalovací blok (ověření na úvodní stránce) ----------
  document.querySelectorAll('.collapse').forEach(function (box) {
    var btn = box.querySelector('.collapse-btn'), body = box.querySelector('.collapse-body');
    if (!btn || !body) return;
    function set(open) { box.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); body.inert = !open; }
    set(false);
    btn.addEventListener('click', function () { set(!box.classList.contains('is-open')); });
    if (location.hash === '#' + box.id) set(true);
  });
  // ---------- formuláře ----------
  function mailtoHref(form, data) {
    var subject = form.getAttribute('data-subject') || 'Poptávka';
    var labels = { jmeno: 'Jméno', organizace: 'Organizace', telefon: 'Telefon', email: 'E-mail', sluzba: 'Služba', typ_organizace: 'Kdo poptává', pocet_objektu: 'Počet objektů', lokalita: 'Lokalita', poznamka: 'Poznámka' };
    var lines = Object.keys(labels).filter(function (k) { return data[k]; }).map(function (k) { return labels[k] + ': ' + data[k]; });
    return (MK.email ? 'mailto:' + MK.email : '') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
  }
  /** telefon → E.164 (výchozí předvolba +420) */
  function toE164(v) {
    if (!v) return '';
    var s = String(v).replace(/[^\d+]/g, '');
    if (s.indexOf('00') === 0) s = '+' + s.slice(2);
    if (s.charAt(0) !== '+') {
      if (s.length === 9) s = '+420' + s;
      else if (s.length === 12 && s.indexOf('420') === 0) s = '+' + s;
      else return '';
    }
    return /^\+\d{8,15}$/.test(s) ? s : '';
  }
  function fieldError(el, msg) {
    var box = el.closest('.field');
    if (!box) return;
    var err = box.querySelector('.field-error');
    if (!err) { err = document.createElement('p'); err.className = 'field-error'; err.id = el.id + '-err'; box.appendChild(err); }
    err.textContent = msg || '';
    err.hidden = !msg;
    if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', err.id); }
    else { el.removeAttribute('aria-invalid'); }
  }
  function validate(form) {
    var first = null;
    var check = function (el, msg) { fieldError(el, msg); if (msg && !first) first = el; };
    var f = form.elements;
    check(f.jmeno, f.jmeno.value.trim().length < 2 ? 'Vyplňte prosím jméno.' : '');
    var digits = (f.telefon.value.match(/\d/g) || []).length;
    check(f.telefon, f.telefon.value.trim() && digits < 9 ? 'Zadejte telefon (alespoň 9 číslic), nebo pole nechte prázdné.' : '');
    check(f.email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()) ? 'Zadejte platný e-mail.' : '');
    var gdpr = f.souhlas;
    var gdprMsg = gdpr.checked ? '' : 'Pro odeslání je potřeba souhlas se zpracováním údajů.';
    var gbox = gdpr.closest('.field-check');
    var gerr = gbox.querySelector('.field-error');
    if (!gerr) { gerr = document.createElement('p'); gerr.className = 'field-error'; gerr.id = gdpr.id + '-err'; gbox.appendChild(gerr); }
    gerr.textContent = gdprMsg; gerr.hidden = !gdprMsg;
    if (gdprMsg) { gdpr.setAttribute('aria-invalid', 'true'); gdpr.setAttribute('aria-describedby', gerr.id); if (!first) first = gdpr; } else gdpr.removeAttribute('aria-invalid');
    return first;
  }
  document.querySelectorAll('form.lead-form').forEach(function (form) {
    form.setAttribute('novalidate', '');
    var testRes = store.get('sessionStorage', 'mk_test');
    if (testRes && form.elements.vysledek_testu) {
      form.elements.vysledek_testu.value = testRes;
      var tn = form.querySelector('.form-testnote');
      if (tn) { tn.textContent = 'K poptávce přiložím výsledek: ' + testRes; tn.hidden = false; }
    }
    // předvyplnění z ověření povinností (?sluzba=&org=)
    var setSel = function (el, val) { if (!el || !val) return; for (var i = 0; i < el.options.length; i++) if (el.options[i].value === val) { el.value = val; return; } };
    if (params.get('sluzba')) setSel(form.elements.sluzba, params.get('sluzba'));
    if (params.get('org')) setSel(form.elements.typ_organizace, params.get('org'));
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) fieldError(e.target, ''); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      var btn = form.querySelector('button[type="submit"]');
      var bad = validate(form);
      if (bad) {
        status.className = 'form-status is-error';
        status.textContent = 'Zkontrolujte prosím zvýrazněná pole.';
        bad.focus();
        return;
      }
      // skrytá pole: atribuce jen se souhlasem, stránka formuláře vždy
      var attr = attrForForm();
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'vstupni_stranka', 'referrer'].forEach(function (k) {
        if (form.elements[k]) form.elements[k].value = attr[k] || '';
      });
      if (form.elements.stranka_formulare) form.elements.stranka_formulare.value = location.pathname;
      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { if (v !== '') data[k] = v; });
      if (data.botcheck) { location.href = '/dekujeme/'; return; } // spam – tiše ukončit bez konverze
      delete data.botcheck;
      btn.disabled = true;
      status.className = 'form-status';
      status.textContent = 'Odesílám…';
      function markLead() {
        store.set('sessionStorage', 'mk_lead', 'L' + Date.now());
        if (consentNow && consentNow.ads) {
          var ud = {};
          if (data.email) ud.email = String(data.email).trim().toLowerCase();
          var ph = toE164(data.telefon);
          if (ph) ud.phone_number = ph;
          store.set('sessionStorage', 'mk_ud', JSON.stringify(ud));
        }
      }
      function fail() {
        btn.disabled = false;
        status.className = 'form-status is-error';
        status.innerHTML = 'Formulář se nepodařilo odeslat. Zkuste to prosím za chvíli znovu' + (MK.email ? ', nebo poptávku <a href="' + mailtoHref(form, data) + '">pošlete e-mailem</a> (otevře se předvyplněná zpráva)' : '') + (MK.phone ? ', případně zavolejte na <a href="tel:' + MK.phone.replace(/\s/g, '') + '">' + MK.phone + '</a>' : '') + '.';
      }
      var payload = {};
      Object.keys(data).forEach(function (k) { if (k !== 'redirect') payload[k] = data[k]; });
      // Web3Forms JSON API (podporuje CORS); při síťové chybě klasické odeslání formuláře s přesměrováním.
      fetch(form.getAttribute('data-ajax') || form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      }).then(function (r) {
        return r.json().catch(function () { return { success: false }; });
      }).then(function (res) {
        if (res && res.success) { markLead(); location.href = '/dekujeme/'; }
        else fail();
      }, function () {
        try { markLead(); HTMLFormElement.prototype.submit.call(form); }
        catch (err) { store.del('sessionStorage', 'mk_lead'); fail(); }
      });
    });
  });

  // ---------- konverze na /dekujeme/ ----------
  if (document.querySelector('[data-conversion="form"]')) {
    var lead = store.get('sessionStorage', 'mk_lead');
    if (lead) {
      // rozšířené konverze: user_data jen se souhlasem s reklamními cookies; po použití smazat
      var ud = null;
      try { ud = JSON.parse(store.get('sessionStorage', 'mk_ud')); } catch (e) {}
      store.del('sessionStorage', 'mk_ud');
      if (ud && consentNow && consentNow.ads) gtag('set', 'user_data', ud);
      track('generate_lead', { transaction_id: lead }, MK.convForm, 'SubmitApplication', MK.convFormValue);
      store.del('sessionStorage', 'mk_lead');
    }
  }

  // ---------- hlavička: stín po odscrollování ----------
  (function () {
    var h = document.querySelector('.site-header');
    if (!h) return;
    var on = function () { h.classList.toggle('is-scrolled', window.scrollY > 8); };
    on(); window.addEventListener('scroll', on, { passive: true });
  })();

  // ---------- odkrývání sekcí a počítadla ----------
  (function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var els = document.querySelectorAll('.reveal');
    var counters = document.querySelectorAll('[data-count]');
    function count(el) {
      var to = parseFloat(el.getAttribute('data-count')); var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.querySelector('small'); var sfx = suffix ? suffix.outerHTML : '';
      if (reduce) return;
      var t0 = null, dur = 1400;
      function step(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur); var e = 1 - Math.pow(1 - p, 3);
        el.innerHTML = (to * e).toFixed(dec).replace('.', ',') + sfx; if (p < 1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    }
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); en.target.querySelectorAll && en.target.querySelectorAll('[data-count]').forEach(count); if (en.target.hasAttribute('data-count')) count(en.target); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    counters.forEach(function (c) { if (!c.closest('.reveal')) io.observe(c); });
  })();

})();

/* Lišta: světlé sklo nad světlým obsahem, tmavé nad tmavým (úvod, tmavé sekce, patička). */
(function () {
  var header = document.querySelector('.site-header');
  if (!header || !document.elementFromPoint) return;
  var DARK = '.hero, .page-hero, .section-dark, .site-footer, .cta-band, .main-nav.is-open';
  var ticking = false;
  function update() {
    ticking = false;
    var y = header.offsetHeight + 2;
    var el = document.elementFromPoint(Math.min(40, window.innerWidth / 2), y);
    var light = !!el && !el.closest(DARK) && !el.closest('.site-header');
    header.classList.toggle('is-light', light);
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  window.addEventListener('load', update);
  update();
})();

