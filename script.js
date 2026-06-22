/* ========== Personalize these ========== */
const HER_NAME = "Sayang";
const YOUR_NAME = "Adam";

const REASONS = [
  { icon: "♥", text: "Your smile is the first thing I look for — and the best part of my day." },
  { icon: "✨", text: "You make ordinary moments feel like little adventures." },
  { icon: "🌙", text: "Even on hard days, knowing you're there makes everything softer." },
  { icon: "🌸", text: "You listen, you care, and you love in a way that feels like home." },
  { icon: "💫", text: "With you, I don't have to pretend — I can just be myself, fully." },
  { icon: "∞", text: "I keep falling for you — not once, but again and again." },
];

const MOMENTS = [
  "The way you laugh at the smallest things",
  "Late-night talks that I never want to end",
  "Your hand in mine — simple, but everything",
  "Every plan we make, because it's with you",
  "The quiet comfort of just being together",
];

const LETTER_PARAGRAPHS = [
  "I don't think I tell you enough how deeply you mean to me. You are not just someone I love — you are the person who changed how I see love itself.",
  "Before you, I thought love was a big dramatic thing. With you, I learned it's in the small things: your voice, your kindness, the way you make me feel chosen every single day.",
  "I am grateful for you — for your heart, your patience, and the beautiful soul you share with me. I want to keep choosing you, in every season, in every mood, in every tomorrow.",
  "So this little page is my way of saying: I love you. Not just today. Not just when it's easy. I love you in the quiet ways and the loud ones. I love you, and I'm proud to be yours.",
];

const CLOSING_QUOTE =
  "\"You are my favorite person, my safest place, and the love story I never want to end.\"";

/* ========== DOM setup ========== */
document.getElementById("her-name").textContent = HER_NAME;
document.querySelector(".closing-name").textContent = `— ${YOUR_NAME}`;

const reasonsGrid = document.getElementById("reasons-grid");
REASONS.forEach((reason, i) => {
  const card = document.createElement("article");
  card.className = "reason-card";
  card.innerHTML = `
    <span class="reason-icon" aria-hidden="true">${reason.icon}</span>
    <p class="reason-text">${reason.text}</p>
  `;
  card.style.transitionDelay = `${i * 0.08}s`;
  reasonsGrid.appendChild(card);
});

const timelineList = document.getElementById("timeline-list");
MOMENTS.forEach((moment, i) => {
  const li = document.createElement("li");
  li.className = "timeline-item";
  li.innerHTML = `
    <span class="timeline-dot" aria-hidden="true"></span>
    <p class="timeline-text">${moment}</p>
  `;
  li.style.transitionDelay = `${i * 0.1}s`;
  timelineList.appendChild(li);
});

const letterBody = document.getElementById("letter-body");
LETTER_PARAGRAPHS.forEach((para) => {
  const p = document.createElement("p");
  p.textContent = para;
  letterBody.appendChild(p);
});

document.getElementById("closing-quote").textContent = CLOSING_QUOTE;

/* ========== Love counter ========== */
let loveCount = 100;
const counterEl = document.getElementById("love-counter");

function formatLove(n) {
  return n >= 1000000 ? "∞" : n.toLocaleString();
}

function updateCounter(target) {
  const start = loveCount;
  const diff = target - start;
  const duration = 600;
  const startTime = performance.now();

  function tick(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    loveCount = Math.round(start + diff * eased);
    counterEl.textContent = formatLove(loveCount);
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

updateCounter(loveCount);

document.getElementById("add-love-btn").addEventListener("click", (e) => {
  const bump = Math.floor(Math.random() * 40) + 15;
  updateCounter(loveCount + bump);
  spawnBurst(e.clientX, e.clientY);
});

/* ========== Letter modal ========== */
const modal = document.getElementById("letter-modal");

document.getElementById("open-letter-btn").addEventListener("click", () => {
  modal.showModal();
});

document.getElementById("close-letter-btn").addEventListener("click", () => {
  modal.close();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

/* ========== Scroll reveal ========== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reason-card, .timeline-item").forEach((el) => {
  revealObserver.observe(el);
});

/* ========== Heart burst on click ========== */
function spawnBurst(x, y) {
  const hearts = ["♥", "♡", "💕", "✨"];
  for (let i = 0; i < 8; i++) {
    const el = document.createElement("span");
    el.className = "burst-heart";
    el.textContent = hearts[i % hearts.length];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const angle = (Math.PI * 2 * i) / 8;
    const dist = 40 + Math.random() * 50;
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist - 30}px`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  }
}

document.addEventListener("click", (e) => {
  if (e.target.closest("button, dialog, .letter-close")) return;
  if (Math.random() > 0.65) spawnBurst(e.clientX, e.clientY);
});

/* ========== Floating hearts canvas ========== */
const canvas = document.getElementById("hearts-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
let w, h;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

class Heart {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * w;
    this.y = initial ? Math.random() * h : h + 20;
    this.size = 6 + Math.random() * 10;
    this.speed = 0.3 + Math.random() * 0.6;
    this.drift = (Math.random() - 0.5) * 0.4;
    this.opacity = 0.15 + Math.random() * 0.25;
    this.phase = Math.random() * Math.PI * 2;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = "#c45c7a";
    ctx.translate(this.x, this.y);
    ctx.scale(this.size / 16, this.size / 16);
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 0, -8, 0, -8, 4);
    ctx.bezierCurveTo(-8, 8, 0, 12, 0, 16);
    ctx.bezierCurveTo(0, 12, 8, 8, 8, 4);
    ctx.bezierCurveTo(8, 0, 0, 0, 0, 4);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.y -= this.speed;
    this.x += this.drift + Math.sin(this.phase + this.y * 0.02) * 0.3;
    if (this.y < -20) this.reset();
  }
}

for (let i = 0; i < 28; i++) particles.push(new Heart());

function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

animate();