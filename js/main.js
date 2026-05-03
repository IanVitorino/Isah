// --- Lenis: scroll suave ---
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- AOS: aparecer no scroll ---
AOS.init({
  duration: 900,
  easing: "ease-out-cubic",
  once: true,
  offset: 80,
});

// --- Typed.js: poema digitando, dispara quando entra na tela ---
const poemPlaceholder = `Sabia que é muito difícil entender?
É muito difícil sentir
Você faz isso sem perceber
Mas é até difícil te ver sorrir
Pessoas como você são raras
Quando vê algo difícil, encara
Acho que já vi isso em algum lugar...
Será a toca de um <span class="polvo-glow">polvo</span> no fundo do mar?`;

const poemEl = document.getElementById("poem-text");
let poemStarted = false;

const poemObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !poemStarted) {
        poemStarted = true;
        new Typed("#poem-text", {
          strings: [poemPlaceholder],
          typeSpeed: 38,
          backSpeed: 0,
          showCursor: true,
          cursorChar: "|",
          smartBackspace: false,
          onComplete: (self) => {
            const cursor = document.querySelector(".typed-cursor");
            if (cursor) {
              cursor.style.transition = "opacity 0.6s ease";
              cursor.style.opacity = "0";
              setTimeout(() => cursor.remove(), 700);
            }
            const meaning = document.getElementById("polvo-meaning");
            if (meaning) {
              setTimeout(() => {
                meaning.classList.add("visible");
                meaning.setAttribute("aria-hidden", "false");
              }, 900);
            }
            celebrate();
          },
        });
      }
    });
  },
  { threshold: 0.4 }
);

poemObserver.observe(document.querySelector(".poem"));

// --- Helper: sortear sem repetir o último ---
function pickRandomIndex(length, lastIndex) {
  if (length <= 1) return 0;
  let idx;
  do {
    idx = Math.floor(Math.random() * length);
  } while (idx === lastIndex);
  return idx;
}

// --- Biscoito da sorte ---
const cookieMessages = [
  "você é mais forte do que imagina",
  "sua existência alegra muita gente — eu incluso.",
  "dias difíceis também acabam. esse vai acabar.",
  "tem alguém aqui torcendo por você sempre.",
  "seu jeito é bonito. nunca esqueça disso.",
  "você merece o mesmo carinho que dá pros outros.",
  "uma coisa boa tá vindo. acredita.",
  "você é linda, acredite",
  "sua alegria também me alegra",
  "se precisar, eu to aqui (me manda uma mensagem)",
];

const cookieBtn = document.getElementById("cookie-btn");
const cookieMessageEl = document.getElementById("cookie-message");
const cookieAgainBtn = document.getElementById("cookie-again");
let lastCookieIndex = -1;

function openCookie() {
  cookieBtn.classList.add("shaking");
  cookieMessageEl.classList.remove("visible");

  setTimeout(() => {
    cookieBtn.classList.remove("shaking");
    const idx = pickRandomIndex(cookieMessages.length, lastCookieIndex);
    lastCookieIndex = idx;
    cookieMessageEl.textContent = `“${cookieMessages[idx]}”`;
    cookieMessageEl.classList.add("visible");
    cookieAgainBtn.classList.remove("hidden");

    confetti({
      particleCount: 26,
      spread: 60,
      startVelocity: 26,
      origin: { y: 0.55 },
      colors: ["#c9a8e8", "#edd8ff", "#7c5ba9", "#b89fe0"],
      gravity: 0.5,
      scalar: 0.7,
      ticks: 120,
    });
  }, 480);
}

cookieBtn.addEventListener("click", openCookie);
cookieAgainBtn.addEventListener("click", openCookie);

// --- Palavra de hoje ---
const wordPool = [
  { word: "coragem", meaning: "porque você enfrenta o que vem, mesmo quando dói." },
  { word: "doçura", meaning: "porque você cuida de quem ama com uma delicadeza rara." },
  { word: "força", meaning: "porque você continua, mesmo quando tudo pesa." },
  { word: "luz", meaning: "porque até nos seus dias mais cinzas, você ilumina alguém." },
  { word: "resiliência", meaning: "porque você se reergue, devagar, mas sempre se reergue." },
  { word: "presença", meaning: "porque estar perto de você acalma quem chega." },
  { word: "amor", meaning: "porque você ama com inteireza, sem economia." },
  { word: "paciência", meaning: "porque você sabe esperar — por si, pelos outros, pelo tempo." },
  { word: "ternura", meaning: "porque o seu olhar tem um jeito de fazer a gente se sentir em casa." },
  { word: "coragem silenciosa", meaning: "porque você tem aguentado coisas que ninguém vê." },
];

const wordDisplay = document.getElementById("word-display");
const wordMeaning = document.getElementById("word-meaning");
const wordBtn = document.getElementById("word-btn");
let lastWordIndex = -1;

wordBtn.addEventListener("click", () => {
  wordDisplay.classList.add("changing");
  wordMeaning.classList.add("changing");

  setTimeout(() => {
    const idx = pickRandomIndex(wordPool.length, lastWordIndex);
    lastWordIndex = idx;
    wordDisplay.textContent = wordPool[idx].word;
    wordMeaning.textContent = wordPool[idx].meaning;
    wordDisplay.classList.remove("changing");
    wordMeaning.classList.remove("changing");
    wordBtn.textContent = "outra palavra";
  }, 380);
});

// --- Cápsula de humor ---
const moodMessages = {
  triste:
    "tudo bem chorar. tudo bem não estar bem hoje. você não precisa explicar nem se desculpar — eu te abraço daqui.",
  abraco:
    "considera-se abraçada. forte, demorado, daqueles de fechar os olhos. você é amada, mesmo nos dias em que esquece disso.",
  ansiosa:
    "respira. inspira em 4, segura em 4, solta em 6. o que tá pra acontecer não te define agora — só esse instante existe.",
  bem:
    "guarda esse dia bem guardadinho. é muito bom te ver feliz. seu sorriso é precioso.",
  saudade:
    "saudade é amor que não cabe no presente. é a prova de que algo importou. tá tudo certo sentir — sente sem pressa de passar.",
  forca:
    "você já enfrentou coisas que achava que não ia aguentar. você aguentou. e vai aguentar de novo, do seu jeito, no seu tempo.",
};

const moodMessageEl = document.getElementById("mood-message");
const moodBtns = document.querySelectorAll(".mood-btn");

moodBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    moodBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const mood = btn.dataset.mood;
    const msg = moodMessages[mood] || "";

    moodMessageEl.classList.add("fading");
    setTimeout(() => {
      moodMessageEl.classList.remove("empty");
      moodMessageEl.textContent = msg;
      moodMessageEl.classList.remove("fading");
    }, 320);
  });
});

// --- Confetti suave ao terminar o poema ---
function celebrate() {
  const colors = ["#7c5ba9", "#b89fe0", "#e8def8", "#5a3d87", "#d4bff0"];
  const end = Date.now() + 1200;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      startVelocity: 35,
      origin: { x: 0, y: 0.7 },
      colors,
      gravity: 0.6,
      scalar: 0.9,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      startVelocity: 35,
      origin: { x: 1, y: 0.7 },
      colors,
      gravity: 0.6,
      scalar: 0.9,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
