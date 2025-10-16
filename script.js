/* script.js — Polished Auto-Trumpf
   Features:
   - 40 Karten (automatisch Bilder via Unsplash fallback)
   - bessere CPU-KI (heuristisch + randomness)
   - flip animation, highlight winning stat
   - progress bars, highscores (localStorage)
   - auto-play, sound toggle
*/

// ---------------- Cards (40) ----------------
const CAR_CARDS = [
  { name: "Volkswagen Golf GTI", stats:{speed:250,ps:245,accel:6.4,weight:1370,price:42000} },
  { name: "BMW M3", stats:{speed:290,ps:480,accel:3.9,weight:1680,price:82000} },
  { name: "Audi RS6", stats:{speed:305,ps:600,accel:3.6,weight:2100,price:120000} },
  { name: "Tesla Model S Plaid", stats:{speed:322,ps:1020,accel:2.1,weight:2190,price:135000} },
  { name: "Ford Fiesta ST", stats:{speed:230,ps:200,accel:6.7,weight:1200,price:30000} },
  { name: "Porsche 911 Carrera", stats:{speed:308,ps:385,accel:4.2,weight:1500,price:120000} },
  { name: "Renault Clio RS", stats:{speed:235,ps:220,accel:6.3,weight:1250,price:35000} },
  { name: "Mercedes AMG A45", stats:{speed:270,ps:421,accel:3.9,weight:1600,price:65000} },
  { name: "Honda Civic Type R", stats:{speed:272,ps:320,accel:5.7,weight:1400,price:50000} },
  { name: "Lamborghini Huracán", stats:{speed:325,ps:640,accel:2.9,weight:1422,price:210000} },

  { name: "Ferrari F8 Tributo", stats:{speed:340,ps:710,accel:2.9,weight:1435,price:270000} },
  { name: "McLaren 720S", stats:{speed:341,ps:710,accel:2.8,weight:1419,price:280000} },
  { name: "Aston Martin DB11", stats:{speed:322,ps:630,accel:3.9,weight:1775,price:200000} },
  { name: "Chevrolet Camaro SS", stats:{speed:250,ps:455,accel:4.0,weight:1735,price:48000} },
  { name: "Dodge Challenger Hellcat", stats:{speed:320,ps:717,accel:3.7,weight:1950,price:70000} },
  { name: "Nissan GT-R", stats:{speed:315,ps:565,accel:2.9,weight:1740,price:120000} },
  { name: "Subaru WRX STI", stats:{speed:255,ps:310,accel:4.9,weight:1570,price:42000} },
  { name: "Toyota Supra", stats:{speed:250,ps:340,accel:4.3,weight:1490,price:54000} },
  { name: "Mazda MX-5", stats:{speed:215,ps:184,accel:6.5,weight:1050,price:33000} },
  { name: "Alfa Romeo Giulia QF", stats:{speed:307,ps:510,accel:3.9,weight:1620,price:85000} },

  { name: "Kia Stinger GT", stats:{speed:270,ps:365,accel:4.9,weight:1840,price:55000} },
  { name: "Hyundai i30 N", stats:{speed:250,ps:280,accel:5.7,weight:1450,price:37000} },
  { name: "Seat Leon Cupra", stats:{speed:250,ps:300,accel:5.8,weight:1380,price:36000} },
  { name: "Skoda Octavia RS", stats:{speed:250,ps:245,accel:6.4,weight:1460,price:38000} },
  { name: "Citroën C3 Aircross", stats:{speed:180,ps:110,accel:11.0,weight:1200,price:21000} },
  { name: "VW ID.4", stats:{speed:180,ps:204,accel:8.5,weight:2000,price:47000} },
  { name: "Tesla Model 3 LR", stats:{speed:233,ps:450,accel:4.4,weight:1845,price:62000} },
  { name: "Jaguar F-Type", stats:{speed:300,ps:450,accel:4.1,weight:1620,price:90000} },
  { name: "Bentley Continental GT", stats:{speed:333,ps:635,accel:3.7,weight:2350,price:220000} },
  { name: "Rolls-Royce Phantom", stats:{speed:250,ps:563,accel:5.3,weight:2560,price:450000} },

  { name: "Mini Cooper S", stats:{speed:235,ps:192,accel:6.8,weight:1280,price:32000} },
  { name: "Fiat 500 Abarth", stats:{speed:210,ps:165,accel:7.5,weight:1065,price:26000} },
  { name: "Peugeot 208 GTi", stats:{speed:230,ps:208,accel:6.6,weight:1140,price:29000} },
  { name: "Toyota Land Cruiser", stats:{speed:190,ps:275,accel:9.8,weight:2450,price:80000} },
  { name: "Land Rover Defender", stats:{speed:210,ps:300,accel:8.4,weight:2400,price:75000} },
  { name: "Volvo XC90", stats:{speed:230,ps:320,accel:7.6,weight:2100,price:70000} },
  { name: "Ford F-150 Raptor", stats:{speed:180,ps:450,accel:5.5,weight:2600,price:90000} },
  { name: "Ram 1500 TRX", stats:{speed:195,ps:702,accel:4.5,weight:2700,price:90000} },
  { name: "KTM X-Bow", stats:{speed:235,ps:300,accel:3.9,weight:790,price:90000} },
  { name: "Pagani Huayra", stats:{speed:370,ps:730,accel:2.8,weight:1350,price:1500000} },

  { name: "Bugatti Chiron", stats:{speed:420,ps:1500,accel:2.4,weight:1995,price:3000000} },
  { name: "McLaren Artura", stats:{speed:330,ps:671,accel:3.0,weight:1495,price:220000} },
  { name: "Toyota Prius", stats:{speed:180,ps:122,accel:10.5,weight:1380,price:30000} },
  { name: "Honda Accord", stats:{speed:210,ps:192,accel:7.9,weight:1500,price:35000} },
  { name: "Skoda Fabia", stats:{speed:185,ps:95,accel:13.2,weight:980,price:17000} },
  { name: "Mitsubishi Lancer Evo", stats:{speed:255,ps:295,accel:5.0,weight:1420,price:45000} }
];

