// Ren Garing portfolio interactions: live clock, mobile menu, active nav and reveal animations.
(function () {
  const clock = document.getElementById('liveClock');
  function updateClock() {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).format(new Date());
  }
  updateClock();
  window.setInterval(updateClock, 1000);

  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
      toggle.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation');
        toggle.textContent = '☰';
      });
    });
  }

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav a'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    sections.forEach(function (section) { observer.observe(section); });

    const revealObserver = new IntersectionObserver(function (entries, observerRef) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerRef.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  // Replace the placeholder Facebook URLs in index.html with Ren's actual profile link.
  // No real Facebook profile URL or email was provided, so this template does not invent one.

  // Photo preview modal with previous/next and keyboard navigation.
  const photoButtons = Array.from(document.querySelectorAll('.photo-card'));
  const modal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeButton = document.getElementById('modalClose');
  const prevButton = document.getElementById('modalPrev');
  const nextButton = document.getElementById('modalNext');
  const galleryPhotos = photoButtons.map(button => ({
    src: button.querySelector('img').getAttribute('src'),
    alt: button.querySelector('img').getAttribute('alt'),
    label: button.querySelector('span').textContent
  }));
  let currentPhoto = 0;
  let lastFocusedElement = null;
  function showPhoto(index) {
    if (!galleryPhotos.length) return;
    currentPhoto = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[currentPhoto];
    modalImage.src = photo.src;
    modalImage.alt = photo.alt;
    modalCaption.textContent = photo.label + ' / ' + (currentPhoto + 1) + ' OF ' + galleryPhotos.length;
  }
  function openPhoto(index) {
    lastFocusedElement = document.activeElement;
    showPhoto(index);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeButton.focus();
  }
  function closePhoto() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocusedElement) lastFocusedElement.focus();
  }
  photoButtons.forEach((button, index) => button.addEventListener('click', () => openPhoto(index)));
  closeButton.addEventListener('click', closePhoto);
  prevButton.addEventListener('click', () => showPhoto(currentPhoto - 1));
  nextButton.addEventListener('click', () => showPhoto(currentPhoto + 1));
  modal.addEventListener('click', event => { if (event.target === modal) closePhoto(); });
  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('open')) return;
    if (event.key === 'Escape') closePhoto();
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });

})();