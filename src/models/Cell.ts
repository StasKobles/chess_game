import { Board } from "./Board";
import { Figure, FigureNames } from "./figures/Figure";
import { Colors } from "./Colors";
import { runInThisContext } from "vm";

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
    if (
      this.figure?.color === Colors.BLACK &&
      target.y === 7 &&
      this.figure?.name === FigureNames.PAWN
    ) {
      const color = this.figure?.color;
      this.figure = null;
      target.board.promoteQueen(color, target.x, target.y);
    }
    if (
      this.figure?.color === Colors.WHITE &&
      target.y === 0 &&
      this.figure?.name === FigureNames.PAWN
    ) {
      const color = this.figure?.color;
      this.figure = null;
      target.board.promoteQueen(color, target.x, target.y);
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