// ---------------- State & UI refs ----------------
let deck = [], playerDeck = [], computerDeck = [];
let playerTurn = true, busy = false;
let autoPlay = false, soundOn = true;
let startTime = null;

const playerCardEl = () => document.getElementById('player-card');
const computerCardEl = () => document.getElementById('computer-card');
const nextBtn = () => document.getElementById('next-round');
const statButtonsContainer = () => document.getElementById('stat-buttons');
const roundMessageEl = () => document.getElementById('round-message');
const playerCountEl = () => document.getElementById('player-count');
const computerCountEl = () => document.getElementById('computer-count');
const playerProgress = () => document.getElementById('player-progress');
const computerProgress = () => document.getElementById('computer-progress');
const logEl = () => document.getElementById('log');
const gamesPlayedEl = () => document.getElementById('games-played');
const bestTimeEl = () => document.getElementById('best-time');
const autoPlayBtn = () => document.getElementById('auto-play');
const soundBtn = () => document.getElementById('toggle-sound');

// ---------------- Utilities ----------------
function log(msg){
  const el = logEl();
  if (!el) return;
  const d = document.createElement('div');
  d.textContent = `${new Date().toLocaleTimeString()} — ${msg}`;
  el.prepend(d);
}
function shuffle(a){ for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } }

// Create Unsplash dynamic URL for a model name (fallback used if external blocked)
function makeImageUrlFor(name){
  const q = encodeURIComponent(name + ", car");
  return `https://source.unsplash.com/800x450/?${q}`;
}

