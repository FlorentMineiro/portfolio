document.addEventListener("DOMContentLoaded", () => {
 
  if (document.getElementById("character-list")) {
      fetchCharacters();
      document.getElementById("filter-house").addEventListener("change", filterCharacters);
      document.getElementById("search").addEventListener("input", filterCharacters);
  }

 
  if (document.getElementById("spell-list")) {
      fetchSpells();
      document.getElementById("search-spells").addEventListener("input", filterSpells);
  }

 
  if (document.getElementById("house-list")) {
      displayHouses(); 
      fetchSpells();
  }
});

async function fetchCharacters() {
  const response = await fetch("https://hp-api.onrender.com/api/characters");
  const characters = await response.json();
  displayCharacters(characters);
}

function displayCharacters(characters) {
  const list = document.getElementById("character-list");
  list.innerHTML = "";
  characters.forEach(character => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
          <img src="${character.image || 'https://via.placeholder.com/150x150?text=Image+manquante'}" alt="${character.name}" width="150">
          <h3>${character.name}</h3>
          <p>${character.house || 'Inconnu'}</p>
      `;
      list.appendChild(card);
  });
}

function filterCharacters() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const selectedHouse = document.getElementById("filter-house").value;
  fetch("https://hp-api.onrender.com/api/characters")
      .then(response => response.json())
      .then(characters => {
          let filteredCharacters = characters.filter(char =>
              char.name.toLowerCase().includes(searchQuery) &&
              (selectedHouse === "" || char.house === selectedHouse)
          );
          displayCharacters(filteredCharacters);
      });
}

async function fetchSpells() {
  const response = await fetch("https://hp-api.onrender.com/api/spells");
  const spells = await response.json();
  displaySpells(spells);
}

function displaySpells(spells) {
  const list = document.getElementById("spell-list");
  list.innerHTML = "";
  spells.forEach(spell => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
          <h3>${spell.name}</h3>
          <p>${spell.description || 'Pas de description'}</p>
      `;
      list.appendChild(card);
  });
}

function filterSpells() {
  const searchQuery = document.getElementById("search-spells").value.toLowerCase();
  fetch("https://hp-api.onrender.com/api/spells")
      .then(response => response.json())
      .then(spells => {
          let filteredSpells = spells.filter(spell =>
              spell.name.toLowerCase().includes(searchQuery)
          );
          displaySpells(filteredSpells);
      });
}


function displayHouses() {
  const houses = [
      {
          name: "Gryffondor",
          founder: "Godric Gryffondor",
          colors: "Rouge et Or",
          mascot: "Lion",
          characteristics: "Courage, Détermination, Bravoure"
      },
      {
          name: "Serpentard",
          founder: "Salazar Serpentard",
          colors: "Vert et Argent",
          mascot: "Serpent",
          characteristics: "Ambition, Ruse, Leadership"
      },
      {
          name: "Poufsouffle",
          founder: "Helga Poufsouffle",
          colors: "Jaune et Noir",
          mascot: "Blaireau",
          characteristics: "Travailleur, Loyal, Juste"
      },
      {
          name: "Serdaigle",
          founder: "Rowena Serdaigle",
          colors: "Bleu et Argent",
          mascot: "Aigle",
          characteristics: "Intelligence, Créativité, Sagesse"
      }
  ];

  const list = document.getElementById("house-list");
  list.innerHTML = "";
  houses.forEach(house => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
          <h3>${house.name}</h3>
          <p><strong>Fondateur :</strong> ${house.founder}</p>
          <p><strong>Couleurs :</strong> ${house.colors}</p>
          <p><strong>Mascotte :</strong> ${house.mascot}</p>
          <p><strong>Caractéristiques :</strong> ${house.characteristics}</p>
      `;
      list.appendChild(card);
  });
}