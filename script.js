// ==============================
// Auto-Trumpf Spiel – Script.js
// ==============================

// Globale Variablen
let playerDeck = [];
let computerDeck = [];
let playerCoins = 0;
let playerTurn = true;
let busy = false;
let maxLevel = 5;

// ==============================
// Kartendaten (Beispiele, Bilder als URLs einfügen)
// ==============================
const cards = [
  { name: "Ferrari F8", stats: { speed: 340, ps: 720, accel: 2.9, weight: 1435, price: 276000 }, img: "images/ferrari_f8.jpg", level: 1 },
  { name: "Lamborghini Huracán", stats: { speed: 325, ps: 640, accel: 3.2, weight: 1422, price: 261000 }, img: "images/lamborghini_huracan.jpg", level: 1 },
  { name: "Porsche 911 Turbo", stats: { speed: 330, ps: 580, accel: 3.1, weight: 1645, price: 170000 }, img: "images/porsche_911_turbo.jpg", level: 1 },
  { name: "McLaren 720S", stats: { speed: 341, ps: 710, accel: 2.8, weight: 1419, price: 300000 }, img: "images/mclaren_720s.jpg", level: 1 },
  { name: "Bugatti Chiron", stats: { speed: 420, ps: 1500, accel: 2.4, weight: 1995, price: 2900000 }, img: "images/bugatti_chiron.jpg", level: 1 }
];

// ==============================
// Spiel starten
// ==============================
function startGame() {
  busy = false;
  playerTurn = true;

  // Mische Decks
  playerDeck = shuffle([...cards]);
  computerDeck = shuffle([...cards]);

  // Anzeigen
  showPlayerCard();
  showComputerCardPlaceholder();
  setupStatButtons();
  updateCoinsDisplay();
}

// ==============================
// Hilfsfunktionen
// ==============================
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showPlayerCard() {
  const container = document.getElementById('player-card');
  const card = playerDeck[0];
  container.innerHTML = `
    <h3>${card.name} (Level ${card.level})</h3>
    <img src="${card.img}" alt="${card.name}" class="card-img">
    <ul>
      <li>Top-Speed: ${card.stats.speed} km/h</li>
      <li>PS: ${card.stats.ps}</li>
      <li>0-100: ${card.stats.accel}s</li>
      <li>Gewicht: ${card.stats.weight} kg</li>
      <li>Preis: €${card.stats.price}</li>
    </ul>
  `;
}

function showComputerCardPlaceholder() {
  const container = document.getElementById('computer-card');
  container.innerHTML = `<h3>Computer Karte</h3><img src="images/card_back.jpg" class="card-img">`;
}

function revealComputerCard() {
  const container = document.getElementById('computer-card');
  const card = computerDeck[0];
  container.innerHTML = `
    <h3>${card.name} (Level ${card.level})</h3>
    <img src="${card.img}" alt="${card.name}" class="card-img">
    <ul>
      <li>Top-Speed: ${card.stats.speed} km/h</li>
      <li>PS: ${card.stats.ps}</li>
      <li>0-100: ${card.stats.accel}s</li>
      <li>Gewicht: ${card.stats.weight} kg</li>
      <li>Preis: €${card.stats.price}</li>
    </ul>
  `;
}

