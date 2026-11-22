(function(){
  "use strict";
  document.documentElement.classList.add('js');

  var DICT = window.FERTON_I18N || {};
  var LANGS = ['uz','ru','en','tr'];
  var lang = 'uz';

  /* ---------- I18N ---------- */
  // Uzbek strings are taken from the HTML itself, so the page works without JS too.
  var i18nEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var phEls = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-ph]'));
  DICT.uz = DICT.uz || {};
  i18nEls.forEach(function(el){
    var k = el.getAttribute('data-i18n');
    if(DICT.uz[k] === undefined) DICT.uz[k] = el.innerHTML.trim();
  });
  phEls.forEach(function(el){
    var k = el.getAttribute('data-i18n-ph');
    if(DICT.uz[k] === undefined) DICT.uz[k] = el.getAttribute('placeholder') || '';
  });

  function t(key){
    var d = DICT[lang] || {};
    return d[key] !== undefined ? d[key] : (DICT.uz[key] !== undefined ? DICT.uz[key] : key);
  }

  var langButtons = document.querySelectorAll('.lang-switch button');
  function applyLang(next){
    lang = LANGS.indexOf(next) > -1 ? next : 'uz';
    i18nEls.forEach(function(el){ el.innerHTML = t(el.getAttribute('data-i18n')); });
    phEls.forEach(function(el){ el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    langButtons.forEach(function(b){
      var on = b.dataset.lang === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.documentElement.setAttribute('lang', lang);
    document.title = t('meta.title');
    var md = document.querySelector('meta[name="description"]');
    if(md) md.setAttribute('content', t('meta.desc'));
    try{ localStorage.setItem('ferton_lang', lang); }catch(e){}
    calc();
  }
  langButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      applyLang(btn.dataset.lang);
      try{
        var u = new URL(location.href); u.searchParams.set('lang', lang);
        history.replaceState(null, '', u.toString());
      }catch(e){}
    });
  });

  function initialLang(){
    try{
      var q = new URLSearchParams(location.search).get('lang');
      if(q && LANGS.indexOf(q) > -1) return q;
    }catch(e){}
    try{
      var s = localStorage.getItem('ferton_lang');
      if(s && LANGS.indexOf(s) > -1) return s;
    }catch(e){}
    var nav = (navigator.language || '').slice(0,2).toLowerCase();
    if(nav === 'ru') return 'ru';
    if(nav === 'tr') return 'tr';
    return 'uz';
  }

  /* ---------- NUMBERS ---------- */
  function fmt(n, digits){
    var locale = lang === 'en' ? 'en-US' : 'ru-RU';
    return Number(n).toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: digits || 0 }).replace(/ /g, ' ');
  }
  function num(id){
    var v = parseFloat(String(document.getElementById(id).value).replace(',', '.'));
    return isFinite(v) && v > 0 ? v : 0;
  }

  /* ---------- CALCULATOR ---------- */
  var BLOCK_FACE = 0.6 * 0.3;     // m² of wall per block
  var AAC_DENSITY = 500;          // kg/m³, D500 (dry)
  var GLUE_PER_M3 = 25;           // kg of thin-bed adhesive per m³ of masonry
  var BRICKS_PER_M3 = 394;        // 250×120×65 brick incl. 10 mm mortar joints
  var BRICK_DENSITY = 1800;       // kg/m³ of brick masonry
  var last = null;

  function el(id){ return document.getElementById(id); }
  function setOut(id, v){ var o = el(id); if(o) o.textContent = v; }

  function calc(){
    if(!el('calcForm')) return;
    var len = num('cLen'), h = num('cHeight'), open = num('cOpen');
    var checked = document.querySelector('#cThick input:checked');
    var th = checked ? parseInt(checked.value, 10) : 250;
    var reserve = el('cReserve').checked ? 1.05 : 1;

    var area = Math.max(len * h - open, 0);
    var wallVol = area * th / 1000;
    var blocks = Math.ceil(area / BLOCK_FACE * reserve);
    var orderVol = blocks * BLOCK_FACE * th / 1000;
    var glueBags = Math.ceil(wallVol * GLUE_PER_M3 / 25);
    var aacT = wallVol * AAC_DENSITY / 1000;
    var bricks = Math.ceil(wallVol * BRICKS_PER_M3);
    var brickT = wallVol * BRICK_DENSITY / 1000;

    setOut('rBlocks', fmt(blocks));
    setOut('rArea', fmt(area, 1));
    setOut('rVolume', fmt(orderVol, 2));
    setOut('rGlue', fmt(glueBags));
    setOut('rWeight', fmt(aacT, 1));
    setOut('vAacCount', fmt(blocks));
    setOut('vBrickCount', fmt(bricks));
    setOut('vBrickWeight', fmt(brickT, 1));
    setOut('vLighter', fmt(BRICK_DENSITY / AAC_DENSITY, 1));

    var max = Math.max(blocks, bricks, 1);
    el('barAac').style.width = (blocks ? Math.max(blocks / max * 100, 1.5) : 0) + '%';
    el('barBrick').style.width = (bricks ? bricks / max * 100 : 0) + '%';

    last = { len: len, h: h, open: open, th: th, blocks: blocks, vol: orderVol };
  }

  var calcForm = el('calcForm');
  if(calcForm){
    calcForm.addEventListener('input', calc);
    calcForm.addEventListener('change', calc);
    calcForm.addEventListener('submit', function(e){ e.preventDefault(); });
  }

  var toOrder = el('calcToOrder');
  if(toOrder){
    toOrder.addEventListener('click', function(){
      if(!last) calc();
      var sel = el('fProduct');
      if(sel){ sel.value = String(last.th); }
      el('fQty').value = t('calc.qtyFmt').replace('{vol}', fmt(last.vol, 2)).replace('{blocks}', fmt(last.blocks));
      el('fMsg').value = t('calc.note')
        .replace('{len}', fmt(last.len, 1)).replace('{h}', fmt(last.h, 1))
        .replace('{open}', fmt(last.open, 1)).replace('{t}', last.th);
      el('aloqa').scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(function(){ el('fName').focus({ preventScroll: true }); }, 600);
    });
  }

  /* ---------- ORDER FORM (Netlify Forms) ---------- */
  var form = el('orderForm');
  var status = el('formStatus');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = el('fName').value.trim();
      var phone = el('fPhone').value.trim();
      status.className = 'form-status';
      if(!name || phone.replace(/\D/g, '').length < 9){
        status.classList.add('err');
        status.innerHTML = t('form.invalid');
        (name ? el('fPhone') : el('fName')).focus();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      status.textContent = t('form.sending');

      var data = new URLSearchParams(new FormData(form));
      data.append('language', lang);

      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() })
        .then(function(r){
          if(!r.ok) throw new Error('HTTP ' + r.status);
          status.classList.add('ok');
          status.innerHTML = t('form.ok');
          form.reset();
        })
        .catch(function(){
          status.classList.add('err');
          status.innerHTML = t('form.err');
        })
        .then(function(){ btn.disabled = false; });
    });
  }

  /* ---------- MOBILE NAV ---------- */
  var navToggle = el('navToggle');
  var mainNav = el('mainNav');
  function closeNav(){ mainNav.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
  if(navToggle){
    navToggle.addEventListener('click', function(){
      var open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mainNav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeNav(); });
  }

  /* ---------- HEADER / MOBILE BAR / ACTIVE NAV ---------- */
  var header = document.querySelector('.site-header');
  var mobileBar = document.querySelector('.mobile-bar');
  function onScroll(){
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    if(mobileBar) mobileBar.classList.toggle('show', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  if('IntersectionObserver' in window){
    var sectionObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = entry.target.id;
          navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function(a){
      var s = document.querySelector(a.getAttribute('href'));
      if(s) sectionObs.observe(s);
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll('.benefit-card, .size-card, .calc, .process li, .factory-grid figure, .cert-grid > *, .steps li, .faq details');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function(r){ r.setAttribute('data-reveal', ''); io.observe(r); });
  }

  /* ---------- MISC ---------- */
  var y = el('year'); if(y) y.textContent = new Date().getFullYear();

  applyLang(initialLang());
})();
