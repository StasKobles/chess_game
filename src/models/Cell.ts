import { Board } from "./Board";
import { Figure, FigureNames } from "./figures/Figure";
import { Colors } from "./Colors";
import { King } from "./figures/King";
import { Rook } from "./figures/Rook";
export class Cell {
  readonly x: number; // Coordinates on X
  readonly y: number; // Coordinates on Y
  readonly color: Colors; // Color of Cell
  figure: Figure | null; // Which figure is on cell or nothing
  board: Board; // Connection with Board class
  available: boolean; //Show the possibility for a move
  id: number; // For React keys
  constructor(
    board: Board,
    x: number,
    y: number,
    color: Colors,
    figure: Figure | null
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.board = board;
    this.available = false;
    this.id = Math.random();
  }

  isEmpty(): boolean {
    return this.figure === null;
  }
  isEnemy(target: Cell): boolean {
    if (target.figure) {
      return this.figure?.color !== target.figure.color;
    }
    return false;
  }
  isEmptyVertical(target: Cell): boolean {
    if (this.x !== target.x) {
      return false;
    }
    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);
    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyHorizontal(target: Cell): boolean {
    if (this.y !== target.y) {
      return false;
    }
    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);
    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyDiagonal(target: Cell): boolean {
    const absX = Math.abs(target.x - this.x);
    const absY = Math.abs(target.y - this.y);
    if (absY !== absX) {
      return false;
    }
    const dy = this.y < target.y ? 1 : -1;
    const dx = this.x < target.x ? 1 : -1;

    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
        return false;
      }
    }

    return true;
  }
  isPawnAttack(target: Cell): boolean {
    const direction = this.figure?.color === Colors.BLACK ? 1 : -1;
    if (
      target.y === this.y + direction &&
      (target.x === this.x + 1 || target.x === this.x - 1)
    ) {
      return true;
    }
    return false;
  }
  isPawnMove(target: Cell, isFirstStep: boolean): boolean {
    const direction = this.figure?.color === Colors.BLACK ? 1 : -1;
    const firstStepDirection = this.figure?.color === Colors.BLACK ? 2 : -2;
    if (
      (target.y === this.y + direction ||
        (isFirstStep && target.y === this.y + firstStepDirection)) &&
      target.x === this.x &&
      this.board.getCell(target.x, target.y).isEmpty()
    ) {
      if (
        isFirstStep &&
        !this.board.getCell(this.x, this.y + direction).isEmpty()
      ) {
        return false;
      }
      return true;
    }
    if (
      target.y === this.y + direction &&
      (target.x === this.x + 1 || target.x === this.x - 1) &&
      this.isEnemy(target)
    ) {
      return true;
    }
    return false;
  }
  isKnightMove(target: Cell): boolean {
    const dx = Math.abs(this.x - target.x);
    const dy = Math.abs(this.y - target.y);

    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }
  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;
  }

  addLostFigure(figure: Figure) {
    figure.color === Colors.BLACK
      ? this.board.lostBlackFigures.push(figure)
      : this.board.lostWhiteFigures.push(figure);
  }

  moveFigure(target: Cell) {
    // if (
    //   this.figure?.color === Colors.BLACK &&
    //   target.y === 7 &&
    //   this.figure?.name === FigureNames.PAWN
    // ) {
    //   const color = this.figure?.color;
    //   if (target.figure) {
    //     this.addLostFigure(target.figure);
    //   }
    //   this.figure = null;
    //   target.board.promotePawn(color, target, FigureNames.QUEEN);
    // }
    // if (
    //   this.figure?.color === Colors.WHITE &&
    //   target.y === 0 &&
    //   this.figure?.name === FigureNames.PAWN
    // ) {
    //   const color = this.figure?.color;
    //   if (target.figure) {
    //     this.addLostFigure(target.figure);
    //   }
    //   this.figure = null;
    //   target.board.promotePawn(color, target, FigureNames.QUEEN);
    // }
    if (
      this?.figure?.name === FigureNames.KING &&
      this?.figure?.color === Colors.BLACK &&
      target === this.board.cells[0][2]
    ) {
      this.board.cells[this.y][this.x].figure = null;
      this.board.cells[0][4].figure = null;
      this.board.cells[0][0].figure = null;
      new King(Colors.BLACK, this.board.cells[0][2]);
      new Rook(Colors.BLACK, this.board.cells[0][3]);
    }
    if (
      this?.figure?.name === FigureNames.KING &&
      this?.figure?.color === Colors.BLACK &&
      target === this.board.cells[0][6]
    ) {
      this.board.cells[this.y][this.x].figure = null;
      this.board.cells[0][4].figure = null;
      this.board.cells[0][7].figure = null;
      new King(Colors.BLACK, this.board.cells[0][6]);
      new Rook(Colors.BLACK, this.board.cells[0][5]);
    }
    if (
      this?.figure?.name === FigureNames.KING &&
      this?.figure?.color === Colors.WHITE &&
      target === this.board.cells[7][6]
    ) {
      this.board.cells[this.y][this.x].figure = null;
      this.board.cells[7][4].figure = null;
      this.board.cells[7][7].figure = null;
      new King(Colors.WHITE, this.board.cells[7][6]);
      new Rook(Colors.WHITE, this.board.cells[7][5]);
    }
    if (
      this?.figure?.name === FigureNames.KING &&
      this?.figure?.color === Colors.WHITE &&
      target === this.board.cells[7][2]
    ) {
      this.board.cells[this.y][this.x].figure = null;
      this.board.cells[7][4].figure = null;
      this.board.cells[7][0].figure = null;
      new King(Colors.WHITE, this.board.cells[7][2]);
      new Rook(Colors.WHITE, this.board.cells[7][3]);
    } else {
      if (this.figure && this.figure?.canMove(target)) {
        this.figure.moveFigure(target);
        if (target.figure) {
          this.addLostFigure(target.figure);
        }
        target.setFigure(this.figure);
        this.figure = null;
      }
    }
  }
}
