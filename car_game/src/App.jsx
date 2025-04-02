import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import Game from "./components/Game";

const App = () => {
  const [gameState, setGameState] = useState("landing"); 

  const handleStart = () => {
    setGameState("loading");
  };

  const handleLoadingComplete = () => {
    setGameState("game");
  };

  return (
    <div className="m-0 p-0 h-screen overflow-hidden">
      {gameState === "landing" && <LandingPage onStart={handleStart} />}
      {gameState === "loading" && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      {gameState === "game" && <Game />}
    </div>
  );
};

export default App;