// ==============================
// Stat-Buttons Setup (permanenter Fix)
// ==============================
function setupStatButtons(){
  try {
    const cont = document.getElementById('stat-buttons');
    if (!cont) return;

    cont.innerHTML = '';
    cont.style.zIndex = 99999;
    cont.style.position = 'relative';
    cont.style.pointerEvents = 'auto';

    if (!playerDeck || !computerDeck || playerDeck.length === 0 || computerDeck.length === 0) return;

    if (!playerTurn || busy) {
      const keys = Object.keys(playerDeck[0].stats || {});
      const labels = { speed: "Top-Speed (km/h)", ps: "PS", accel: "0-100 (s)", weight: "Gewicht (kg)", price: "Preis (€)" };
      keys.forEach(k => {
        const btn = document.createElement('button');
        btn.className = 'stat-btn';
        btn.textContent = labels[k] || k;
        btn.disabled = true;
        btn.style.opacity = 0.6;
        btn.style.pointerEvents = 'none';
        cont.appendChild(btn);
      });
      return;
    }

    const keys = Object.keys(playerDeck[0].stats || {});
    const labels = { speed: "Top-Speed (km/h)", ps: "PS", accel: "0-100 (s)", weight: "Gewicht (kg)", price: "Preis (€)" };

    keys.forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'stat-btn';
      btn.textContent = labels[k] || k;
      btn.disabled = false;
      btn.style.opacity = 1;
      btn.style.pointerEvents = 'auto';

      btn.addEventListener('click', () => {
        if (busy || !playerTurn) return;
        busy = true;
        revealAndResolve(k);
      });

      cont.appendChild(btn);
    });
  } catch (err) {
    console.error("setupStatButtons Fehler:", err);
  }
}

// ==============================
// Auflösung einer Runde
// ==============================
function revealAndResolve(statKey) {
  revealComputerCard();

  const playerCard = playerDeck[0];
  const computerCard = computerDeck[0];

  let playerValue = playerCard.stats[statKey];
  let computerValue = computerCard.stats[statKey];

  let resultMessage = "";
  if (playerValue > computerValue) {
    resultMessage = "Du gewinnst diese Runde!";
    playerCoins += 10; // Münzen gewinnen
  } else if (playerValue < computerValue) {
    resultMessage = "Computer gewinnt diese Runde!";
  } else {
    resultMessage = "Unentschieden!";
  }

  alert(`${resultMessage}\nDein Wert: ${playerValue}\nComputer Wert: ${computerValue}`);
  playerDeck.push(playerDeck.shift());
  computerDeck.push(computerDeck.shift());
  playerTurn = true;
  busy = false;
  showPlayerCard();
  showComputerCardPlaceholder();
  setupStatButtons();
  updateCoinsDisplay();
}

// ==============================
// Münzen & Garage
// ==============================
function updateCoinsDisplay() {
  const container = document.getElementById('coins-display');
  container.textContent = `Münzen: ${playerCoins}`;
}

function openGarage() {
  const garage = document.getElementById('garage-panel');
  garage.classList.remove('hidden');
  renderGarage();
}

function closeGarage() {
  const garage = document.getElementById('garage-panel');
  garage.classList.add('hidden');
}

function renderGarage() {
  const container = document.getElementById('garage-cards');
  container.innerHTML = '';
  playerDeck.forEach((card, index) => {
    const div = document.createElement('div');
    div.className = 'garage-card';
    div.innerHTML = `
      <h4>${card.name} (Level ${card.level})</h4>
      <img src="${card.img}" class="card-img-small">
      <button onclick="upgradeCard(${index})">Upgrade (€${card.level*50})</button>
    `;
    container.appendChild(div);
  });
}

function upgradeCard(index) {
  const card = playerDeck[index];
  const cost = card.level * 50;
  if (playerCoins < cost) { alert("Nicht genug Münzen!"); return; }
  if (card.level >= maxLevel) { alert("Max Level erreicht!"); return; }

  const confirmUpgrade = confirm(`Möchtest du ${card.name} auf Level ${card.level+1} upgraden für ${cost} Münzen?`);
  if (!confirmUpgrade) return;

  playerCoins -= cost;
  card.level += 1;

  // Stats proportional verbessern
  Object.keys(card.stats).forEach(stat => {
    card.stats[stat] = Math.round(card.stats[stat] * 1.05);
  });

  alert(`${card.name} wurde auf Level ${card.level} gebracht!`);
  renderGarage();
  updateCoinsDisplay();
}

// ==============================
// Event Listener & Start
// ==============================
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('garage-btn').addEventListener('click', openGarage);
document.getElementById('close-garage-btn').addEventListener('click', closeGarage);

// ==============================
// Init Display
// ==============================
startGame();
