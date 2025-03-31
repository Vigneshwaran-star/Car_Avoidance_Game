import React, { useEffect } from "react";

const LoadingScreen = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3500); 
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div
        className="w-full h-screen bg-contain bg-no-repeat bg-center"
        style={{
          backgroundImage:
            "url('https://mir-s3-cdn-cf.behance.net/project_modules/1400/02b374101705095.5f24d5db1096f.gif')",
        }}
      ></div>
    </div>
  );
};

export default LoadingScreen;
