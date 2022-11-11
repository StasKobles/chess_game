import React, { FC, useEffect, useState } from "react";
import { Figure, Modal, Button } from "react-bootstrap";
import { setMaxListeners } from "stream";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { Player } from "../models/Player";
import CellComponents from "./CellComponents";

interface BoardProps {
  restart: () => void;
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}

const BoardComponent: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
  restart,
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  // For modal block
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  function click(cell: Cell) {
    if (
      selectedCell &&
      selectedCell !== cell &&
      selectedCell.figure?.canMove(cell)
    ) {
      selectedCell?.moveFigure(cell);
      swapPlayer();
      board.isCheckmate();
      setSelectedCell(null);
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  useEffect(() => {
    // board.checkMoves();
    highlightCells();
  }, [selectedCell]);

  function highlightCells() {
    board.highlightCells(selectedCell);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  const handleRestart = () => {
    board.checkmate = false;
    restart();
  };

  return (
    <div>
      {board.checkmate ? (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>That`s mate!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {board.blackCheck ? "White" : "Black"} wins! Congratulations! One
            more game?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleRestart}>
              New game
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <div className="boardContainer">
          <h3>Current player {currentPlayer?.color}</h3>
          <div className="board">
            {board.cells.map((row, index) => (
              <React.Fragment key={index}>
                {row.map((cell) => (
                  <CellComponents
                    click={click}
                    cell={cell}
                    key={cell.id}
                    selected={
                      cell.x === selectedCell?.x && cell.y === selectedCell?.y
                    }
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardComponent;
