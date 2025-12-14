// ============================================================
// 1. UTILITAIRES ET VARIABLES
// ============================================================
function safeGet(id) { return document.getElementById(id); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ============================================================
// 2. ANIMATION INTRO (TERMINAL)
// ============================================================
const intro = document.getElementById('intro');
const introLinesContainer = document.getElementById('intro-lines');
const app = document.getElementById('app');

const lines = [
  '> System startup sequence initialized...',
  '> Loading portfolio environment...',
  '> User: Florent Mineiro',
  '> Role: Développeur / Cybersécurité',
  '> Environment ready ✅'
];

async function typeLine(text, container, delay = 12) {
  if (!container) return;
  return new Promise(resolve => {
    const line = document.createElement('div');
    line.className = 'line';
    container.appendChild(line);
    let i = 0;
    (function step() {
      if (i <= text.length) {
        line.textContent = text.slice(0, i);
        i++;
        setTimeout(step, delay);
      } else resolve();
    })();
  });
}

async function playIntro() {
  if (!intro || !introLinesContainer || !app) {
    showAppImmediately();
    return;
  }
  intro.style.display = 'block';
  intro.style.opacity = '1';
  introLinesContainer.innerHTML = '';

  for (const l of lines) {
    await typeLine(l, introLinesContainer, 15);
    await sleep(250);
  }
  await sleep(600);
  
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    app.style.opacity = 1;
    try { sessionStorage.setItem('introShown', 'true'); } catch (e) {}
  }, 450);
}

function showAppImmediately() {
  if (intro) intro.style.display = 'none';
  if (app) app.style.opacity = 1;
}

function setupSkipShortcut() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (intro && intro.style.display !== 'none') {
        intro.style.opacity = '0';
        setTimeout(() => {
          showAppImmediately();
          try { sessionStorage.setItem('introShown', 'true'); } catch (e) {}
        }, 200);
      }
    }
  });
}

// ============================================================
// 3. NAVIGATION (Onglets du Menu Principal)
// ============================================================
function switchTab(targetId) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabs = document.querySelectorAll('.tab');

  // Active le bon bouton
  tabBtns.forEach(b => b.classList.remove('active'));
  const targetBtn = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
  if (targetBtn) targetBtn.classList.add('active');

  // Affiche la bonne section
  tabs.forEach(t => (t.style.display = t.id === targetId ? 'block' : 'none'));
}

// ============================================================
// 4. INITIALISATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  
  // A. Intro Logic
  setupSkipShortcut();
  const introShown = (() => {
    try { return sessionStorage.getItem('introShown') === 'true'; } catch (e) { return false; }
  })();

  if (introShown) showAppImmediately();
  else playIntro();

  // B. Navigation Menu
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    })
  );

  // C. Filtres Projets (Web, JavaFX, etc.)
  document.addEventListener('click', function(e){
    if (!e.target.matches('.filter-btn')) return;
    const filter = e.target.getAttribute('data-filter');
    
    // Visuel des boutons filtres
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === e.target));
    
    // Filtrage des cartes (ce sont maintenant des liens <a>)
    document.querySelectorAll('#projets .card').forEach(card => {
      // On ignore le bouton filtre lui-même s'il est dans une card par erreur, on cible les éléments avec data-type
      const type = card.getAttribute('data-type') || '';
      if (!type) return; 

      // 'display: block' car nos liens doivent se comporter comme des blocs
      if (filter === 'all' || type === filter) {
        card.style.display = 'block'; 
      } else {
        card.style.display = 'none';
      }
    });
  });

  // D. Accordéon Parcours
  const btnParcours = safeGet('btn-parcours');
  const parcoursText = safeGet('parcours-text');

  if (btnParcours && parcoursText) {
    btnParcours.addEventListener('click', () => {
      const isVisible = parcoursText.style.display === 'block';
      parcoursText.style.display = isVisible ? 'none' : 'block';
      btnParcours.classList.toggle('active', !isVisible);
    });
  }

});