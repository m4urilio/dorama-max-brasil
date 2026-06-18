// ============================================================
// CONFIGURACAO - Altere aqui para personalizar a landing page
// ============================================================
const CONFIG = {
  // Duracao do countdown em minutos
  countdownMinutes: 20,

  // Link de compra
  purchaseUrl: 'https://pay.lowify.com.br/checkout?product_id=EyMs5r',
};

// ============================================================
// ESTADO
// ============================================================
let videoEnded = false;
let countdownInterval = null;

// ============================================================
// INICIALIZACAO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setupPurchaseLinks();
  setupFAQ();
  setupCarousel();
  checkSavedState();
  setupVideo();
});

// ============================================================
// VIDEO (Vimeo Player API)
// ============================================================
function setupVideo() {
  const iframe = document.getElementById('vimeo-player');
  if (!iframe) return;

  const player = new Vimeo.Player(iframe);
  player.on('ended', () => onVideoEnd());
}

// ============================================================
// REVELACAO DO CTA + TIMER
// ============================================================
function onVideoEnd() {
  if (videoEnded) return;
  videoEnded = true;

  localStorage.setItem('dmb_video_ended', 'true');
  localStorage.setItem('dmb_countdown_start', Date.now().toString());

  revealCTA();
  startCountdown();
}

function revealCTA() {
  const timerBar = document.getElementById('timer-bar');
  const allCTAs = document.querySelectorAll('.cta-hidden');
  const hiddenSections = document.querySelectorAll('.content-hidden');

  timerBar.classList.add('visible');
  document.body.classList.add('timer-active');

  // Revela as secoes escondidas com stagger
  hiddenSections.forEach((section, i) => {
    setTimeout(() => {
      section.classList.remove('content-hidden');
      section.classList.add('content-visible');
    }, i * 150);
  });

  // Revela os CTAs apos as secoes
  const ctaDelay = hiddenSections.length * 150;
  allCTAs.forEach((btn, i) => {
    setTimeout(() => {
      btn.classList.remove('cta-hidden');
      btn.classList.add('cta-visible');
    }, ctaDelay + i * 200);
  });
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function startCountdown() {
  const display = document.getElementById('countdown');
  const startTime = parseInt(localStorage.getItem('dmb_countdown_start'), 10);
  const totalMs = CONFIG.countdownMinutes * 60 * 1000;
  const endTime = startTime + totalMs;

  function tick() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      display.textContent = '00:00';
      clearInterval(countdownInterval);
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    display.textContent =
      String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

// ============================================================
// PERSISTENCIA (reload mantem estado)
// ============================================================
function checkSavedState() {
  const ended = localStorage.getItem('dmb_video_ended');
  const start = localStorage.getItem('dmb_countdown_start');

  if (ended === 'true' && start) {
    const totalMs = CONFIG.countdownMinutes * 60 * 1000;
    const elapsed = Date.now() - parseInt(start, 10);

    if (elapsed < totalMs) {
      videoEnded = true;
      revealCTA();
      startCountdown();
    } else {
      // Timer expirou, limpa estado
      localStorage.removeItem('dmb_video_ended');
      localStorage.removeItem('dmb_countdown_start');
    }
  }
}

// ============================================================
// PURCHASE LINKS
// ============================================================
function setupPurchaseLinks() {
  document.querySelectorAll('.btn-cta').forEach((btn) => {
    const href = btn.getAttribute('href');
    if (href === '#' || href === '#plans') {
      btn.setAttribute('href', CONFIG.purchaseUrl);
    }
  });
}

// ============================================================
// FAQ ACCORDION
// ============================================================
function setupFAQ() {
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Fecha todos
      document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('open'));

      // Abre o clicado (se nao estava aberto)
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

// ============================================================
// TESTIMONIAL CAROUSEL
// ============================================================
function setupCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let current = 0;

  if (slides.length === 0) return;

  // Cria dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play a cada 5s
  setInterval(() => goTo(current + 1), 5000);
}
