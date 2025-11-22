document.addEventListener('DOMContentLoaded', function () {
  (function(){
    const slider = document.querySelector('.media-slider');
    if(!slider) return;

    const track = slider.querySelector('.ms-track');
    const slides = Array.from(track.querySelectorAll('.ms-slide'));
    const prev = slider.querySelector('.ms-prev');
    const next = slider.querySelector('.ms-next');
    const dotsContainer = slider.querySelector('.ms-dots');

    let index = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'ms-dot';
      dot.type = 'button';
      dot.setAttribute('aria-selected', i===0 ? 'true' : 'false');
      dot.setAttribute('aria-label', 'Aller à la diapositive ' + (i+1));
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    function update() {
      const width = track.clientWidth;
      track.style.display = 'flex';
      track.style.transition = 'transform .45s cubic-bezier(.22,.9,.2,1)';
      track.style.transform = `translateX(${-index * width}px)`;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i===index ? 'true' : 'false'));
    }

    function goTo(i){
      index = Math.max(0, Math.min(i, slides.length-1));
      update();
    }

    prev.addEventListener('click', () => goTo(index-1));
    next.addEventListener('click', () => goTo(index+1));

    // keyboard navigation
    slider.addEventListener('keydown', e => {
      if(e.key === 'ArrowLeft') goTo(index-1);
      if(e.key === 'ArrowRight') goTo(index+1);
    });
    slider.setAttribute('tabindex', '0');

    // touch / drag support
    slides.forEach((slide, i) => {
      const media = slide.querySelector('img, video');
      if(media) media.addEventListener('dragstart', e => e.preventDefault());
      slide.addEventListener('pointerdown', pointerDown(i));
      slide.addEventListener('pointerup', pointerUp);
      slide.addEventListener('pointerleave', pointerUp);
      slide.addEventListener('pointermove', pointerMove);
    });

    function pointerDown(i){
      return function(e){
        isDragging = true;
        startX = e.clientX;
        slider.classList.add('grabbing');
        prevTranslate = currentTranslate;
        animationID = requestAnimationFrame(animation);
      };
    }
    function pointerMove(e){
      if(!isDragging) return;
      const currentX = e.clientX;
      const dx = currentX - startX;
      const width = track.clientWidth;
      currentTranslate = -index * width + dx;
    }
    function pointerUp(){
      if(!isDragging) return;
      isDragging = false;
      cancelAnimationFrame(animationID);
      slider.classList.remove('grabbing');
      const width = track.clientWidth;
      const movedBy = currentTranslate + index * width;
      if(movedBy < -80) goTo(index+1);
      else if(movedBy > 80) goTo(index-1);
      else goTo(index);
    }
    function animation(){
      setTranslate(currentTranslate);
      if(isDragging) requestAnimationFrame(animation);
    }
    function setTranslate(x){
      track.style.transition = 'none';
      track.style.transform = `translateX(${x}px)`;
    }

    // Resize observer to keep correct transform on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(update, 120);
    });

    // init
    update();
  })();
});
track.style.display = 'flex';
track.style.flexWrap = 'nowrap';

