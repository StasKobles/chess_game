import React, { FC, useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
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
    if (selectedCell && selectedCell !== cell && cell.available) {
      selectedCell?.moveFigure(cell);
      board.pawnReady();
      swapPlayer();
      board.isCheckmate(currentPlayer?.color);
      setSelectedCell(null);
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
      if (!cell.figure) {
        setSelectedCell(null);
      }
    }
  }

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  function highlightCells() {
    board.highlightCells(selectedCell, currentPlayer?.color);
    updateBoard();
  }

  function updateBoard() {
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  const handleRestartMate = () => {
    board.checkmate = false;
    restart();
  };
  const handleRestartPromote = (type: FigureNames) => {
    if (board.promotePawnCell) {
      board.promotePawn(
        board.promotePawnCell?.figure?.color,
        board.promotePawnCell,
        type
      );
    }
    board.promotePawnCell = null;
    updateBoard();
  };

  return (
    <div className="boardContainer">
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
            <Button variant="primary" onClick={handleRestartMate}>
              New game
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <></>
      )}
      {board.promotePawnCell ? (
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Body>Choose the figure to promote your pawn!</Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.QUEEN)}
            >
              Queen
            </Button>{" "}
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.KNIGHT)}
            >
              Knight
            </Button>{" "}
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.BISHOP)}
            >
              Bishop
            </Button>{" "}
            <Button
              variant="primary"
              onClick={() => handleRestartPromote(FigureNames.ROOK)}
            >
              Rook
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <></>
      )}
      <h3>Current player {currentPlayer?.color}</h3>
      <div>
        {board.whiteCheck || board.blackCheck ? (
          <h3>It`s check! Protect the king</h3>
        ) : (
          <></>
        )}
      </div>
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
  );
};

export default BoardComponent;
