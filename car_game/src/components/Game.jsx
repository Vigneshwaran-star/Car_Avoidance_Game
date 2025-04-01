import React, { useState, useEffect, useRef } from "react";
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
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #2e7d32; /* Grass green color */
  background-image: url("src/assets/images/roadside.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Road = styled.div`
  width: 600px; 
  height: 100vh;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333; 
  background-image: url("https://t3.ftcdn.net/jpg/01/08/79/34/360_F_108793446_G19zRSheNF16cbrybKsq7NenFbr4FCJM.jpg"); 
  background-size: 100% auto;
  background-repeat: repeat-y; 
  animation: ${moveRoad} 2s linear infinite;
`;

const Car = styled.img`
  width: 150px;
  height: 150px;
  position: absolute;
  top: ${(props) => (props.isPlayer ? "auto" : props.y + "px")};
  bottom: ${(props) => (props.isPlayer ? "20px" : "auto")};
  left: ${(props) => props.x + "px"};
  border-radius: 5px;
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-family: Arial, sans-serif;
`;

const HighScore = styled.div`
  position: absolute;
  top: 60px;
  left: 20px;
  color: white;
  font-size: 24px;
  font-family: Arial, sans-serif;
`;

const GameOverScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  color: white;
  z-index: 10; 
`;

const RestartButton = styled.button`
  margin-top: 20px;
  padding: 15px 30px;
  font-size: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const Game = () => {
  const roadWidth = 600; 
  const carWidth = 150; 
  const [playerX, setPlayerX] = useState((roadWidth - carWidth) / 2); 
  const [opponents, setOpponents] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("highScore")) || 0;
  });
  const [gameOver, setGameOver] = useState(false);

  
  const drivingAudioRef = useRef(null);
  const crashAudioRef = useRef(null);

  
  const roadLeftOffset = (window.innerWidth - roadWidth) / 2;

  
  useEffect(() => {
    localStorage.setItem("highScore", highScore);
  }, [highScore]);

 
  useEffect(() => {
    if (!gameOver) {
      drivingAudioRef.current.play();
    } else {
      drivingAudioRef.current.pause();
      drivingAudioRef.current.currentTime = 0; 
    }
  }, [gameOver]);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameOver && e.key === "ArrowLeft" && playerX > 0)
        setPlayerX(playerX - 30);
      if (!gameOver && e.key === "ArrowRight" && playerX < roadWidth - carWidth)
        setPlayerX(playerX + 30);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerX, gameOver]);


  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      
      setOpponents((prevOpponents) => {
        const updatedOpponents = prevOpponents
          .map((opponent) => ({
            ...opponent,
            y: opponent.y + opponent.speed,
          }))
          .filter((opponent) => opponent.y < window.innerHeight);

     
        if (updatedOpponents.length < 4) {
          const newOpponent = {
            x: Math.random() * (roadWidth - carWidth), 
            y: -150,
            speed: Math.random() * 5 + 4 + score / 50,
          };
          updatedOpponents.push(newOpponent);
        }

     
        for (let opponent of updatedOpponents) {
          if (
            opponent.y + 150 >= window.innerHeight - 170 &&
            opponent.y <= window.innerHeight &&
            opponent.x < playerX + 75 &&
            opponent.x + 75 > playerX
          ) {
            setGameOver(true);
            setHighScore((prevHighScore) => Math.max(prevHighScore, score));
        
            crashAudioRef.current.play();
            return updatedOpponents;
          }
        }

        return updatedOpponents;
      });

      setScore((prevScore) => prevScore + 1);
    }, 50);

    return () => clearInterval(interval);
  }, [playerX, score, gameOver]);


  const restartGame = () => {
    setPlayerX((roadWidth - carWidth) / 2); 
    setOpponents([]);
    setScore(0);
    setGameOver(false);
  };

  
  const resetHighScore = () => {
    setHighScore(0);
    localStorage.setItem("highScore", 0);
  };

  const playerCarImage =
    "https://png.pngtree.com/png-vector/20230110/ourmid/pngtree-car-top-view-image-png-image_6557068.png";
  const opponentCarImage =
    "https://png.pngtree.com/png-vector/20230408/ourmid/pngtree-gray-sports-car-top-view-vector-png-image_6681667.png";

  return (
    <GameContainer>
      <Road />
      <Score>Score: {score}</Score>
      <HighScore>High Score: {highScore}</HighScore>
  
      <audio ref={drivingAudioRef} src="src/assets/audio/driving.mp3" loop />
      <audio ref={crashAudioRef} src="src/assets/audio/crash.mp3" />
      <Car
        src={playerCarImage}
        x={playerX + roadLeftOffset} 
        isPlayer={true}
        alt="Player Car"
      />
      {opponents.map((opponent, index) => (
        <Car
          key={index}
          src={opponentCarImage}
          x={opponent.x + roadLeftOffset} 
          y={opponent.y}
          isPlayer={false}
          alt="Opponent Car"
        />
      ))}
      {gameOver && (
        <GameOverScreen>
          <h2 className="text-3xl">Game Over!</h2>
          <p className="mt-3 text-xl">Score: {score}</p>
          <p className="mt-2 text-xl">High Score: {highScore}</p>
          <RestartButton onClick={restartGame} className="">Restart Game</RestartButton>
          <button
            onClick={resetHighScore}
            className="mt-5 ml-3 px-6 py-3 text-lg bg-red-500 text-white border-none rounded-md cursor-pointer hover:bg-red-700 transition-colors"
          >
            Reset High Score
          </button>
        </GameOverScreen>
      )}
    </GameContainer>
  );
};

export default Game;
