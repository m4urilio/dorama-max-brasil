// ============================================================
// CONFIGURACAO - Altere aqui para personalizar a landing page
// ============================================================
const CONFIG = {
  // Tipo de video: 'youtube' | 'iframe' | 'html5'
  // youtube = detecta fim do video automaticamente via API
  // iframe  = embed generico, mostra CTA apos X segundos
  // html5   = tag <video>, detecta fim automaticamente
  mode: 'youtube',

  // ID do video do YouTube (ex: 'dQw4w9WgXcQ')
  youtubeId: 'SEU_VIDEO_ID_AQUI',

  // URL do iframe (usado se mode = 'iframe')
  iframeUrl: '',

  // Segundos para revelar CTA (usado se mode = 'iframe')
  revealDelay: 180,

  // Duracao do countdown em minutos
  countdownMinutes: 20,

  // Link de compra (substitua pelo seu link real)
  purchaseUrl: '#',
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
// VIDEO
// ============================================================
function setupVideo() {
  const container = document.getElementById('player');
  if (!container) return;

  if (CONFIG.mode === 'youtube') {
    loadYouTubeAPI();
  } else if (CONFIG.mode === 'iframe') {
    loadGenericIframe(container);
  } else if (CONFIG.mode === 'html5') {
    loadHTML5Video(container);
  }
}

// --- YouTube ---
function loadYouTubeAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

// Callback global exigido pela YouTube IFrame API
window.onYouTubeIframeAPIReady = function () {
  new YT.Player('player', {
    videoId: CONFIG.youtubeId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onStateChange: function (event) {
        if (event.data === YT.PlayerState.ENDED) {
          onVideoEnd();
        }
      },
    },
  });
};

// --- Iframe generico ---
function loadGenericIframe(container) {
  if (!CONFIG.iframeUrl) {
    container.innerHTML = '<div class="video-placeholder">Configure o link do video em script.js</div>';
    return;
  }
  const iframe = document.createElement('iframe');
  iframe.src = CONFIG.iframeUrl;
  iframe.allow = 'autoplay; fullscreen';
  iframe.allowFullscreen = true;
  container.replaceWith(iframe);

  setTimeout(() => onVideoEnd(), CONFIG.revealDelay * 1000);
}

// --- HTML5 Video ---
function loadHTML5Video(container) {
  container.innerHTML = '<div class="video-placeholder">Configure o video em script.js</div>';
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

  timerBar.classList.add('visible');
  document.body.classList.add('timer-active');

  allCTAs.forEach((btn, i) => {
    setTimeout(() => {
      btn.classList.remove('cta-hidden');
      btn.classList.add('cta-visible');
    }, i * 200);
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
    if (btn.getAttribute('href') === '#' || btn.getAttribute('href') === '#plans') {
      if (btn.id !== 'cta-hero') {
        btn.setAttribute('href', CONFIG.purchaseUrl);
      }
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
