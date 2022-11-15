import blackLogo from "../../assets/black-king.png";
import whiteLogo from "../../assets/white-king.png";
import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
export class King extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KING;
  }
  canMove(target: Cell): boolean {
    if (!super.canMove(target)) {
      return false;
    }
    if (
      Math.abs(target.x - this.cell.x) > 1 ||
      Math.abs(target.y - this.cell.y) > 1
    ) {
      return false;
    }

    if (this.cell.isEmptyVertical(target)) {
      return true;
    }

    if (this.cell.isEmptyHorizontal(target)) {
      return true;
    }

    if (this.cell.isEmptyDiagonal(target)) {
      return true;
    }
    if (!this.cell.board.isCellUnderAttack(target, this.color)) {
      return false;
    }

    return false;
  }
  moveFigure(_target: Cell): void {}
}
