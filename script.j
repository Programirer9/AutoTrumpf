/* script.js — Verbesserte Auto-Trumpf Version
   - robusteres Rendering (DOM statt reinem innerHTML)
   - Bild-Support: optionales card.image (lokal oder URL)
   - Fallback: generiertes SVG-Placeholder, lazy-loading
   - bessere Spielsteuerung + Logs + Accessibility hints
*/

// -------------------- Kartendaten (40 Fahrzeuge) --------------------
// Jedes Objekt: { name: "", image: "assets/<file>.jpg" (optional), stats: { speed, ps, accel, weight, price } }
const CAR_CARDS = [
  { name: "Volkswagen Golf GTI", stats: { speed: 250, ps: 245, accel: 6.4, weight: 1370, price: 42000 }, image: "assets/vw_golf_gti.jpg" },
  { name: "BMW M3", stats: { speed: 290, ps: 480, accel: 3.9, weight: 1680, price: 82000 }, image: "assets/bmw_m3.jpg" },
  { name: "Audi RS6", stats: { speed: 305, ps: 600, accel: 3.6, weight: 2100, price: 120000 }, image: "assets/audi_rs6.jpg" },
  { name: "Tesla Model S Plaid", stats: { speed: 322, ps: 1020, accel: 2.1, weight: 2190, price: 135000 }, image: "assets/tesla_model_s_plaid.jpg" },
  { name: "Ford Fiesta ST", stats: { speed: 230, ps: 200, accel: 6.7, weight: 1200, price: 30000 } },
  { name: "Porsche 911 Carrera", stats: { speed: 308, ps: 385, accel: 4.2, weight: 1500, price: 120000 }, image: "assets/porsche_911.jpg" },
  { name: "Renault Clio RS", stats: { speed: 235, ps: 220, accel: 6.3, weight: 1250, price: 35000 } },
  { name: "Mercedes AMG A45", stats: { speed: 270, ps: 421, accel: 3.9, weight: 1600, price: 65000 } },
  { name: "Honda Civic Type R", stats: { speed: 272, ps: 320, accel: 5.7, weight: 1400, price: 50000 } },
  { name: "Lamborghini Huracán", stats: { speed: 325, ps: 640, accel: 2.9, weight: 1422, price: 210000 } },

  { name: "Ferrari F8 Tributo", stats: { speed: 340, ps: 710, accel: 2.9, weight: 1435, price: 270000 } },
  { name: "McLaren 720S", stats: { speed: 341, ps: 710, accel: 2.8, weight: 1419, price: 280000 } },
  { name: "Aston Martin DB11", stats: { speed: 322, ps: 630, accel: 3.9, weight: 1775, price: 200000 } },
  { name: "Chevrolet Camaro SS", stats: { speed: 250, ps: 455, accel: 4.0, weight: 1735, price: 48000 } },
  { name: "Dodge Challenger SRT Hellcat", stats: { speed: 320, ps: 717, accel: 3.7, weight: 1950, price: 70000 } },
  { name: "Nissan GT-R", stats: { speed: 315, ps: 565, accel: 2.9, weight: 1740, price: 120000 } },
  { name: "Subaru WRX STI", stats: { speed: 255, ps: 310, accel: 4.9, weight: 1570, price: 42000 } },
  { name: "Toyota Supra", stats: { speed: 250, ps: 340, accel: 4.3, weight: 1490, price: 54000 } },
  { name: "Mazda MX-5", stats: { speed: 215, ps: 184, accel: 6.5, weight: 1050, price: 33000 } },
  { name: "Alfa Romeo Giulia Quadrifoglio", stats: { speed: 307, ps: 510, accel: 3.9, weight: 1620, price: 85000 } },

  { name: "Kia Stinger GT", stats: { speed: 270, ps: 365, accel: 4.9, weight: 1840, price: 55000 } },
  { name: "Hyundai i30 N", stats: { speed: 250, ps: 280, accel: 5.7, weight: 1450, price: 37000 } },
  { name: "Seat Leon Cupra", stats: { speed: 250, ps: 300, accel: 5.8, weight: 1380, price: 36000 } },
  { name: "Skoda Octavia RS", stats: { speed: 250, ps: 245, accel: 6.4, weight: 1460, price: 38000 } },
  { name: "Citroën C3 Aircross", stats: { speed: 180, ps: 110, accel: 11.0, weight: 1200, price: 21000 } },
  { name: "VW ID.4 (EV)", stats: { speed: 180, ps: 204, accel: 8.5, weight: 2000, price: 47000 } },
  { name: "Tesla Model 3 Long Range", stats: { speed: 233, ps: 450, accel: 4.4, weight: 1845, price: 62000 } },
  { name: "Jaguar F-Type", stats: { speed: 300, ps: 450, accel: 4.1, weight: 1620, price: 90000 } },
  { name: "Bentley Continental GT", stats: { speed: 333, ps: 635, accel: 3.7, weight: 2350, price: 220000 } },
  { name: "Rolls-Royce Phantom", stats: { speed: 250, ps: 563, accel: 5.3, weight: 2560, price: 450000 } },

  { name: "Mini Cooper S", stats: { speed: 235, ps: 192, accel: 6.8, weight: 1280, price: 32000 } },
  { name: "Fiat 500 Abarth", stats: { speed: 210, ps: 165, accel: 7.5, weight: 1065, price: 26000 } },
  { name: "Peugeot 208 GTi", stats: { speed: 230, ps: 208, accel: 6.6, weight: 1140, price: 29000 } },
  { name: "Toyota Land Cruiser", stats: { speed: 190, ps: 275, accel: 9.8, weight: 2450, price: 80000 } },
  { name: "Land Rover Defender", stats: { speed: 210, ps: 300, accel: 8.4, weight: 2400, price: 75000 } },
  { name: "Volvo XC90", stats: { speed: 230, ps: 320, accel: 7.6, weight: 2100, price: 70000 } },
  { name: "Ford F-150 Raptor", stats: { speed: 180, ps: 450, accel: 5.5, weight: 2600, price: 90000 } },
  { name: "Ram 1500 TRX", stats: { speed: 195, ps: 702, accel: 4.5, weight: 2700, price: 90000 } },
  { name: "KTM X-Bow", stats: { speed: 235, ps: 300, accel: 3.9, weight: 790, price: 90000 } },
  { name: "Pagani Huayra", stats: { speed: 370, ps: 730, accel: 2.8, weight: 1350, price: 1500000 } },

  { name: "Bugatti Chiron", stats: { speed: 420, ps: 1500, accel: 2.4, weight: 1995, price: 3000000 } },
  { name: "McLaren Artura", stats: { speed: 330, ps: 671, accel: 3.0, weight: 1495, price: 220000 } },
  { name: "Toyota Prius", stats: { speed: 180, ps: 122, accel: 10.5, weight: 1380, price: 30000 } },
  { name: "Honda Accord", stats: { speed: 210, ps: 192, accel: 7.9, weight: 1500, price: 35000 } },
  { name: "Skoda Fabia", stats: { speed: 185, ps: 95, accel: 13.2, weight: 980, price: 17000 } },
  { name: "Mitsubishi Lancer Evo", stats: { speed: 255, ps: 295, accel: 5.0, weight: 1420, price: 45000 } }
];

