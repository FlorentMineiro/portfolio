// --- INTRO ANIMATION (session-aware) ---
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

// utilitaires
function safeGet(id) { return document.getElementById(id); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

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
    // pas d'éléments, on affiche l'app directement
    if (app) app.style.opacity = 1;
    if (intro) intro.style.display = 'none';
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

// Gestion du raccourci Entrée pour passer l'intro
function setupSkipShortcut() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      if (intro && intro.style.display !== 'none') {
        intro.style.opacity = '0';
        setTimeout(() => {
          if (intro) intro.style.display = 'none';
          if (app) app.style.opacity = 1;
          try { sessionStorage.setItem('introShown', 'true'); } catch (e) {}
        }, 200);
      }
    }
  });
}

// --- INIT (attendre DOMContentLoaded pour être sûr que tout est présent) ---
document.addEventListener('DOMContentLoaded', () => {
  setupSkipShortcut();

  const introShown = (() => {
    try { return sessionStorage.getItem('introShown') === 'true'; } catch (e) { return false; }
  })();

  if (introShown) {
    showAppImmediately();
  } else {
    playIntro();
  }

  // --- TABS (navigation principale) ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabs = document.querySelectorAll('.tab');
  tabBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabs.forEach(t => (t.style.display = t.id === target ? 'block' : 'none'));
    })
  );

  // --- BOUTONS SECONDAIRES (Présentation / Parcours / SISR / SLAM) ---
  const btnBts = safeGet('btn-bts');
  const btnParcours = safeGet('btn-parcours');
  const btsText = safeGet('bts-text');
  const parcoursText = safeGet('parcours-text');

  function toggleSection(button, section, others = []) {
    if (!button || !section) return;
    const isVisible = section.style.display === 'block';
    section.style.display = isVisible ? 'none' : 'block';
    button.classList.toggle('active', !isVisible);
    others.forEach(o => {
      if (o.section) o.section.style.display = 'none';
      if (o.button) o.button.classList.remove('active');
    });
  }

  if (btnBts) {
    btnBts.addEventListener('click', () => {
      toggleSection(btnBts, btsText, [{ button: btnParcours, section: parcoursText }]);
    });
  }

  if (btnParcours) {
    btnParcours.addEventListener('click', () => {
      toggleSection(btnParcours, parcoursText, [{ button: btnBts, section: btsText }]);
      const sisrText = safeGet('sisr-text');
      const slamText = safeGet('slam-text');
      if (sisrText) sisrText.style.display = 'none';
      if (slamText) slamText.style.display = 'none';
    });
  }

  document.addEventListener('click', e => {
    if (e.target.id === 'btn-sisr' || e.target.id === 'btn-slam') {
      const btnSisr = safeGet('btn-sisr');
      const btnSlam = safeGet('btn-slam');
      const sisrText = safeGet('sisr-text');
      const slamText = safeGet('slam-text');

      if (e.target.id === 'btn-sisr') {
        toggleSection(btnSisr, sisrText, [{ button: btnSlam, section: slamText }]);
      } else {
        toggleSection(btnSlam, slamText, [{ button: btnSisr, section: sisrText }]);
      }
    }
  });

  // Navigation helper utilisé par les cartes
  window.goTo = function(page) { window.location.href = page; };

  // --- FILTRES PROJETS (délégué) ---
  document.addEventListener('click', function(e){
    if (!e.target.matches('.filter-btn')) return;
    const filter = e.target.getAttribute('data-filter');
    // visuel simple pour boutons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === e.target));
    document.querySelectorAll('#projets .card').forEach(card => {
      const type = card.getAttribute('data-type') || '';
      card.style.display = (filter === 'all' || type === filter) ? '' : 'none';
    });
  });

});

// Récupère le paramètre dans l’URL
const params = new URLSearchParams(window.location.search);
const selected = params.get("projet");

// Si un projet est demandé, on masque les autres
if (selected) {
  document.querySelectorAll(".project-card").forEach(card => {
    if (card.id !== selected) {
      card.style.display = "none";
    }
  });
}


