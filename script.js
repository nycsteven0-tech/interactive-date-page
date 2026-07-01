const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwGf0e_5TLfin7Lgbs7W-DCfKsNZDvJWaP2JB9h4YqxsO6EZ6IH52IriDN55WXgArQ/exec";
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
  sendToSheet("Yes 😍 - Waiting for date/time");

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
  sendToSheet("No 🙈");

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

  renderCalendar();
});

// RUNAWAY BUTTON
function moveButton() {
  const noBtn = document.getElementById("noBtn");
  const container = document.querySelector(".container");

  const containerRect = container.getBoundingClientRect();

  const x = Math.random() * (containerRect.width - 150);
  const y = Math.random() * (containerRect.height - 100);

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";

  const phrases = [
    "Nah 😏",
    "Try again 😂",
    "Not today 😌",
    "You sure? 👀"
  ];

  noBtn.innerText =
    phrases[Math.floor(Math.random() * phrases.length)];
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

function sendToSheet(answer) {
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      answer: answer,
      time: new Date().toLocaleString()
    })
  }).catch(err => console.log("Error sending:", err));
}

function submitDate() {
  const finalText = document.getElementById("finalText");

  if (!selectedDate || !selectedTime) {
    alert("Pick a date and time first ❤️");
    return;
  }

  const reservation = `Reservation confirmed: ${selectedDate} at ${selectedTime} ❤️`;

  sendToSheet(reservation);

  finalText.innerHTML = `
    ✨ Perfect ❤️ Your reservation with Steven has been confirmed ✨<br><br>
    📅 <strong>${selectedDate}</strong><br>
    🕒 <strong>${selectedTime}</strong><br><br>
    Looking forward to seeing you 😌<br><br>
    ❤️ Thanks for saying yes ❤️
  `;
}

flatpickr("#datePicker", {
  minDate: "today",
  dateFormat: "F j, Y",
  disableMobile: true
});

let selectedDate = "";
let selectedTime = "";

let calendarDate = new Date();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function renderCalendar() {
  const calendarMonth = document.getElementById("calendarMonth");
  const calendarDays = document.getElementById("calendarDays");

  if (!calendarMonth || !calendarDays) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarMonth.innerText = `${monthNames[month]} ${year}`;
  calendarDays.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEl = document.createElement("div");
    const thisDate = new Date(year, month, day);

    dayEl.classList.add("calendar-day");
    dayEl.innerText = day;

    if (thisDate < today) {
      dayEl.classList.add("disabled");
    }

    dayEl.addEventListener("click", () => {
      selectDate(day, month, year, dayEl);
    });

    calendarDays.appendChild(dayEl);
  }
}

function selectDate(day, month, year, dayEl) {
  document.querySelectorAll(".calendar-day").forEach(d => {
    d.classList.remove("selected");
  });

  dayEl.classList.add("selected");

  selectedDate = `${monthNames[month]} ${day}, ${year}`;

  const timeSection = document.getElementById("timeSection");
  if (timeSection) {
    timeSection.classList.add("show");
  }
}

function changeMonth(direction) {
  calendarDate.setMonth(calendarDate.getMonth() + direction);
  renderCalendar();
}

function selectTime(time) {
  selectedTime = time;

  document.querySelectorAll(".time-btn").forEach(btn => {
    btn.classList.remove("selected");
  });

  event.target.classList.add("selected");
}
