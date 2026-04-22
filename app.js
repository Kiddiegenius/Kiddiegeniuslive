// app.js — KIDDIEGENIUS SaaS demo (vanilla JS, no build step required)

document.addEventListener('DOMContentLoaded', function () {
    var demoButton = document.getElementById('demoButton');
    var demoOutput = document.getElementById('demoOutput');

    var screens = {
        home: buildHomeScreen,
        book: buildBookScreen,
        game: buildGameScreen,
        puzzle: buildPuzzleScreen,
    };

    function showScreen(name) {
        demoOutput.innerHTML = '';
        screens[name]();
    }

    // ── Home screen ──────────────────────────────────────────────
    function buildHomeScreen() {
        demoOutput.innerHTML =
            '<p style="margin-bottom:0.75rem">Pick an activity:</p>' +
            '<div class="shape-grid">' +
            '  <div class="shape-card" id="btnBook">📖 Jungle Shapes Book</div>' +
            '  <div class="shape-card" id="btnGame">🎮 Match the Shape Game</div>' +
            '  <div class="shape-card" id="btnPuzzle">🧩 Animal Puzzle</div>' +
            '</div>';

        document.getElementById('btnBook').addEventListener('click', function () { showScreen('book'); });
        document.getElementById('btnGame').addEventListener('click', function () { showScreen('game'); });
        document.getElementById('btnPuzzle').addEventListener('click', function () { showScreen('puzzle'); });
    }

    // ── Book screen ──────────────────────────────────────────────
    function buildBookScreen() {
        var shapes = ['Circle', 'Triangle', 'Square', 'Star'];
        var html =
            '<button id="backBtn" style="margin-bottom:0.75rem">⬅ Back</button>' +
            '<h3 style="margin-bottom:0.5rem">Grayson\'s Jungle Shapes</h3>' +
            '<p style="margin-bottom:0.75rem">Click a shape to hear its name!</p>' +
            '<div class="shape-grid">';
        shapes.forEach(function (s) {
            html += '<div class="shape-card" data-shape="' + s + '">' + s + '</div>';
        });
        html += '</div>';
        demoOutput.innerHTML = html;

        document.getElementById('backBtn').addEventListener('click', function () { showScreen('home'); });
        demoOutput.querySelectorAll('[data-shape]').forEach(function (el) {
            el.addEventListener('click', function () {
                var utt = new SpeechSynthesisUtterance(el.dataset.shape);
                speechSynthesis.speak(utt);
            });
        });
    }

    // ── Game screen ──────────────────────────────────────────────
    function buildGameScreen() {
        var choices = ['Square', 'Circle', 'Triangle'];
        var correct = 'Circle';
        var html =
            '<button id="backBtn" style="margin-bottom:0.75rem">⬅ Back</button>' +
            '<h3 style="margin-bottom:0.5rem">Match the Shape</h3>' +
            '<p style="margin-bottom:0.75rem">Which shape is the <strong>Circle</strong>?</p>' +
            '<div class="shape-grid">';
        choices.forEach(function (c) {
            html += '<div class="shape-card" data-choice="' + c + '">' + c + '</div>';
        });
        html += '</div><p id="gameMsg" style="margin-top:0.75rem;font-weight:700"></p>';
        demoOutput.innerHTML = html;

        document.getElementById('backBtn').addEventListener('click', function () { showScreen('home'); });
        demoOutput.querySelectorAll('[data-choice]').forEach(function (el) {
            el.addEventListener('click', function () {
                var msg = document.getElementById('gameMsg');
                if (el.dataset.choice === correct) {
                    el.classList.add('correct');
                    msg.textContent = '🎉 Correct! Great job!';
                } else {
                    el.classList.add('wrong');
                    msg.textContent = '❌ Try again!';
                }
            });
        });
    }

    // ── Puzzle screen ────────────────────────────────────────────
    function buildPuzzleScreen() {
        demoOutput.innerHTML =
            '<button id="backBtn" style="margin-bottom:0.75rem">⬅ Back</button>' +
            '<h3 style="margin-bottom:0.5rem">Animal Puzzle</h3>' +
            '<p style="margin-bottom:0.75rem">Drag &amp; drop puzzle — coming soon!</p>' +
            '<div style="background:#fff;padding:2rem;border-radius:12px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08)">🐘 Puzzle loading…</div>';
        document.getElementById('backBtn').addEventListener('click', function () { showScreen('home'); });
    }

    // ── Button wires up the demo ─────────────────────────────────
    demoButton.addEventListener('click', function () {
        demoButton.textContent = 'Restart Demo';
        showScreen('home');
    });
});
