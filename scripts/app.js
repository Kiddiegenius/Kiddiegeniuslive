const missions = [
  {
    skill: "MATH • COUNTING",
    title: "Rocket Math: Fuel the Ship!",
    prompt: "Gray has <strong>3</strong> Star Seeds. Connor gives him <strong>2</strong> more. How many does Gray have now?",
    answers: ["4", "5", "6"],
    correct: "5",
    reward: "You fueled the rocket with perfect counting power! 🚀"
  },
  {
    skill: "READING • PHONICS",
    title: "Story Safari: Sound Hunt!",
    prompt: "Maddy found a <strong>moon</strong>. What letter does <strong>moon</strong> start with?",
    answers: ["M", "S", "T"],
    correct: "M",
    reward: "You found the beginning sound! M is for moon! 🌙"
  },
  {
    skill: "SCIENCE • DISCOVERY",
    title: "Wonder Woods: Shadow Science!",
    prompt: "A shadow needs light and an object. What can happen when you move the object closer to a light?",
    answers: ["It can grow longer", "It disappears forever", "It becomes water"],
    correct: "It can grow longer",
    reward: "Amazing observation! You discovered how light and shadows work. 🔬"
  },
  {
    skill: "CREATIVITY • SHAPES",
    title: "Creative Camp: Shape Builder!",
    prompt: "Gray wants to build a rocket. Which shape has <strong>3 sides</strong>?",
    answers: ["Circle", "Triangle", "Square"],
    correct: "Triangle",
    reward: "You built the perfect rocket shape! Your imagination is powerful. 🎨"
  }
];

const STORAGE_KEY = "kiddie-genius-world-progress-v1";
const $ = (selector) => document.querySelector(selector);
const all = (selector) => document.querySelectorAll(selector);

let current = 0;
let stars = 0;
let completed = new Set();
let locked = false;
let rewardTimer;

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const valid = Array.isArray(saved.completed)
      ? saved.completed.filter((n) => Number.isInteger(n) && n >= 0 && n < missions.length)
      : [];
    completed = new Set(valid);
    // Recalculate rewards from completed missions so corrupted/stale totals cannot inflate stars.
    stars = completed.size;
  } catch (error) {
    console.warn("Progress could not be read; starting a fresh adventure.", error);
    completed = new Set();
    stars = 0;
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      completed: [...completed],
      updatedAt: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.warn("Progress could not be saved in this browser.", error);
    const feedback = $("#feedback");
    if (feedback) feedback.textContent = "Progress may not be saved on this device.";
    return false;
  }
}

function scrollToId(selector) {
  const element = $(selector);
  if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
}

function setProgress() {
  const count = completed.size;
  const percent = Math.round((count / missions.length) * 100);
  $("#questFill").style.width = percent + "%";
  $("#questCount").textContent = count + " / " + missions.length;
  $("#stars").textContent = String(stars);

  all(".map-node").forEach((node, index) => {
    const done = completed.has(index);
    node.classList.toggle("active", index === current);
    node.classList.toggle("completed", done);
    const marker = node.querySelector("i");
    if (marker) marker.textContent = done ? "✓" : String(index + 1);
    node.setAttribute("aria-label", `${missions[index].title}${done ? ", completed" : ""}`);
  });

  updateParentReport();
}

function updateParentReport() {
  const completedCount = completed.size;
  const percent = Math.round((completedCount / missions.length) * 100);
  const score = $(".dash-score strong");
  const summary = $(".dash-score small");
  const headline = $(".dash-score b");

  if (score) score.textContent = percent + "%";
  if (summary) summary.textContent = `${completedCount} of ${missions.length} missions completed`;
  if (headline) {
    headline.textContent = completedCount === missions.length
      ? "Free adventure completed!"
      : completedCount > 0
        ? "Great progress!"
        : "Ready to begin!";
  }

  const bars = all(".dash-bars label i");
  const skillIndexes = [[0], [1], [2], [3]];
  const skillBars = [
    { label: "Math", mission: 0 },
    { label: "Reading", mission: 1 },
    { label: "Science", mission: 2 },
    { label: "Creative", mission: 3 }
  ];

  if (bars.length) {
    bars.forEach((bar, index) => {
      const item = skillBars[index];
      if (!item) return;
      bar.style.width = (completed.has(item.mission) ? 100 : 0) + "%";
      const label = bar.parentElement;
      if (label) label.firstChild.textContent = item.label + (completed.has(item.mission) ? " ✓" : "");
    });
  }

  const weekLabel = $(".dash-title span");
  if (weekLabel) weekLabel.textContent = "THIS DEVICE";
}

