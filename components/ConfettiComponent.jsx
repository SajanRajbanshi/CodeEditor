import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";

const ConfettiComponent = ({ isExecutionSuccessProp,onSetIsExecutionSuccess }) => {
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);

  useEffect(() => {
    if (isExecutionSuccessProp) {
      setIsConfettiVisible(true);

      // Stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setIsConfettiVisible(false);
        onSetIsExecutionSuccess(false);
      }, 8000);

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [isExecutionSuccessProp]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none" }}>
      {isConfettiVisible && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={0.25}
          numberOfPieces={400}
          recycle={false}
        />
      )}
    </div>
  );
};

export default ConfettiComponent;
