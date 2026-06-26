/* =============================================
   DUCA – INGLÊS DE BOA
   script.js – Interações e animações
   ============================================= */

'use strict';

/* ===== NAVBAR – scroll effect & mobile menu ===== */
const navbar   = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 24) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Fechar menu ao clicar num link
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      const top = target.getBoundingClientRect().top + window.pageYOffset - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== PROGRESS BAR ANIMATION ===== */
const progressFill = document.getElementById('progress-fill');
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        progressFill.style.width = '78%';
      }, 500);
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
if (progressFill) progressObserver.observe(progressFill);

/* ===== SCROLL REVEAL (Intersection Observer) ===== */
const revealElements = document.querySelectorAll(
  '.metodo-card, .dep-card, .plano-card, .sobre-list li, .faq-item, .contato-link-min'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on index among siblings
      const siblings = Array.from(entry.target.parentElement.children);
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Section headers & sobre items
document.querySelectorAll('.section-header, .sobre-content, .sobre-visual, .contato-content, .contato-form-wrap').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Fechar todos
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').style.maxHeight = '0';
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Abrir se estava fechado
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===== FORMULÁRIO DE CONTATO ===== */
const contactForm = document.getElementById('contato-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const nome  = document.getElementById('nome');
    const email = document.getElementById('email');
    let valid = true;

    // Validação básica
    [nome, email].forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.remove('error');
      }
    });

    if (email.value && !email.value.includes('@')) {
      email.classList.add('error');
      valid = false;
    }

    if (!valid) {
      // Bloqueia o envio só se inválido
      e.preventDefault();
      showToast('Preencha os campos obrigatórios antes de enviar.');
      return;
    }

    // Se válido: deixa o form submeter normalmente para o FormSubmit
    const submitBtn = document.getElementById('form-submit');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
  });

  // Remover erro ao digitar
  contactForm.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
}

/* ===== NEWSLETTER (Brevo — tratada nativamente) ===== */

/* ===== TOAST ===== */
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* ===== COUNTER ANIMATION para as stats ===== */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + (el.dataset.suffix || '');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

// Observar seção de stats
const heroStats = document.querySelector('.hero-stats');
let statsAnimated = false;
if (heroStats) {
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        const nums = [
          { el: heroStats.querySelectorAll('.stat-num')[0], val: 80,  suffix: '+' },
          { el: heroStats.querySelectorAll('.stat-num')[1], val: 4,   suffix: '+' },
          { el: heroStats.querySelectorAll('.stat-num')[2], val: 100, suffix: '%' },
        ];
        nums.forEach(({ el, val, suffix }) => {
          if (el) {
            el.dataset.suffix = suffix;
            animateCounter(el, val);
          }
        });
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

/* ===== EFEITO PARALLAX LEVE nos blobs ===== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.blob-1').forEach(b => {
    b.style.transform = `translateY(${scrollY * 0.15}px)`;
  });
  document.querySelectorAll('.blob-2').forEach(b => {
    b.style.transform = `translateY(${scrollY * -0.1}px)`;
  });
}, { passive: true });

/* ===== ACTIVE NAV LINK ao scroll ===== */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===== HOVER TILT nos cards de método ===== */
document.querySelectorAll('.metodo-card, .dep-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top  - rect.height / 2;
    const rx = (y / rect.height) * -8;
    const ry = (x / rect.width)  *  8;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .4s ease';
    setTimeout(() => card.style.transition = '', 400);
  });
});

/* ===== LOG inicial ===== */
console.log('%c🌎 Duca – Inglês de Boa', 'font-size:18px;font-weight:bold;color:#4F8EF7;');
console.log('%cSite desenvolvido com ❤️', 'color:#64748B;');
