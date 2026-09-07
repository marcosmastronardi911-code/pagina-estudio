/* =========================================================
   Estudio David Oliva y Asociados — script.js
   1. Datos de contacto  2. Menú  3. Scroll  4. Acordeón
   5. Reveal  6. Año del pie  7. Solapas por tipo de caso
   ========================================================= */

/* ---------- 1. DATOS DE CONTACTO ---------- */
/* Cambiar por los datos reales. El WhatsApp va sin +, sin 0 y sin 15. */
const WHATSAPP = '5491136883768';
const EMAIL    = 'estudiodolivaa@gmail.com';

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 2. MENÚ MÓVIL ---------- */
  const head   = document.getElementById('head');
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('nav');

  const cerrarMenu = () => {
    nav.classList.remove('abierto');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-abierto');
  };

  toggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', String(abierto));
    document.body.classList.toggle('nav-abierto', abierto);
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('abierto')) {
      cerrarMenu();
      toggle.focus();
    }
  });

  // Al pasar a escritorio, se descarta el estado del menú móvil
  window.matchMedia('(min-width: 960px)').addEventListener('change', cerrarMenu);

  /* ---------- 3. SCROLL: header compacto + link activo ---------- */
  const secciones = [...document.querySelectorAll('main section[id]')];
  const enlaces   = [...nav.querySelectorAll('a[href^="#"]')];

  const alScrollear = () => {
    head.classList.toggle('compacta', window.scrollY > 24);

    const y = window.scrollY + window.innerHeight * 0.3;
    let actual = '';
    secciones.forEach(s => { if (s.offsetTop <= y) actual = s.id; });
    enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + actual));
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { alScrollear(); ticking = false; });
  }, { passive: true });
  alScrollear();

  /* ---------- 4. ACORDEÓN DE PREGUNTAS ---------- */
  /* Se busca por clase: una página puede tener más de un acordeón
     (por ejemplo, parte actora y parte demandada). */
  document.querySelectorAll('.acordeon .item').forEach(item => {
    const boton     = item.querySelector('.item-q');
    const respuesta = item.querySelector('.item-a');
    const grupo     = item.closest('.acordeon');

    boton.addEventListener('click', () => {
      const abierto = item.classList.contains('abierto');

      // Se cierra el resto del mismo grupo: una sola respuesta a la vista
      grupo.querySelectorAll('.item.abierto').forEach(otro => {
        otro.classList.remove('abierto');
        otro.querySelector('.item-q').setAttribute('aria-expanded', 'false');
        otro.querySelector('.item-a').style.maxHeight = null;
      });

      if (!abierto) {
        item.classList.add('abierto');
        boton.setAttribute('aria-expanded', 'true');
        respuesta.style.maxHeight = respuesta.scrollHeight + 'px';
      }
    });
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.acordeon .item.abierto .item-a').forEach(abierta => {
      abierta.style.maxHeight = abierta.scrollHeight + 'px';
    });
  });

  /* ---------- 5. APARICIÓN AL HACER SCROLL ---------- */
  const bloques = document.querySelectorAll('.reveal');
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (sinMovimiento || !('IntersectionObserver' in window)) {
    bloques.forEach(b => b.classList.add('visible'));
  } else {
    const obs = new IntersectionObserver((entradas, o) => {
      entradas.forEach((entrada, i) => {
        if (!entrada.isIntersecting) return;
        setTimeout(() => entrada.target.classList.add('visible'), i * 70);
        o.unobserve(entrada.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    bloques.forEach(b => obs.observe(b));
  }

  /* ---------- 6. AÑO DEL PIE ---------- */
  document.getElementById('anio').textContent = new Date().getFullYear();

  /* ---------- 7. SOLAPAS POR TIPO DE CASO ---------- */
  const fichas = document.querySelector('.fichas');
  if (fichas) {
    const solapas = [...fichas.querySelectorAll('.fichas-tab')];
    const paneles = [...fichas.querySelectorAll('.fichas-panel')];

    const mostrar = (i, mover = true) => {
      solapas.forEach((solapa, j) => {
        const activa = i === j;
        solapa.setAttribute('aria-selected', String(activa));
        solapa.tabIndex = activa ? 0 : -1;
        paneles[j].hidden = !activa;
      });
      if (mover) {
        solapas[i].focus();
        solapas[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };

    solapas.forEach((solapa, i) => {
      solapa.addEventListener('click', () => mostrar(i, false));

      // Flechas, Inicio y Fin, como corresponde a un grupo de solapas
      solapa.addEventListener('keydown', e => {
        const teclas = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: solapas.length - 1 };
        if (!(e.key in teclas)) return;
        e.preventDefault();
        mostrar((teclas[e.key] + solapas.length) % solapas.length);
      });
    });

    mostrar(0, false);
  }
});
