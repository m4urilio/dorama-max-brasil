document.addEventListener('DOMContentLoaded', function() {
  // Countdown 19:32
  var display = document.getElementById('countdown');
  if (display) {
    var end = Date.now() + 19 * 60000 + 32 * 1000;
    setInterval(function() {
      var r = end - Date.now();
      if (r <= 0) { display.textContent = '00:00'; return; }
      display.textContent = String(Math.floor(r / 60000)).padStart(2, '0') + ':' + String(Math.floor((r % 60000) / 1000)).padStart(2, '0');
    }, 1000);
  }

  // Modal
  var openBtn = document.getElementById('open-modal');
  var overlay = document.getElementById('modal-overlay');
  var closeBtn = document.getElementById('modal-close');
  if (openBtn && overlay) {
    openBtn.addEventListener('click', function() {
      fbq('track', 'InitiateCheckout');
      overlay.classList.add('active');
    });
    closeBtn.addEventListener('click', function() { overlay.classList.remove('active'); });
    overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.classList.remove('active'); });
  }

  // Video lazy load
  var playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      document.getElementById('video-container').innerHTML =
        '<iframe src="https://player.vimeo.com/video/1202353342?autoplay=1&title=0&byline=0&portrait=0&badge=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    });
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

  // UTM passthrough
  var params = new URLSearchParams(window.location.search);
  var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src'];
  document.querySelectorAll('.modal-btn-premium, .modal-btn-basic').forEach(function(link) {
    var url = new URL(link.href);
    keys.forEach(function(k) { if (params.get(k)) url.searchParams.set(k, params.get(k)); });
    link.href = url.toString();
  });
});
