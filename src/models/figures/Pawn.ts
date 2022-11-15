import blackLogo from "../../assets/black-pawn.png";
import whiteLogo from "../../assets/white-pawn.png";
import { Cell } from "../Cell";
import { Colors } from "../Colors";
import { Figure, FigureNames } from "./Figure";
export class Pawn extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }
  canMove(target: Cell): boolean {
    if (!super.canMove(target)) {
      return false;
    }
    if (this.cell.isPawnMove(target, this.isFirstStep)) {
      return true;
    }
    return false;
  }
}