// -------------------- Spielzustand --------------------
let deck = [];
let playerDeck = [];
let computerDeck = [];
let playerTurn = true;
let busy = false;

// UI refs
const playerCardEl = document.getElementById('player-card');
const computerCardEl = document.getElementById('computer-card');
const nextBtn = document.getElementById('next-round');
const logEl = document.getElementById('log');
const roundMessage = document.getElementById('round-message');
const playerCountEl = document.getElementById('player-count');
const computerCountEl = document.getElementById('computer-count');
const statButtonsContainer = document.getElementById('stat-buttons');

function log(text){
  const p = document.createElement('div');
  p.textContent = `${new Date().toLocaleTimeString()} — ${text}`;
  logEl.prepend(p);
}

// Shuffle
function shuffle(a){
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

// -------------------- Start/Neues Spiel --------------------
function newGame(){
  deck = JSON.parse(JSON.stringify(CAR_CARDS));
  shuffle(deck);
  playerDeck = [];
  computerDeck = [];
  deck.forEach((c, i) => {
    if (i % 2 === 0) playerDeck.push(c);
    else computerDeck.push(c);
  });
  playerTurn = true;
  busy = false;
  updateCounts();
  roundMessage.textContent = "Spiel gestartet — du bist dran!";
  log("Neues Spiel gestartet.");
  renderHands(false);
  nextBtn.textContent = "Nächste Runde";
}

// -------------------- Rendering --------------------
function updateCounts(){
  playerCountEl.textContent = `Du: ${playerDeck.length} Karten`;
  computerCountEl.textContent = `Computer: ${computerDeck.length} Karten`;
}

// Erzeugt ein data-uri SVG placeholder mit dem Namen (falls Bild fehlt)
function makeSVGPlaceholder(name, w=800, h=450){
  const bg = "#e6eef6";
  const fg = "#072033";
  const text = name.length > 30 ? name.slice(0,30) + "…" : name;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='${bg}'/>
    <text x='50%' y='50%' font-family='Arial, Helvetica, sans-serif' font-size='28' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${escapeXml(text)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));
}

