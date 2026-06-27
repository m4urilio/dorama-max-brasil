document.addEventListener('DOMContentLoaded', function() {
  // Tracking seguro
  function trackEvent(name) {
    try { if (window.fbq) fbq('track', name); } catch(e) {}
  }

  // Video lazy load - thumbnail clicável
  var videoContainer = document.getElementById('video-container');
  if (videoContainer) {
    var videoLoaded = false;
    function loadVideo(e) {
      if (videoLoaded) return;
      videoLoaded = true;
      if (e) e.preventDefault();
      videoContainer.innerHTML =
        '<iframe src="https://player.vimeo.com/video/1205137029?title=0&byline=0&portrait=0" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>';
    }
    videoContainer.addEventListener('click', loadVideo);
    videoContainer.addEventListener('touchend', loadVideo);
  }

  // Plim sound
  function playPlim() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch(e) {}
  }

  // Modal
  var openBtn = document.getElementById('open-modal');
  var overlay = document.getElementById('modal-overlay');
  var closeBtn = document.getElementById('modal-close');
  if (openBtn && overlay) {
    openBtn.addEventListener('click', function() {
      trackEvent('InitiateCheckout');
      overlay.classList.add('active');
      playPlim();
    });
    closeBtn.addEventListener('click', function() { overlay.classList.remove('active'); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('active'); });
  }

  // FAQ
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(el) { el.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });

  // Carousel
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots = document.getElementById('carousel-dots');
  var cur = 0;
  if (slides.length > 0 && dots) {
    slides.forEach(function(_, i) {
      var d = document.createElement('span');
      d.classList.add('dot');
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', function() { go(i); });
      dots.appendChild(d);
    });
    function go(i) {
      slides[cur].classList.remove('active');
      dots.children[cur].classList.remove('active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('active');
      dots.children[cur].classList.add('active');
    }
    document.getElementById('prev-btn').addEventListener('click', function() { go(cur - 1); });
    document.getElementById('next-btn').addEventListener('click', function() { go(cur + 1); });
    setInterval(function() { go(cur + 1); }, 5000);
  }

  // Hero cover click
  var heroCover = document.getElementById('hero-cover-btn');
  if (heroCover) {
    heroCover.addEventListener('click', function() {
      trackEvent('InitiateCheckout');
      document.getElementById('modal-overlay').classList.add('active');
      playPlim();
    });
  }

  // Sticky CTA
  document.getElementById('sticky-btn').addEventListener('click', function() {
    trackEvent('InitiateCheckout');
    document.getElementById('modal-overlay').classList.add('active');
    playPlim();
  });

  // Exit intent mobile
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      setTimeout(function() {
        if (document.visibilityState === 'visible') {
          document.getElementById('modal-overlay').classList.add('active');
          playPlim();
        }
      }, 100);
    }
  });

  // Terms modal
  var termsBtn = document.getElementById('open-terms');
  var termsOverlay = document.getElementById('terms-overlay');
  var acceptBtn = document.getElementById('accept-terms');
  if (termsBtn && termsOverlay) {
    termsBtn.addEventListener('click', function() { termsOverlay.classList.add('active'); });
    acceptBtn.addEventListener('click', function() { termsOverlay.classList.remove('active'); });
    termsOverlay.addEventListener('click', function(e) { if (e.target === termsOverlay) termsOverlay.classList.remove('active'); });
  }

  // UTM passthrough
  var params = new URLSearchParams(window.location.search);
  var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src'];
  document.querySelectorAll('.modal-btn-premium, .modal-btn-basic').forEach(function(link) {
    var url = new URL(link.href);
    keys.forEach(function(k) { if (params.get(k)) url.searchParams.set(k, params.get(k)); });
    link.href = url.toString();
  });

});
