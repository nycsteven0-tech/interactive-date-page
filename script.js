const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyk7qbguvL-co7wSxQ9YG49rGyr3A2PWRK0xyez8VMXV2hpX6OisPOnpjANghtTlLY/exec";

let currentPage = 1;
let selectedDate = "";
let selectedTime = "";
let calendarDate = new Date();
let heartsStarted = false;

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("page1")?.classList.add("active");

  const noBtn = document.getElementById("noBtn");
  if (noBtn) {
    noBtn.addEventListener("mouseover", moveButton);
  }

  renderCalendar();
});

function nextPage(page) {
  document.getElementById(`page${page}`)?.classList.remove("active");
  document.getElementById(`page${page + 1}`)?.classList.add("active");
  currentPage++;
}

function sayYes() {
  sendToSheet({
    response: "Yes 😍 - Waiting for date/time",
    selectedDate: "",
    selectedTime: ""
  });

  document.getElementById("page3")?.classList.remove("active");
  document.getElementById("page4")?.classList.add("active");

  document.body.style.transition = "background 1.5s ease";
  document.body.style.background = "linear-gradient(-45deg, #ffb6c1, #ffd1dc, #ffe4ec)";

  confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

  setTimeout(() => {
    confetti({ particleCount: 100, spread: 120 });
  }, 500);

  playMusicFadeIn();
}

function sayNo() {
  sendToSheet({
    response: "No 🙈",
    selectedDate: "",
    selectedTime: ""
  });

  alert("That answer is currently under review... 🤔");
}

function moveButton() {
  const noBtn = document.getElementById("noBtn");
  const container = document.querySelector(".container");

  if (!noBtn || !container) return;

  const rect = container.getBoundingClientRect();

  const x = Math.random() * (rect.width - 160);
  const y = Math.random() * (rect.height - 90);

  noBtn.style.position = "absolute";
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  const phrases = ["Nah 😏", "Try again 😂", "Not today 😌", "You sure? 👀"];
  noBtn.innerText = phrases[Math.floor(Math.random() * phrases.length)];
}

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

      if (!heartsStarted) {
        heartsStarted = true;
        startHeartParticles();
      }
    }
  }, 100);
}

function startHeartParticles() {
  setInterval(createHeart, 250);
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

function renderCalendar() {
  const monthYear = document.getElementById("monthYear");
  const daysGrid = document.getElementById("daysGrid");

  if (!monthYear || !daysGrid) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  monthYear.innerText = `${monthNames[month]} ${year}`;
  daysGrid.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    daysGrid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayButton = document.createElement("div");
    const thisDate = new Date(year, month, day);
    const dayOfWeek = thisDate.getDay();

    dayButton.classList.add("day");
    dayButton.innerText = day;

    if (thisDate < today || dayOfWeek === 2 || dayOfWeek === 3) {
      dayButton.classList.add("disabled");
      dayButton.title = "Tuesdays and Wednesdays are usually busy for me 😅";
    }

    dayButton.addEventListener("click", () => {
      pickDate(dayButton, day, month, year);
    });

    daysGrid.appendChild(dayButton);
  }
}

function changeMonth(direction) {
  calendarDate.setMonth(calendarDate.getMonth() + direction);
  selectedDate = "";
  selectedTime = "";

  document.getElementById("timesPanel")?.classList.remove("show");
  document.querySelectorAll(".times-grid button").forEach(btn => btn.classList.remove("selected"));

  renderCalendar();
}

function pickDate(dayButton, day, month, year) {
  document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));

  dayButton.classList.add("selected");
  selectedDate = `${monthNames[month]} ${day}, ${year}`;

  document.getElementById("timesPanel")?.classList.add("show");
}

function pickTime(button, time) {
  selectedTime = time;

  document.querySelectorAll(".times-grid button").forEach(btn => {
    btn.classList.remove("selected");
  });

  button.classList.add("selected");
}

function confirmReservation() {
  const result = document.getElementById("reservationResult");

  if (!selectedDate || !selectedTime) {
    alert("Pick a date and time first ❤️");
    return;
  }

  sendToSheet({
    response: "Reservation confirmed ❤️",
    selectedDate: selectedDate,
    selectedTime: selectedTime
  });

  result.innerHTML = `
    ✨ Perfect ❤️ Your reservation with Steven has been confirmed ✨<br><br>
    📅 <strong>${selectedDate}</strong><br>
    🕒 <strong>${selectedTime}</strong><br><br>
    Looking forward to seeing you 😌<br><br>
    ❤️ Thanks for saying yes ❤️
  `;

  confetti({ particleCount: 120, spread: 90, origin: { y: 0.65 } });
}

function sendToSheet(data) {
  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  }).catch(err => console.log("Error sending:", err));
}
