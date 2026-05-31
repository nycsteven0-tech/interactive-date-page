let currentPage = 1;

// PAGE NAVIGATION
function nextPage(page) {
  const current = document.getElementById(`page${page}`);
  const next = document.getElementById(`page${page + 1}`);

  if (current) current.classList.remove("active");
  if (next) next.classList.add("active");

  currentPage++;
}

// YES BUTTON
function sayYes() {
  document.getElementById("page3").classList.remove("active");
  document.getElementById("page4").classList.add("active");

  const yesBtn = document.querySelector(".yes");
  if (yesBtn) yesBtn.disabled = true;

  document.body.style.transition = "background 1.5s ease";
  document.body.style.background = "linear-gradient(-45deg, #ffb6c1, #ffd1dc, #ffe4ec)";

  confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

  setTimeout(() => {
    confetti({ particleCount: 100, spread: 120 });
  }, 500);

  playMusicFadeIn();
  typeMessage();
}

// NO BUTTON (safe)
function sayNo() {
  alert("That answer is currently under review... 🤔");
}

// INIT ON LOAD
window.addEventListener("DOMContentLoaded", () => {
  const page1 = document.getElementById("page1");
  if (page1) page1.classList.add("active");

  const noBtn = document.getElementById("noBtn");
  if (noBtn) {
    noBtn.addEventListener("mouseover", moveButton);
  }
});

// RUNAWAY BUTTON
function moveButton() {
  const noBtn = document.getElementById("noBtn");

  const x = Math.random() * (window.innerWidth - 120);
  const y = Math.random() * (window.innerHeight - 120);

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  const phrases = ["Nah 😏", "Try again 😂", "Not today 😌"];
  noBtn.innerText = phrases[Math.floor(Math.random() * phrases.length)];
}

// TYPE MESSAGE
function typeMessage() {
  const el = document.getElementById("finalText");
  const text = "I knew you'd say yes... now let's make it a good memory 😌";

  if (!el) return;

  el.innerHTML = "";

  let i = 0;

  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, 40);
    }
  }

  typing();
}

// MUSIC FADE + START HEARTS
function playMusicFadeIn() {
  const music = document.getElementById("bgMusic");
  if (!music) return;

  music.volume = 0;
  music.play().catch(() => {});

  let volume = 0;

  const fade = setInterval(() => {
    if (volume < 0.5) {
      volume += 0.02;
      music.volume = volume;
    } else {
      clearInterval(fade);
      startHeartParticles();
    }
  }, 100);
}

// HEART SYSTEM (CLEAN + STABLE)
function startHeartParticles() {
  setInterval(() => {
    createHeart();
  }, 200);
}

function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");

  heart.innerText = "❤️";

  heart.style.left = Math.random() * window.innerWidth + "px";
  heart.style.fontSize = (14 + Math.random() * 20) + "px";
  heart.style.animationDuration = (4 + Math.random() * 3) + "s";

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}


setTimeout(() => {
  document.querySelector("#page4 h1").style.transform = "scale(1.05)";
}, 500);