// --- INTRO ANIMATION ---
const intro = document.getElementById('intro');
const introLinesContainer = document.getElementById('intro-lines');
const lines = [
  '> System startup sequence initialized...',
  '> Loading portfolio environment...',
  '> User: Florent Mineiro',
  '> Role: Développeur / Cybersécurité',
  '> Environment ready ✅'
];

function typeLine(text, container, delay = 12) {
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

async function runIntro() {
  for (const l of lines) {
    await typeLine(l, introLinesContainer, 15);
    await new Promise(r => setTimeout(r, 250));
  }
  await new Promise(r => setTimeout(r, 600));
  intro.style.opacity = '0';
  setTimeout(() => {
    intro.style.display = 'none';
    document.getElementById('app').style.opacity = 1;
  }, 450);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      document.getElementById('app').style.opacity = 1;
    }, 200);
  }
});

runIntro();

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
document.addEventListener('DOMContentLoaded', () => {
  const btnBts = document.getElementById('btn-bts');
  const btnParcours = document.getElementById('btn-parcours');
  const btsText = document.getElementById('bts-text');
  const parcoursText = document.getElementById('parcours-text');

  function toggleSection(button, section, others = []) {
    const isVisible = section.style.display === 'block';
    section.style.display = isVisible ? 'none' : 'block';
    button.classList.toggle('active', !isVisible);
    others.forEach(o => {
      o.section.style.display = 'none';
      o.button.classList.remove('active');
    });
  }

  btnBts.addEventListener('click', () => {
    toggleSection(btnBts, btsText, [{ button: btnParcours, section: parcoursText }]);
  });

  btnParcours.addEventListener('click', () => {
    toggleSection(btnParcours, parcoursText, [{ button: btnBts, section: btsText }]);
    const sisrText = document.getElementById('sisr-text');
    const slamText = document.getElementById('slam-text');
    if (sisrText) sisrText.style.display = 'none';
    if (slamText) slamText.style.display = 'none';
  });

  document.addEventListener('click', e => {
    if (e.target.id === 'btn-sisr' || e.target.id === 'btn-slam') {
      const btnSisr = document.getElementById('btn-sisr');
      const btnSlam = document.getElementById('btn-slam');
      const sisrText = document.getElementById('sisr-text');
      const slamText = document.getElementById('slam-text');

      if (e.target.id === 'btn-sisr') {
        toggleSection(btnSisr, sisrText, [{ button: btnSlam, section: slamText }]);
      } else {
        toggleSection(btnSlam, slamText, [{ button: btnSisr, section: sisrText }]);
      }
    }
  });
});
