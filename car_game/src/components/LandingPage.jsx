import React from "react";

const LandingPage = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-sans text-center">
      <h1 className="text-5xl mb-5">Car Avoidance Game 🚗</h1>
      <div className="instructions">
        <h2 className="text-2xl text-cyan-400 mb-3">How to Play?</h2>
        <ul className="list-none p-0">
          <li className="text-lg my-3">
            Use <span className="text-green-500 font-bold">←</span> and
            <span className="text-green-500 font-bold">→</span> arrow keys to
            move your car
          </li>
          <li className="text-lg my-3 text-red-500 font-bold">
            Dodge obstacles and survive as long as possible!
          </li>
        </ul>
      </div>
      <button
        onClick={onStart}
        className="mt-5 px-20 py-3 text-xl bg-gray-300 rounded-full flex items-center gap-3 hover:bg-gray-400 transition-colors"
      >
        <span className="text-2xl">▶</span> Play
      </button>
    </div>
  );
};

export default LandingPage;
