import React, { FC, useEffect, useState } from "react";
import { Figure, Modal, Button } from "react-bootstrap";
import { Board } from "../models/Board";
import { Cell } from "../models/Cell";
import { Colors } from "../models/Colors";
import { FigureNames } from "../models/figures/Figure";
import { Player } from "../models/Player";
import CellComponents from "./CellComponents";

interface BoardProps {
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
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [isWhiteCheck, setIsWhiteCheck] = useState<boolean>(false);
  const [isBlackCheck, setIsBlackCheck] = useState<boolean>(false);
  const [isMate, setIsMate] = useState<boolean>(false);

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
      Mate();
      setSelectedCell(null);
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  }

  useEffect(() => {
    checkMoves();
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
  function findKings() {
    let blackKing: Cell = new Cell(board, 0, 0, Colors.BLACK, null);
    let whiteKing: Cell = new Cell(board, 0, 0, Colors.BLACK, null);
    board.cells.forEach((element) => {
      element.forEach((cell) => {
        if (cell.figure?.name === FigureNames.KING) {
          cell.figure.color === Colors.WHITE
            ? (whiteKing = cell)
            : (blackKing = cell);
        }
      });
    });
    return { whiteKing, blackKing };
  }
  function Mate(): void {
    if (isKingUnderAttack().BlackCheckFigures && isBlackCheck) {
      console.log("1");
      setIsMate(true);
    }
    if (!isKingUnderAttack().BlackCheckFigures && isBlackCheck) {
      console.log("2");

      setIsBlackCheck(false);
    }
    if (isKingUnderAttack().BlackCheckFigures && !isBlackCheck) {
      console.log("3");

      setIsBlackCheck(true);
    }
  }

  function isKingUnderAttack() {
    let WhiteCheckFigures: Cell | null = null;
    let BlackCheckFigures: Cell | null = null;
    board.cells.forEach((element) => {
      element.forEach((cell) => {
        if (cell.figure?.canMove(findKings().whiteKing)) {
          WhiteCheckFigures = cell;
        }
        if (cell.figure?.canMove(findKings().blackKing)) {
          BlackCheckFigures = cell;
        }
      });
    });
    return { WhiteCheckFigures, BlackCheckFigures };
  }
  function checkMoves() {
    const checkList = isKingUnderAttack();
    if (checkList.WhiteCheckFigures) {
      const king: Cell = findKings().whiteKing;
      const target: Cell = checkList.WhiteCheckFigures;
      if (target.figure?.name === FigureNames.BISHOP) {
        target.isEmptyDiagonal(king);
      }
      if (target.figure?.name === FigureNames.KNIGHT) {
        target.isKnightMove(king);
      }
      if (target.figure?.name === FigureNames.PAWN) {
        target.isPawnAttack(king);
      }
      if (target.figure?.name === FigureNames.QUEEN) {
        target.isEmptyDiagonal(king);
        target.isEmptyVertical(king);
        target.isEmptyHorizontal(king);
      }
      if (target.figure?.name === FigureNames.ROOK) {
        target.isEmptyHorizontal(king);
        target.isEmptyVertical(king);
      }
      if (target.figure?.name === FigureNames.KING) {
        return false;
      }
    }
  }

  return (
    <div>
      {isMate ? (
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
            That`s mate! {isBlackCheck ? "White" : "Black"} wins!
            Congratulations! One more game?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={updateBoard}>
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
