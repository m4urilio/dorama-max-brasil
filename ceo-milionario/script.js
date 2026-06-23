// ============================================================
// INICIALIZACAO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  setupFAQ();
  setupCarousel();
  startCountdown();
  setupModal();
  setupVideoLazyLoad();
  appendUtmsToCheckout();
});

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function startCountdown() {
  const display = document.getElementById('countdown');
  const timerBar = document.getElementById('timer-bar');
  if (!display || !timerBar) return;

  timerBar.classList.add('visible');
  document.body.classList.add('timer-active');

  const totalMs = 19 * 60 * 1000 + 32 * 1000;
  const endTime = Date.now() + totalMs;

  function tick() {
    const remaining = endTime - Date.now();
    if (remaining <= 0) {
      display.textContent = '00:00';
      clearInterval(interval);
      return;
    }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    display.textContent =
      String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }

  tick();
  const interval = setInterval(tick, 1000);
}

// ============================================================
// MODAL UPGRADE
// ============================================================
function setupModal() {
  const openBtn = document.getElementById('open-modal');
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (!openBtn || !overlay) return;

  openBtn.addEventListener('click', () => {
    fbq('track', 'InitiateCheckout');
    overlay.classList.add('active');
  });
  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
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

// ============================================================
// VIDEO LAZY LOAD
// ============================================================
function setupVideoLazyLoad() {
  document.getElementById('play-btn').addEventListener('click', function() {
    document.getElementById('video-container').innerHTML =
      '<iframe src="https://player.vimeo.com/video/1202353342?autoplay=1&title=0&byline=0&portrait=0&badge=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
  });
}

// ============================================================
// UTM PASSTHROUGH
// ============================================================
function appendUtmsToCheckout() {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src'];
  const links = document.querySelectorAll('.modal-btn-premium, .modal-btn-basic');
  links.forEach(function(link) {
    const url = new URL(link.href);
    utmKeys.forEach(function(key) {
      if (params.get(key)) url.searchParams.set(key, params.get(key));
    });
    link.href = url.toString();
  });
}
