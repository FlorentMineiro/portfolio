document.addEventListener('DOMContentLoaded', function () {
  console.log('Script chargé !');
  
  const slider = document.querySelector('.media-slider');
  if (!slider) {
    console.log('Aucun slider trouvé sur cette page');
    return;
  }

  console.log('Slider trouvé :', slider);

  const track = slider.querySelector('.ms-track');
  const slides = Array.from(track.querySelectorAll('.ms-slide'));
  const prev = slider.querySelector('.ms-prev');
  const next = slider.querySelector('.ms-next');
  const dotsContainer = slider.querySelector('.ms-dots');

  console.log('Track:', track);
  console.log('Nombre de slides:', slides.length);
  console.log('Bouton prev:', prev);
  console.log('Bouton next:', next);

  if (!track || slides.length === 0 || !prev || !next || !dotsContainer) {
    console.error('Éléments manquants dans le slider');
    return;
  }

  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // Créer les dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'ms-dot';
    dot.type = 'button';
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i + 1));
    dot.addEventListener('click', () => {
      console.log('Clic sur dot', i);
      goTo(i);
    });
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  console.log('Dots créés:', dots.length);

  function update() {
    const width = track.clientWidth;
    console.log('Update: index =', index, ', width =', width);
    track.style.transition = 'transform 0.45s cubic-bezier(0.22, 0.9, 0.2, 1)';
    track.style.transform = `translateX(${-index * width}px)`;
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    console.log('GoTo:', index);
    update();
  }

  // Événements des boutons
  prev.addEventListener('click', () => {
    console.log('Clic sur prev');
    goTo(index - 1);
  });

  next.addEventListener('click', () => {
    console.log('Clic sur next');
    goTo(index + 1);
  });

  // Navigation clavier
  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
      console.log('Touche gauche');
      goTo(index - 1);
    }
    if (e.key === 'ArrowRight') {
      console.log('Touche droite');
      goTo(index + 1);
    }
  });
  slider.setAttribute('tabindex', '0');

  // Support touch / drag
  slides.forEach((slide, i) => {
    const media = slide.querySelector('img, video');
    if (media) media.addEventListener('dragstart', e => e.preventDefault());
    
    slide.addEventListener('pointerdown', pointerDown(i));
    slide.addEventListener('pointerup', pointerUp);
    slide.addEventListener('pointerleave', pointerUp);
    slide.addEventListener('pointermove', pointerMove);
  });

  function pointerDown(i) {
    return function (e) {
      isDragging = true;
      startX = e.clientX;
      slider.classList.add('grabbing');
      prevTranslate = currentTranslate;
      animationID = requestAnimationFrame(animation);
      console.log('Drag start');
    };
  }

  function pointerMove(e) {
    if (!isDragging) return;
    const currentX = e.clientX;
    const dx = currentX - startX;
    const width = track.clientWidth;
    currentTranslate = -index * width + dx;
  }

  function pointerUp() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    slider.classList.remove('grabbing');
    const width = track.clientWidth;
    const movedBy = currentTranslate + index * width;
    
    console.log('Drag end, movedBy:', movedBy);
    
    if (movedBy < -80) goTo(index + 1);
    else if (movedBy > 80) goTo(index - 1);
    else goTo(index);
  }

  function animation() {
    setTranslate(currentTranslate);
    if (isDragging) requestAnimationFrame(animation);
  }

  function setTranslate(x) {
    track.style.transition = 'none';
    track.style.transform = `translateX(${x}px)`;
  }

  // Resize observer
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log('Resize detected');
      update();
    }, 120);
  });

  // Initialisation
  console.log('Initialisation du slider');
  update();
});