// Rendert eine Karte in ein Container-Element (player/computer)
function renderCardTo(containerEl, card, showStats=true){
  containerEl.innerHTML = ''; // sauber starten
  if (!card) {
    containerEl.className = 'card empty';
    containerEl.textContent = 'Keine Karte';
    return;
  }

  containerEl.className = 'card';
  // Media
  const media = document.createElement('div');
  media.className = 'card-media';
  const img = document.createElement('img');
  img.alt = card.name;
  img.loading = 'lazy';
  // Wenn image-Feld existiert, benutze es — sonst placeholder
  if (card.image){
    img.src = card.image;
    // Bei Ladefehler => setze placeholder
    img.onerror = () => {
      img.onerror = null;
      img.src = makeSVGPlaceholder(card.name);
    };
  } else {
    img.src = makeSVGPlaceholder(card.name);
  }
  media.appendChild(img);
  containerEl.appendChild(media);

  // Body
  const body = document.createElement('div');
  body.className = 'card-body';
  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = card.name;
  body.appendChild(title);

  if (showStats){
    const statsDiv = document.createElement('div');
    statsDiv.className = 'stats';
    // Reihenfolge definieren
    const keys = ['speed','ps','accel','weight','price'];
    const labels = {
      speed: "Top-Speed (km/h)",
      ps: "PS",
      accel: "0-100 (s)",
      weight: "Gewicht (kg)",
      price: "Preis (€)"
    };
    keys.forEach(k => {
      const st = document.createElement('div');
      st.className = 'stat';
      const spanL = document.createElement('span');
      spanL.textContent = labels[k] || k;
      const spanR = document.createElement('strong');
      let val = card.stats[k];
      if (k === 'price') spanR.textContent = (val ? val.toLocaleString() : val);
      else spanR.textContent = val;
      st.appendChild(spanL);
      st.appendChild(spanR);
      statsDiv.appendChild(st);
    });
    body.appendChild(statsDiv);
  }
  containerEl.appendChild(body);
}

// Render beider Hände; showComputer true => Computer-Karte sichtbar
function renderHands(showComputer=false){
  // Spieler immer mit Stats sichtbar
  renderCardTo(playerCardEl, playerDeck[0] || null, true);
  // Computer: wenn showComputer true -> render stats, sonst verdeckt
  if (showComputer){
    renderCardTo(computerCardEl, computerDeck[0] || null, true);
  } else {
    if (computerDeck.length === 0){
      renderCardTo(computerCardEl, null, false);
    } else {
      computerCardEl.className = 'card back';
      computerCardEl.innerHTML = 'Verdeckt';
    }
  }
  setupStatButtons();
}

// -------------------- Stat-Buttons --------------------
function setupStatButtons(){
  statButtonsContainer.innerHTML = '';
  if (playerDeck.length === 0 || computerDeck.length === 0) return;
  if (!playerTurn || busy) return;

  const keys = Object.keys(playerDeck[0].stats);
  const labels = {
    speed: "Top-Speed (km/h)",
    ps: "PS",
    accel: "0-100 (s)",
    weight: "Gewicht (kg)",
    price: "Preis (€)"
  };

  keys.forEach(k => {
    const btn = document.createElement('button');
    btn.className = 'stat-btn';
    btn.textContent = labels[k] || k;
    btn.onclick = () => {
      playerChooseStat(k);
    };
    statButtonsContainer.appendChild(btn);
  });
}

