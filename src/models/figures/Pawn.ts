import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
import whiteLogo from "../../assets/white-pawn.png";
import blackLogo from "../../assets/black-pawn.png";
export class Pawn extends Figure {
  isFirstStep: boolean = true;

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }

  // firstStepFreeCell(pawn: Cell) {
  //   const direction = this.figure?.color === Colors.BLACK ? 1 : -1;
  //   const coordinates = { x: pawn.x, y: pawn.y + direction };
  //   return this.cell.board.getCell(coordinates.x, coordinates.y).isEmpty();
  // }
  canMove(target: Cell): boolean {
    if (!super.canMove(target)) {
      return false;
    }
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const firstStepDirection =
      this.cell.figure?.color === Colors.BLACK ? 2 : -2;
    if (
      (target.y === this.cell.y + direction ||
        (this.isFirstStep && target.y === this.cell.y + firstStepDirection)) &&
      target.x === this.cell.x &&
      this.cell.board.getCell(target.x, target.y).isEmpty()
    ) {
      if (
        this.isFirstStep &&
        !this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty()
      ) {
        // console.log(
        //   this.cell.board.getCell(target.x, target.y + direction).isEmpty()
        // );
        return false;
      }
      return true;
    }

    if (
      target.y === this.cell.y + direction &&
      (target.x === this.cell.x + 1 || target.x === this.cell.x - 1) &&
      this.cell.isEnemy(target)
    ) {
      return true;
    }
    return false;
  }

  moveFigure(target: Cell) {
    super.moveFigure(target);
    this.isFirstStep = false;
  }
}
