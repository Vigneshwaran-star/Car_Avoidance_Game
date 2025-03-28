import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const moveRoad = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
`;

const GameContainer = styled.div`
  width: 500px;
  height: 700px;
  border: 1px solid black;
  margin: 50px auto;
  position: relative;
  overflow: hidden;
  background-color: #333;
  background-image: linear-gradient(
    #555 20%,
    transparent 20%,
    transparent 40%,
    #555 40%,
    #555 60%,
    transparent 60%,
    transparent 80%,
    #555 80%
  );
  background-size: 100% 50px;
  animation: ${moveRoad} 2s linear infinite;
`;

const Car = styled.img`
  width: 50px;
  height: 100px;
  position: absolute;
  top: ${(props) => (props.isPlayer ? "auto" : props.y + "px")};
  bottom: ${(props) => (props.isPlayer ? "10px" : "auto")};
  left: ${(props) => props.x + "px"};
  border-radius: 5px;
`;

const Score = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-size: 20px;
  font-family: Arial, sans-serif;
`;

const App = () => {
  const [playerX, setPlayerX] = useState(225);
  const [opponents, setOpponents] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Handle player movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && playerX > 0) setPlayerX(playerX - 20);
      if (e.key === "ArrowRight" && playerX < 450) setPlayerX(playerX + 20);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerX]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Move existing opponents
      setOpponents((prevOpponents) => {
        const updatedOpponents = prevOpponents
          .map((opponent) => ({
            ...opponent,
            y: opponent.y + opponent.speed,
          }))
          .filter((opponent) => opponent.y < 700);

        // Add new opponent if less than 4
        if (updatedOpponents.length < 4) {
          const newOpponent = {
            x: Math.random() * 450,
            y: -100,
            speed: Math.random() * 5 + 4 + score / 50,
          };
          updatedOpponents.push(newOpponent);
        }

        // Check collisions
        for (let opponent of updatedOpponents) {
          if (
            opponent.y + 100 >= 600 &&
            opponent.y <= 700 &&
            opponent.x < playerX + 50 &&
            opponent.x + 50 > playerX
          ) {
            setGameOver(true);
            alert(`Game Over! Score: ${score}`);
            clearInterval(interval);
            return updatedOpponents;
          }
        }

        return updatedOpponents;
      });

      // Update score
      setScore((prevScore) => prevScore + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [playerX, score, gameOver]);

  // Note: You'll need to provide your own car images
  const playerCarImage =
    "https://png.pngtree.com/png-vector/20230110/ourmid/pngtree-car-top-view-image-png-image_6557068.png";
  const opponentCarImage =
    "https://spng.pngfind.com/pngs/s/74-749644_black-car-topview-vector-transparent-library-top-view.png";

  return (
    <GameContainer>
      <Score>Score: {score}</Score>
      <Car src={playerCarImage} x={playerX} isPlayer={true} alt="Player Car" />
      {opponents.map((opponent, index) => (
        <Car
          key={index}
          src={opponentCarImage}
          x={opponent.x}
          y={opponent.y}
          isPlayer={false}
          alt="Opponent Car"
        />
      ))}
    </GameContainer>
  );
};

export default App;