// -------------------- Spiel-Logik --------------------
function playerChooseStat(statKey){
  if (busy) return;
  busy = true;
  roundMessage.textContent = `Du wählst: ${statKey}`;
  log(`Du wählst Kategorie ${statKey}.`);
  revealAndResolve(statKey);
}

function computerChooseStat(){
  const keys = Object.keys(computerDeck[0].stats);
  const choice = keys[Math.floor(Math.random()*keys.length)];
  roundMessage.textContent = `Computer wählt ${choice}`;
  log(`Computer wählt Kategorie ${choice}.`);
  revealAndResolve(choice);
}

function revealAndResolve(statKey){
  renderHands(true);
  const pCard = playerDeck[0];
  const cCard = computerDeck[0];
  const pVal = pCard.stats[statKey];
  const cVal = cCard.stats[statKey];
  const smallerIsBetter = (statKey === 'accel');

  let winner = null;
  if (pVal === cVal) winner = 'tie';
  else if (smallerIsBetter) winner = (pVal < cVal) ? 'player' : 'computer';
  else winner = (pVal > cVal) ? 'player' : 'computer';

  // kurze Pause für UX
  setTimeout(() => {
    if (winner === 'player'){
      roundMessage.textContent = `Du gewinnst die Runde! (${pVal} vs ${cVal})`;
      log(`Du gewinnst: ${pCard.name} (${pVal}) > ${cCard.name} (${cVal})`);
      playerDeck.push(playerDeck.shift());
      playerDeck.push(computerDeck.shift());
      playerTurn = true;
    } else if (winner === 'computer'){
      roundMessage.textContent = `Computer gewinnt die Runde. (${cVal} vs ${pVal})`;
      log(`Computer gewinnt: ${cCard.name} (${cVal}) > ${pCard.name} (${pVal})`);
      computerDeck.push(computerDeck.shift());
      computerDeck.push(playerDeck.shift());
      playerTurn = false;
    } else {
      roundMessage.textContent = `Unentschieden! (${pVal} = ${cVal})`;
      log(`Unentschieden: ${pCard.name} (${pVal}) = ${cCard.name} (${cVal})`);
      playerDeck.push(playerDeck.shift());
      computerDeck.push(computerDeck.shift());
      // playerTurn bleibt wie vorher
    }

    updateCounts();
    checkForEnd();
    renderHands(false);
    busy = false;

    if (!playerTurn && computerDeck.length>0 && playerDeck.length>0){
      setTimeout(() => {
        if (!busy) {
          busy = true;
          computerChooseStat();
        }
      }, 800);
    }
  }, 700);
}

function checkForEnd(){
  if (computerDeck.length === 0){
    roundMessage.textContent = "Glückwunsch — du hast gewonnen!";
    log("Spielende: Spieler hat alle Karten.");
    busy = true;
    nextBtn.textContent = "Neues Spiel";
  } else if (playerDeck.length === 0){
    roundMessage.textContent = "Der Computer hat gewonnen — schade!";
    log("Spielende: Computer hat alle Karten.");
    busy = true;
    nextBtn.textContent = "Neues Spiel";
  }
}

// -------------------- Events --------------------
nextBtn.addEventListener('click', () => {
  if (playerDeck.length === 0 || computerDeck.length === 0 || busy){
    newGame();
  } else {
    if (playerTurn){
      roundMessage.textContent = "Du bist dran — wähle eine Kategorie.";
    } else {
      busy = true;
      setTimeout(() => {
        computerChooseStat();
      }, 400);
    }
  }
});

// Init
(function init(){
  playerCardEl.className = 'card empty';
  playerCardEl.innerHTML = 'Keine Karte';
  computerCardEl.className = 'card back';
  computerCardEl.innerHTML = 'Verdeckt';
  roundMessage.textContent = "Klicke 'Neues Spiel' um zu starten.";
  nextBtn.textContent = "Neues Spiel";
  updateCounts();
})()
