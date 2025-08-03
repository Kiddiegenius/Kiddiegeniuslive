// This file contains the JavaScript code for the KIDDIEGENIUS SaaS demo application.

document.addEventListener('DOMContentLoaded', function() {
    const demoButton = document.getElementById('demoButton');
    const demoOutput = document.getElementById('demoOutput');

    demoButton.addEventListener('click', function() {
        demoOutput.textContent = 'Welcome to KIDDIEGENIUS! Enjoy your learning experience.';
    });

    // KIDDIEGENIUS Web App Demo
// Technologies: React + Tailwind + Firebase (auth/db) + Stripe (test mode)

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function KiddieGeniusDemo() {
  const [screen, setScreen] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-4 text-center">
      <h1 className="text-4xl font-bold text-teal-700 mb-4">Welcome to KIDDIEGENIUS</h1>
      {screen === 'home' && (
        <>
          <p className="text-xl mb-6">Pick an activity below to begin!</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card onClick={() => setScreen('book')} className="cursor-pointer hover:scale-105 transition">
              <CardContent>
                <img src="/book-icon.png" alt="Interactive Book" className="mx-auto w-24 mb-2" />
                <p className="font-semibold">Grayson's Jungle Shapes Book</p>
              </CardContent>
            </Card>
            <Card onClick={() => setScreen('game')} className="cursor-pointer hover:scale-105 transition">
              <CardContent>
                <img src="/game-icon.png" alt="Mini Game" className="mx-auto w-24 mb-2" />
                <p className="font-semibold">Match the Shape Game</p>
              </CardContent>
            </Card>
            <Card onClick={() => setScreen('puzzle')} className="cursor-pointer hover:scale-105 transition">
              <CardContent>
                <img src="/puzzle-icon.png" alt="Puzzle" className="mx-auto w-24 mb-2" />
                <p className="font-semibold">Animal Puzzle</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {screen === 'book' && <BookScene goBack={() => setScreen('home')} />}
      {screen === 'game' && <MiniGameScene goBack={() => setScreen('home')} />}
      {screen === 'puzzle' && <PuzzleScene goBack={() => setScreen('home')} />}
    </div>
  );
}

function BookScene({ goBack }) {
  return (
    <div className="text-left max-w-2xl mx-auto">
      <Button onClick={goBack} className="mb-4">⬅ Back</Button>
      <h2 className="text-2xl font-bold mb-2">Grayson's Jungle Shapes</h2>
      <p className="mb-4">Grayson the Lion Cub explores the jungle to find shapes! Click a shape to hear its name.</p>
      <div className="grid grid-cols-2 gap-4">
        <Shape name="Circle" />
        <Shape name="Triangle" />
        <Shape name="Square" />
        <Shape name="Star" />
      </div>
    </div>
  );
}

function Shape({ name }) {
  const speak = () => new SpeechSynthesisUtterance(name);
  return (
    <div className="bg-white shadow-lg p-4 rounded-xl text-center text-lg font-bold cursor-pointer" onClick={() => speechSynthesis.speak(speak())}>
      {name}
    </div>
  );
}

function MiniGameScene({ goBack }) {
  const [selected, setSelected] = useState(null);
  const correct = "Circle";

  return (
    <div className="text-left max-w-2xl mx-auto">
      <Button onClick={goBack} className="mb-4">⬅ Back</Button>
      <h2 className="text-2xl font-bold mb-2">Match the Shape</h2>
      <p className="mb-4">Which shape is the Circle?</p>
      <div className="grid grid-cols-3 gap-4">
        {['Square', 'Circle', 'Triangle'].map((shape) => (
          <div
            key={shape}
            onClick={() => setSelected(shape)}
            className={`p-4 rounded-xl cursor-pointer text-center font-bold ${selected === shape ? (shape === correct ? 'bg-green-300' : 'bg-red-300') : 'bg-white shadow'}`}
          >
            {shape}
          </div>
        ))}
      </div>
    </div>
  );
}

function PuzzleScene({ goBack }) {
  return (
    <div className="text-left max-w-2xl mx-auto">
      <Button onClick={goBack} className="mb-4">⬅ Back</Button>
      <h2 className="text-2xl font-bold mb-2">Animal Puzzle</h2>
      <p className="mb-4">(Drag & drop game coming soon!)</p>
      <div className="bg-white p-6 rounded-xl shadow text-center">Puzzle loading…</div>
    </div>
  );
}

});
