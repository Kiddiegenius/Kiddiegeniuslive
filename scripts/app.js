const cheers = [
    "You are ready to shine today!",
    "Every tiny step is big progress!",
    "Learning is your superpower!",
    "Great thinkers ask great questions!"
];

function setDailyCheer() {
    const cheerEl = document.getElementById("dailyCheer");
    if (!cheerEl) return;
    const dayIndex = new Date().getDay() % cheers.length;
    cheerEl.textContent = cheers[dayIndex];
}

function initGoals() {
    const checks = document.querySelectorAll(".goal-check");
    const status = document.getElementById("goalStatus");
    if (!checks.length || !status) return;

    const update = () => {
        const done = Array.from(checks).filter((item) => item.checked).length;
        status.textContent = `${done} of ${checks.length} goals completed.`;
        if (done === checks.length) {
            status.textContent += " Amazing work!";
            status.style.color = "#16a34a";
        } else {
            status.style.color = "";
        }
    };

    checks.forEach((box) => box.addEventListener("change", update));
    update();
}

function initQuiz() {
    const quizForm = document.getElementById("quizForm");
    const resultEl = document.getElementById("quizResult");
    if (!quizForm || !resultEl) return;

    const answers = {
        q1: "b",
        q2: "9",
        q3: "triangle",
        q4: "sunlight",
        q5: "share"
    };

    quizForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(quizForm);
        let score = 0;

        Object.keys(answers).forEach((key) => {
            if (data.get(key) === answers[key]) {
                score += 1;
            }
        });

        if (score === 5) {
            resultEl.textContent = "5/5 ⭐ Perfect! You earned the Genius Gold Badge!";
            resultEl.style.color = "#16a34a";
        } else if (score >= 3) {
            resultEl.textContent = `${score}/5 🎉 Great effort! Keep practicing to level up!`;
            resultEl.style.color = "#1d4ed8";
        } else {
            resultEl.textContent = `${score}/5 💪 Nice try! Try again and beat your score.`;
            resultEl.style.color = "#b45309";
        }
    });
}

setDailyCheer();
initGoals();
initQuiz();
