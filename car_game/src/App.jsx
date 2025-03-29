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
  width: 100px;
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

const HighScore = styled.div`
  position: absolute;
  top: 40px;
  left: 10px;
  color: white;
  font-size: 20px;
  font-family: Arial, sans-serif;
`;

const GameOverScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
`;

const RestartButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const App = () => {
  const [playerX, setPlayerX] = useState(225);
  const [opponents, setOpponents] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Handle player movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameOver && e.key === "ArrowLeft" && playerX > 0)
        setPlayerX(playerX - 20);
      if (!gameOver && e.key === "ArrowRight" && playerX < 450)
        setPlayerX(playerX + 20);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerX, gameOver]);

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
            setHighScore((prevHighScore) => Math.max(prevHighScore, score));
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

  // Restart game function
  const restartGame = () => {
    setPlayerX(225);
    setOpponents([]);
    setScore(0);
    setGameOver(false);
  };

  const playerCarImage =
    "https://png.pngtree.com/png-vector/20230110/ourmid/pngtree-car-top-view-image-png-image_6557068.png";
  const opponentCarImage =
    "https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-gray-sports-car-top-view-vector-png-image_6681667.png";

  return (
    <GameContainer>
      <Score>Score: {score}</Score>
      <HighScore>High Score: {highScore}</HighScore>
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
      {gameOver && (
        <GameOverScreen>
          <h2>Game Over!</h2>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <RestartButton onClick={restartGame}>Restart Game</RestartButton>
        </GameOverScreen>
      )}
    </GameContainer>
  );
};

export default App;
