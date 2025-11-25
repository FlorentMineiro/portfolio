/**
 * Media Slider - Système de carousel responsive
 * Compatible avec plusieurs sliders sur une même page
 * Gère les images et vidéos avec navigation par flèches, dots et clavier
 * Version améliorée avec drag & drop et gestion vidéo
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 Media Slider - Initialisation...');
  
  // Initialiser tous les sliders présents sur la page
  const allSliders = document.querySelectorAll('.media-slider');
  
  if (allSliders.length === 0) {
    console.log('ℹ️ Aucun slider trouvé sur cette page');
    return;
  }

  allSliders.forEach((sliderElement, sliderIndex) => {
    initSlider(sliderElement, sliderIndex);
  });
  
  console.log(`✅ ${allSliders.length} slider(s) initialisé(s)`);
});

/**
 * Initialise un slider individuel
 * @param {HTMLElement} slider - Le conteneur .media-slider
 * @param {number} sliderIndex - Index du slider (pour les IDs uniques)
 */
function initSlider(slider, sliderIndex) {
  console.log(`🎯 Initialisation du slider #${sliderIndex}`, slider);

  // Récupération des éléments DOM
  const track = slider.querySelector('.ms-track');
  const slides = Array.from(track?.querySelectorAll('.ms-slide') || []);
  const prev = slider.querySelector('.ms-prev');
  const next = slider.querySelector('.ms-next');
  const dotsContainer = slider.querySelector('.ms-dots');

  // Vérifications de sécurité
  if (!track || slides.length === 0) {
    console.error('❌ Slider mal configuré:', slider);
    return;
  }

  // État du slider
  let index = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  // ==========================================
  // CRÉATION DES DOTS
  // ==========================================
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'ms-dot';
      dot.type = 'button';
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.setAttribute('aria-label', `Aller à la slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }
  const dots = Array.from(dotsContainer?.children || []);

  // ==========================================
  // FONCTION PRINCIPALE DE NAVIGATION
  // ==========================================
  function update() {
    const width = track.clientWidth;
    track.style.transition = 'transform 0.45s cubic-bezier(0.22, 0.9, 0.2, 1)';
    track.style.transform = `translateX(${-index * width}px)`;
    
    // Mettre à jour les dots
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
    
    // Mettre à jour l'état des boutons
    updateButtonStates();
    
    // Pause des vidéos
    pauseAllVideos();
  }

  function goTo(i) {
    if (isDragging) return;
    index = Math.max(0, Math.min(i, slides.length - 1));
    currentTranslate = -index * track.clientWidth;
    prevTranslate = currentTranslate;
    update();
  }

  // ==========================================
  // GESTION DES BOUTONS
  // ==========================================
  function updateButtonStates() {
    if (prev) {
      prev.disabled = index === 0;
      prev.setAttribute('aria-disabled', index === 0 ? 'true' : 'false');
    }
    if (next) {
      next.disabled = index === slides.length - 1;
      next.setAttribute('aria-disabled', index === slides.length - 1 ? 'true' : 'false');
    }
  }

  if (prev) {
    prev.addEventListener('click', () => goTo(index - 1));
  }

  if (next) {
    next.addEventListener('click', () => goTo(index + 1));
  }

  // ==========================================
  // GESTION DES VIDÉOS
  // ==========================================
  function pauseAllVideos() {
    slider.querySelectorAll('video').forEach(video => {
      if (!video.paused) video.pause();
    });
  }

  // ==========================================
  // NAVIGATION CLAVIER
  // ==========================================
  slider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'Home') goTo(0);
    if (e.key === 'End') goTo(slides.length - 1);
  });
  slider.setAttribute('tabindex', '0');

  // ==========================================
  // DRAG & DROP / TOUCH SUPPORT
  // ==========================================
  slides.forEach((slide) => {
    const media = slide.querySelector('img, video');
    if (media) media.addEventListener('dragstart', e => e.preventDefault());
    
    slide.addEventListener('pointerdown', pointerDown);
    slide.addEventListener('pointerup', pointerUp);
    slide.addEventListener('pointerleave', pointerUp);
    slide.addEventListener('pointermove', pointerMove);
  });

  function pointerDown(e) {
    isDragging = true;
    startX = e.clientX;
    slider.classList.add('grabbing');
    prevTranslate = currentTranslate;
    animationID = requestAnimationFrame(animation);
    track.style.cursor = 'grabbing';
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
    track.style.cursor = '';
    
    const width = track.clientWidth;
    const movedBy = currentTranslate + index * width;
    
    // Threshold de 80px pour changer de slide
    if (movedBy < -80 && index < slides.length - 1) {
      goTo(index + 1);
    } else if (movedBy > 80 && index > 0) {
      goTo(index - 1);
    } else {
      goTo(index);
    }
  }

  function animation() {
    setTranslate(currentTranslate);
    if (isDragging) requestAnimationFrame(animation);
  }

  function setTranslate(x) {
    track.style.transition = 'none';
    track.style.transform = `translateX(${x}px)`;
  }

  // ==========================================
  // GESTION DU RESIZE
  // ==========================================
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      currentTranslate = -index * track.clientWidth;
      prevTranslate = currentTranslate;
      update();
    }, 120);
  });

  // ==========================================
  // INITIALISATION
  // ==========================================
  update();
  console.log(`✅ Slider #${sliderIndex} prêt avec ${slides.length} slides`);
}

// ==========================================
// UTILITAIRES DE DEBUG
// ==========================================
window.debugSlider = function() {
  const sliders = document.querySelectorAll('.media-slider');
  console.log('📊 État des sliders:', {
    nombre: sliders.length,
    details: Array.from(sliders).map((s, i) => ({
      index: i,
      id: s.id,
      slides: s.querySelectorAll('.ms-slide').length,
      hasTrack: !!s.querySelector('.ms-track'),
      hasWrapper: !!s.querySelector('.ms-track-wrapper'),
      hasDots: !!s.querySelector('.ms-dots'),
      hasButtons: {
        prev: !!s.querySelector('.ms-prev'),
        next: !!s.querySelector('.ms-next')
      }
    }))
  });
};

// Pour débugger dans la console : debugSlider()