all("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => scrollToId(button.dataset.scroll));
});

function loadMission(index = current) {
  current = index;
  locked = false;
  window.clearTimeout(rewardTimer);

  const mission = missions[current];
  $("#missionLabel").textContent = "Mission " + (current + 1) + " of " + missions.length;
  $("#skillPill").textContent = mission.skill;
  $("#missionTitle").textContent = mission.title;
  $("#missionPrompt").innerHTML = mission.prompt;
  $("#feedback").textContent = completed.has(current) ? "✅ Mission already completed!" : "";
  $("#stepText").textContent = completed.has(current) ? "Challenge complete ✓" : "Challenge 1 of 1";
  $("#hint").innerHTML = "💡 <b>Genius Hint:</b> Take your time. You can do this!";
  $("#answers").innerHTML = "";

  mission.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer";
    button.textContent = answer;
    button.disabled = completed.has(current);
    if (completed.has(current) && answer === mission.correct) {
      button.classList.add("correct");
    }
    button.addEventListener("click", () => choose(button, answer));
    $("#answers").appendChild(button);
  });

  setProgress();
}

function choose(button, value) {
  if (locked || completed.has(current)) return;

  const mission = missions[current];
  if (value !== mission.correct) {
    button.classList.add("wrong");
    $("#feedback").textContent = "💡 Almost! Try another answer.";
    $("#hint").innerHTML = "💡 <b>Hint:</b> Look closely at the question, then try again!";
    return;
  }

  locked = true;
  completed.add(current);
  stars = completed.size;
  saveProgress();

  all(".answer").forEach((answer) => {
    answer.disabled = true;
    if (answer.textContent === mission.correct) answer.classList.add("correct");
  });

  $("#feedback").textContent = "🎉 Correct!";
  $("#stepText").textContent = "Challenge complete ✓";
  setProgress();
  rewardTimer = window.setTimeout(() => showReward(mission), 450);
}

function showReward(mission) {
  $("#rewardText").textContent = mission.reward;
  $("#rewardStars").textContent = "+1";
  $("#rewardProgress").textContent = Math.round((completed.size / missions.length) * 100) + "%";
  $("#reward").classList.remove("hidden");
  $("#nextBtn").textContent = completed.size === missions.length
    ? "🎉 Finish the Free Adventure"
    : "Continue Adventure →";
  scrollToId("#reward");
}

$("#nextBtn").addEventListener("click", () => {
  if (completed.size === missions.length) {
    $("#nextBtn").textContent = "🚀 Explore Premium";
    $("#rewardText").textContent = "You completed the Free Adventure! Your Star Seeds are saved on this device.";
    $("#nextBtn").onclick = () => scrollToId(".pricing");
    return;
  }

  $("#reward").classList.add("hidden");
  let next = (current + 1) % missions.length;
  while (completed.has(next)) next = (next + 1) % missions.length;
  loadMission(next);
});

$("#startBtn").addEventListener("click", () => {
  $("#reward").classList.add("hidden");
  const firstIncomplete = missions.findIndex((mission, index) => !completed.has(index));

  if (firstIncomplete === -1) {
    $("#reward").classList.remove("hidden");
    $("#rewardText").textContent = "You have completed every Free Adventure mission. Your progress is saved on this device.";
    $("#nextBtn").textContent = "🚀 Explore Premium";
    scrollToId("#reward");
    return;
  }

  loadMission(firstIncomplete);
});

all(".map-node").forEach((node) => {
  node.addEventListener("click", () => loadMission(Number(node.dataset.mission)));
});

// A checkout URL must be configured by a server-controlled payment integration.
// Never place a Stripe secret key in browser JavaScript.
$("#checkoutBtn").addEventListener("click", () => {
  const checkoutUrl = document.documentElement.dataset.checkoutUrl;
  if (!checkoutUrl) {
    alert("Genius Pass checkout is not connected yet. Please check back soon.");
    return;
  }

  try {
    const target = new URL(checkoutUrl, window.location.origin);
    if (target.protocol !== "https:" || target.origin === window.location.origin) {
      throw new Error("Checkout must use a secure external payment URL.");
    }
    window.location.assign(target.href);
  } catch (error) {
    console.error("Invalid checkout URL configuration.", error);
    alert("Checkout is temporarily unavailable. Please try again later.");
  }
});

loadProgress();
setProgress();
const firstIncompleteMission = missions.findIndex((mission, index) => !completed.has(index));
loadMission(firstIncompleteMission === -1 ? 0 : firstIncompleteMission);
