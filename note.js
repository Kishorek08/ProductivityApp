/* TAB SWITCHING */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelector(".tab-btn.active").classList.remove("active");
    btn.classList.add("active");

    document.querySelector(".page.active").classList.remove("active");
    document.getElementById(btn.dataset.target).classList.add("active");
  };
});

/* ==================== CALENDAR ==================== */
const daysContainer = document.getElementById("days");
const monthYearText = document.getElementById("monthYear");
const eventBox = document.getElementById("eventBox");
const eventInput = document.getElementById("eventInput");
const selectedDateText = document.getElementById("selectedDateText");

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();
let events = JSON.parse(localStorage.getItem("calendarEvents") || "{}");
let selectedDate = null;

function renderCalendar() {
  daysContainer.innerHTML = "";
  monthYearText.textContent = `${date.toLocaleString("default", { month: "long" })} ${currentYear}`;

  let firstDay = new Date(currentYear, currentMonth, 1).getDay();
  let totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    daysContainer.innerHTML += `<div></div>`;
  }

  for (let d = 1; d <= totalDays; d++) {
    let dayDiv = document.createElement("div");
    dayDiv.textContent = d;

    let key = `${currentYear}-${currentMonth + 1}-${d}`;
    if (events[key]) {
      dayDiv.style.background = "#ffeaa7";
    }

    dayDiv.onclick = () => openEventBox(d);

    daysContainer.appendChild(dayDiv);
  }
}

function openEventBox(day) {
  selectedDate = `${currentYear}-${currentMonth + 1}-${day}`;
  selectedDateText.textContent = "Date: " + selectedDate;

  eventInput.value = events[selectedDate] || "";
  eventBox.classList.remove("hidden");
}

document.getElementById("saveEvent").onclick = () => {
  events[selectedDate] = eventInput.value;
  localStorage.setItem("calendarEvents", JSON.stringify(events));
  eventBox.classList.add("hidden");
  renderCalendar();
};

document.getElementById("closeEventBox").onclick = () => {
  eventBox.classList.add("hidden");
};

document.getElementById("prev").onclick = () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  date = new Date(currentYear, currentMonth);
  renderCalendar();
};

document.getElementById("next").onclick = () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  date = new Date(currentYear, currentMonth);
  renderCalendar();
};

renderCalendar();

/* ==================== NOTES APP ==================== */
const addNoteBtn = document.getElementById("addNote");
const notesContainer = document.getElementById("notesContainer");
const noteColor = document.getElementById("noteColor");

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("notesApp") || "[]");
  saved.forEach(n => createNote(n.text, n.color));
}

function saveNotes() {
  const notes = [];
  document.querySelectorAll(".note").forEach(note => {
    notes.push({
      text: note.querySelector("textarea").value,
      color: note.style.background
    });
  });
  localStorage.setItem("notesApp", JSON.stringify(notes));
}

function createNote(text = "", color = noteColor.value) {
  const note = document.createElement("div");
  note.className = "note";
  note.style.background = color;

  note.innerHTML = `
    <button onclick="this.parentElement.remove(); saveNotes()">X</button>
    <textarea oninput="saveNotes()">${text}</textarea>
  `;

  notesContainer.appendChild(note);
  saveNotes();
}

addNoteBtn.onclick = () => createNote();
loadNotes();