// SVG placeholder data-uri
function makeSvgPlaceholder(text,w=800,h=450){
  const bg = "#e6eef6", fg = "#072033";
  const short = text.length>30 ? text.slice(0,30)+"…" : text;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>
    <rect width='100%' height='100%' fill='${bg}'/>
    <text x='50%' y='50%' font-family='Arial, Helvetica, sans-serif' font-size='28' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${short}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ---------------- Rendering ----------------
function renderCard(container, card, showStats=true, flipped=false){
  if (!container) return;
  container.innerHTML = '';
  if (!card){
    container.className = 'card empty';
    container.textContent = 'Keine Karte';
    return;
  }
  container.className = 'card' + (flipped ? ' flip' : '');
  // media
  const media = document.createElement('div'); media.className = 'card-media';
  const img = document.createElement('img'); img.alt = card.name; img.loading='lazy';
  img.src = makeImageUrlFor(card.name);
  img.onerror = () => { img.onerror=null; img.src = makeSvgPlaceholder(card.name); };
  media.appendChild(img);
  container.appendChild(media);

  const body = document.createElement('div'); body.className='card-body';
  const title = document.createElement('div'); title.className='title'; title.textContent = card.name;
  body.appendChild(title);

  if (showStats){
    const statsDiv = document.createElement('div'); statsDiv.className='stats';
    const keys = ['speed','ps','accel','weight','price'];
    const labels = {speed:"Top-Speed (km/h)", ps:"PS", accel:"0-100 (s)", weight:"Gewicht (kg)", price:"Preis (€)"};
    keys.forEach(k => {
      const st = document.createElement('div'); st.className='stat'; st.dataset.key = k;
      const l = document.createElement('span'); l.textContent = labels[k] || k;
      const r = document.createElement('strong'); 
      const val = (card.stats && card.stats[k] !== undefined) ? card.stats[k] : '—';
      r.textContent = k==='price' && typeof val==='number' ? val.toLocaleString() : val;
      st.appendChild(l); st.appendChild(r);
      statsDiv.appendChild(st);
    });
    body.appendChild(statsDiv);
  }
  container.appendChild(body);
}

// update counts + progress
function updateCounts(){
  playerCountEl() && (playerCountEl().textContent = `Du: ${playerDeck.length} Karten`);
  computerCountEl() && (computerCountEl().textContent = `Computer: ${computerDeck.length} Karten`);
  playerProgress() && (playerProgress().value = playerDeck.length);
  computerProgress() && (computerProgress().value = computerDeck.length);
  gamesPlayedEl() && (gamesPlayedEl().textContent = `Gespielt: ${getStats().played || 0}`);
  const best = getStats().bestTime;
  bestTimeEl() && (bestTimeEl().textContent = best ? `Beste Zeit: ${Math.round(best/1000)}s` : "Beste Zeit: —");
}

// setup stat buttons if playerTurn
function setupStatButtons(){
  const cont = statButtonsContainer();
  if (!cont) return;
  cont.innerHTML = '';
  if (playerDeck.length===0 || computerDeck.length===0) return;
  if (!playerTurn || busy) return;
  const keys = Object.keys(playerDeck[0].stats || {});
  const labels = {speed:"Top-Speed (km/h)", ps:"PS", accel:"0-100 (s)", weight:"Gewicht (kg)", price:"Preis (€)"};
  keys.forEach(k => {
    const b = document.createElement('button'); b.className='stat-btn'; b.textContent = labels[k] || k;
    b.onclick = () => { playerChooseStat(k); };
    cont.appendChild(b);
  });
}

// ---------------- Game Logic ----------------
function newGame(){
  deck = JSON.parse(JSON.stringify(CAR_CARDS));
  shuffle(deck);
  playerDeck = []; computerDeck = [];
  deck.forEach((c,i)=>{ if (i%2===0) playerDeck.push(c); else computerDeck.push(c); });
  playerTurn = true; busy = false; startTime = Date.now();
  updateCounts();
  roundMessageEl() && (roundMessageEl().textContent = "Spiel gestartet — du bist dran!");
  log("Neues Spiel gestartet.");
  renderHands(false);
  nextBtn() && (nextBtn().textContent = "Nächste Runde");
}

function renderHands(showComputer=false){
  renderCard(playerCardEl(), playerDeck[0] || null, true, false);
  if (showComputer) renderCard(computerCardEl(), computerDeck[0] || null, true, true);
  else {
    if (computerDeck.length===0) renderCard(computerCardEl(), null,false,false);
    else { computerCardEl().className='card back'; computerCardEl().innerHTML='Verdeckt'; }
  }
  setupStatButtons();
}

function highlightStat(container, key, status){
  if (!container) return;
  const statEls = container.querySelectorAll('.stat');
  statEls.forEach(s => {
    if (s.dataset.key === key){
      s.classList.remove('win','lose');
      if (status==='win') s.classList.add('win');
      else if (status==='lose') s.classList.add('lose');
    } else s.classList.remove('win','lose');
  });
}

// improved CPU selection: evaluate relative strengths and choose with bias
function cpuChooseStatHeuristic(){
  const myCard = computerDeck[0];
  const keys = Object.keys(myCard.stats);
  // compute z-score like measure across deck (simple approach: compare this card stat to median of all cards for that stat)
  const statScores = {};
  keys.forEach(k => {
    // average value across sample deck
    const avg = CAR_CARDS.reduce((acc,c)=>acc+(c.stats[k]||0),0)/CAR_CARDS.length;
    const val = myCard.stats[k];
    // for accel smaller is better -> invert
    const score = (k==='accel') ? (avg/val) : (val/avg);
    statScores[k] = score;
  });
  // pick highest score with some randomness
  const entries = Object.entries(statScores).sort((a,b)=>b[1]-a[1]);
  // With 70% probability pick top, else random among top3
  if (Math.random() < 0.7) return entries[0][0];
  const top3 = entries.slice(0,3).map(e=>e[0]);
  return top3[Math.floor(Math.random()*top3.length)];
}

// reveal, compare, move cards
function revealAndResolve(statKey){
  renderHands(true);
  const pCard = playerDeck[0], cCard = computerDeck[0];
  if (!pCard || !cCard){ return; }
  const pVal = pCard.stats[statKey], cVal = cCard.stats[statKey];
  const smallerBetter = (statKey === 'accel');
  let winner = null;
  if (pVal === cVal) winner = 'tie';
  else if (smallerBetter) winner = (pVal < cVal) ? 'player' : 'computer';
  else winner = (pVal > cVal) ? 'player' : 'computer';

  // highlight
  highlightStat(playerCardEl(), statKey, winner==='player' ? 'win' : (winner==='computer' ? 'lose' : ''));
  highlightStat(computerCardEl(), statKey, winner==='computer' ? 'win' : (winner==='player' ? 'lose' : ''));

  // short delay
  setTimeout(() => {
    if (winner === 'player'){
      log(`Du gewinnst: ${pCard.name} (${pVal}) > ${cCard.name} (${cVal})`);
      playerDeck.push(playerDeck.shift()); playerDeck.push(computerDeck.shift());
      playerTurn = true;
      playTone(880, 0.06);
      roundMessageEl() && (roundMessageEl().textContent = `Du gewinnst die Runde! (${pVal} vs ${cVal})`);
    } else if (winner === 'computer'){
      log(`Computer gewinnt: ${cCard.name} (${cVal}) > ${pCard.name} (${pVal})`);
      computerDeck.push(computerDeck.shift()); computerDeck.push(playerDeck.shift());
      playerTurn = false;
      playTone(220, 0.08);
      roundMessageEl() && (roundMessageEl().textContent = `Computer gewinnt die Runde (${cVal} vs ${pVal})`);
    } else {
      log(`Unentschieden: ${pCard.name} (${pVal}) = ${cCard.name} (${cVal})`);
      playerDeck.push(playerDeck.shift()); computerDeck.push(computerDeck.shift());
      roundMessageEl() && (roundMessageEl().textContent = `Unentschieden! (${pVal})`);
      playTone(440, 0.04);
    }
    updateCounts();
    checkForEnd();
    renderHands(false);
    busy = false;

    // if CPU next, maybe auto play
    if (!playerTurn && computerDeck.length>0 && playerDeck.length>0){
      setTimeout(() => {
        if (!busy) {
          busy = true;
          if (autoPlay) {
            const choice = cpuChooseStatHeuristic();
            roundMessageEl() && (roundMessageEl().textContent = `Computer wählt ${choice}`);
            revealAndResolve(choice);
          } else {
            // CPU chooses and plays
            const choice = cpuChooseStatHeuristic();
            computerChooseStat(choice);
          }
        }
      }, 700);
    }
  }, 800);
}

// player chooses
function playerChooseStat(key){
  if (busy) return;
  busy = true;
  roundMessageEl() && (roundMessageEl().textContent = `Du wählst ${key}`);
  revealAndResolve(key);
}

// computer chooses and resolves
function computerChooseStat(key){
  if (!key) key = cpuChooseStatHeuristic();
  roundMessageEl() && (roundMessageEl().textContent = `Computer wählt ${key}`);
  log(`Computer wählt ${key}`);
  setTimeout(()=> { revealAndResolve(key); }, 700);
}

function checkForEnd(){
  if (computerDeck.length === 0){
    roundMessageEl() && (roundMessageEl().textContent = "Glückwunsch — du hast gewonnen!");
    log("Spielende: Spieler hat alle Karten.");
    busy = true;
    nextBtn() && (nextBtn().textContent = "Neues Spiel");
    recordStats(true);
  } else if (playerDeck.length === 0){
    roundMessageEl() && (roundMessageEl().textContent = "Der Computer hat gewonnen — schade!");
    log("Spielende: Computer hat alle Karten.");
    busy = true;
    nextBtn() && (nextBtn().textContent = "Neues Spiel");
    recordStats(false);
  }
}

// ---------------- Persistence (localStorage highscores) ----------------
function getStats(){
  try {
    const raw = localStorage.getItem('autotrumpf_stats');
    return raw ? JSON.parse(raw) : { played:0, bestTime:null };
  } catch(e){ return {played:0, bestTime:null}; }
}
function setStats(s){
  localStorage.setItem('autotrumpf_stats', JSON.stringify(s));
}
function recordStats(playerWon){
  const s = getStats(); s.played = (s.played||0)+1;
  const elapsed = Date.now() - startTime;
  if (playerWon) {
    if (!s.bestTime || elapsed < s.bestTime) s.bestTime = elapsed;
  }
  setStats(s);
  updateCounts();
}

// ---------------- Sound (WebAudio simple tones) ----------------
let audioCtx = null;
function playTone(freq=440, duration=0.05){
  if (!soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(g);
    g.connect(audioCtx.destination);
    g.gain.value = 0.02;
    o.start();
    setTimeout(()=>{ o.stop(); }, duration*1000);
  } catch(e){ /* ignore */ }
}

// ---------------- Events & init ----------------
document.addEventListener('DOMContentLoaded', () => {
  // wire up buttons
  nextBtn() && nextBtn().addEventListener('click', () => {
    if (playerDeck.length===0 || computerDeck.length===0 || busy){
      newGame();
    } else {
      if (playerTurn){
        roundMessageEl() && (roundMessageEl().textContent = "Du bist dran — wähle eine Kategorie.");
      } else {
        busy = true;
        setTimeout(()=> { computerChooseStat(); }, 400);
      }
    }
  });

  autoPlayBtn() && autoPlayBtn().addEventListener('click', () => {
    autoPlay = !autoPlay;
    autoPlayBtn().textContent = `Auto: ${autoPlay ? 'An' : 'Aus'}`;
    log(`AutoPlay ${autoPlay ? 'aktiviert' : 'deaktiviert'}`);
  });

  soundBtn() && soundBtn().addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn().textContent = `Sound: ${soundOn ? 'An' : 'Aus'}`;
  });

  // initial UI
  playerCardEl() && (playerCardEl().className = 'card empty', playerCardEl().innerHTML = 'Keine Karte');
  computerCardEl() && (computerCardEl().className = 'card back', computerCardEl().innerHTML = 'Verdeckt');
  roundMessageEl() && (roundMessageEl().textContent = "Klicke 'Neues Spiel' um zu starten.");
  updateCounts();
});

// expose helpful debug
window.AutoTrumpf = { newGame, getStats };

// ---------------- Auto-play helper: allow starting an auto match ----------------
// (not activated automatically)
