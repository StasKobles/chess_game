import { Board } from "./Board";
import { Figure } from "./figures/Figure";
import { Colors } from "./Colors";

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
}
