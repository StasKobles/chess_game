import React, { FC, useEffect, useRef, useState } from "react";
import { Colors } from "../models/Colors";
import { Player } from "../models/Player";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface TimerProps {
  currentPlayer: Player | null;
  restart: () => void;
}

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
  const [whiteTime, setWhiteTime] = useState(300);
  const [blackTime, setBlackTime] = useState(300);

  // For modal block
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  const timer = useRef<null | ReturnType<typeof setInterval>>(null);
  useEffect(() => {
    startTimer();
  }, [currentPlayer]);

  function startTimer() {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const callback =
      currentPlayer?.color === Colors.WHITE
        ? decrementWhiteTimer
        : decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
  }

  function decrementBlackTimer() {
    setBlackTime((prev) => (prev > 0 ? prev - 1 : prev));
  }
  function decrementWhiteTimer() {
    setWhiteTime((prev) => (prev > 0 ? prev - 1 : prev));
  }
  const handleRestart = () => {
    setBlackTime(300);
    setWhiteTime(300);
    restart();
  };

  return (
    <div>
      {whiteTime && blackTime ? (
        <div>
          <div>
            <button onClick={handleRestart}>Restart game</button>
          </div>
          <h2> White`s time - {whiteTime}</h2>
          <h2> Black`s time - {blackTime}</h2>
        </div>
      ) : (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Time's up! {whiteTime ? "White" : "Black"} wins! Congratulations!
            One more game?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleRestart}>
              New game
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Timer;
