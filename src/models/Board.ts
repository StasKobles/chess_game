import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
import { Figure, FigureNames } from "./figures/Figure";

export class Board {
  cells: Cell[][] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];
  whiteCheck: boolean = false;
  blackCheck: boolean = false;
  checkmate: boolean = false;

  public initCells() {
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 !== 0) {
          row.push(new Cell(this, j, i, Colors.BLACK, null)); //Black cells
        } else {
          row.push(new Cell(this, j, i, Colors.WHITE, null)); //White cells
        }
      }
      this.cells.push(row);
    }
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.blackCheck = this.blackCheck;
    newBoard.whiteCheck = this.blackCheck;
    newBoard.checkmate = this.checkmate;
    return newBoard;
  }

  public highlightCells(selectedCell: Cell | null, color: Colors | undefined) {
    const info = this.checkList();
    let isMate = true;
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const target = row[j];
        if (info?.king.figure) {
          if (selectedCell === info.king) {
            if (
              this.isFreeForKing(target, color) &&
              !!selectedCell?.figure?.canMove(target)
            ) {
              target.available = true;
              isMate = false;
            } else {
              target.available = false;
            }
          }
          if (selectedCell !== info.king) {
            this.checkMoves(target) && !!selectedCell?.figure?.canMove(target)
              ? ((target.available = true), (isMate = false))
              : (target.available = false);
          }
          if (!selectedCell) {
            isMate = false;
          }
        }
        if (!info) {
          if (selectedCell?.figure?.name === FigureNames.KING) {
            if (
              this.isFreeForKing(target, color) &&
              !!selectedCell?.figure?.canMove(target)
            ) {
              target.available = true;
              isMate = false;
            } else {
              target.available = false;
            }
          }
          if (selectedCell?.figure?.name !== FigureNames.KING) {
            target.available = !!selectedCell?.figure?.canMove(target);
            isMate = false;
          }
        }
      }
    }
    // TODO mate

    if (isMate === true) {
      this.checkmate = true;
    }
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }
  public findKings() {
    let blackKing: Cell = new Cell(this, 0, 0, Colors.BLACK, null);
    let whiteKing: Cell = new Cell(this, 0, 0, Colors.BLACK, null);
    this.cells.forEach((element) => {
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
  public isFreeForKing(target: Cell, color: Colors | undefined): boolean {
    let targetUnderAttack: boolean = false;
    this.cells.forEach((element) => {
      element.forEach((cell) => {
        if (cell.figure?.color !== color) {
          if (
            cell.figure?.name === FigureNames.PAWN &&
            cell.figure.canMove(target)
          ) {
            targetUnderAttack = false;
          }
          if (
            cell.figure?.name === FigureNames.PAWN &&
            cell.isPawnAttack(target)
          ) {
            targetUnderAttack = true;
          }

          if (
            cell.figure?.canMove(target) &&
            (cell.figure?.name === FigureNames.ROOK ||
              cell.figure?.name === FigureNames.BISHOP ||
              cell.figure?.name === FigureNames.QUEEN ||
              cell.figure?.name === FigureNames.KING ||
              cell.figure?.name === FigureNames.KNIGHT)
          ) {
            targetUnderAttack = true;
          }
        }
      });
    });
    if (targetUnderAttack) {
      return false;
    }
    return true;
  }
  public isKingUnderAttack() {
    let WhiteCheckFigures: Cell | null = null;
    let BlackCheckFigures: Cell | null = null;
    this.cells.forEach((element) => {
      element.forEach((cell) => {
        if (cell.figure?.canMove(this.findKings().whiteKing)) {
          WhiteCheckFigures = cell;
        }
        if (cell.figure?.canMove(this.findKings().blackKing)) {
          BlackCheckFigures = cell;
        }
      });
    });
    return { WhiteCheckFigures, BlackCheckFigures };
  }
  public checkList() {
    const checkList = this.isKingUnderAttack();

    if (checkList.WhiteCheckFigures) {
      const king: Cell = this.findKings().whiteKing;
      const target: Cell = checkList.WhiteCheckFigures;
      return {
        king: king,
        attacker: target,
      };
    }

    if (checkList.BlackCheckFigures) {
      const king: Cell = this.findKings().blackKing;
      const target: Cell = checkList.BlackCheckFigures;
      return {
        king: king,
        attacker: target,
      };
    }
  }
  private checkMoves(target: Cell): boolean {
    const checkList = this.checkList();
    if (target === checkList?.attacker) {
      return true;
    }
    if (target === checkList?.attacker) {
      return false;
    }
    if (checkList?.attacker.figure?.name === FigureNames.QUEEN) {
      if (checkList.attacker.isEmptyVertical(checkList.king)) {
        return (
          checkList.attacker.isEmptyVertical(target) &&
          checkList.king.isEmptyVertical(target)
        );
      }
      if (checkList.attacker.isEmptyDiagonal(checkList.king)) {
        return (
          checkList.attacker.isEmptyDiagonal(target) &&
          checkList.king.isEmptyDiagonal(target)
        );
      }
      if (checkList.attacker.isEmptyHorizontal(checkList.king)) {
        return (
          checkList.attacker.isEmptyHorizontal(target) &&
          checkList.king.isEmptyHorizontal(target)
        );
      }
    }
    if (checkList?.attacker.figure?.name === FigureNames.BISHOP) {
      if (checkList.attacker.isEmptyDiagonal(checkList.king)) {
        return (
          checkList.attacker.isEmptyDiagonal(target) &&
          checkList.king.isEmptyDiagonal(target)
        );
      }
    }
    if (checkList?.attacker.figure?.name === FigureNames.ROOK) {
      if (checkList.attacker.isEmptyVertical(checkList.king)) {
        return (
          checkList.attacker.isEmptyVertical(target) &&
          checkList.king.isEmptyVertical(target)
        );
      }
      if (checkList.attacker.isEmptyHorizontal(checkList.king)) {
        return (
          checkList.attacker.isEmptyHorizontal(target) &&
          checkList.king.isEmptyHorizontal(target)
        );
      }
    }
    return false;

    // if (target.figure?.name === FigureNames.BISHOP) {
    //   target.isEmptyDiagonal(king);
    // }
    // if (target.figure?.name === FigureNames.KNIGHT) {
    //   target.isKnightMove(king);
    // }
    // if (target.figure?.name === FigureNames.PAWN) {
    //   target.isPawnAttack(king);
    // }
    // if (target.figure?.name === FigureNames.QUEEN) {
    //   target.isEmptyDiagonal(king);
    //   target.isEmptyVertical(king);
    //   target.isEmptyHorizontal(king);
    // }
    // if (target.figure?.name === FigureNames.ROOK) {
    //   target.isEmptyHorizontal(king);
    //   target.isEmptyVertical(king);
    // }
    // if (target.figure?.name === FigureNames.KING) {
    //   return false;
    // }
  }

  public isCheckmate() {
    if (this.isKingUnderAttack().BlackCheckFigures && this.blackCheck) {
      this.checkmate = true;
    }
    if (!this.isKingUnderAttack().BlackCheckFigures && this.blackCheck) {
      this.blackCheck = false;
    }
    if (this.isKingUnderAttack().BlackCheckFigures && !this.blackCheck) {
      this.blackCheck = true;
    }
    if (this.isKingUnderAttack().WhiteCheckFigures && this.whiteCheck) {
      this.checkmate = true;
    }
    if (!this.isKingUnderAttack().WhiteCheckFigures && this.whiteCheck) {
      this.whiteCheck = false;
    }
    if (this.isKingUnderAttack().WhiteCheckFigures && !this.whiteCheck) {
      this.whiteCheck = true;
    }
  }
  private addPawns() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.BLACK, this.getCell(i, 1));
      new Pawn(Colors.WHITE, this.getCell(i, 6));
    }
  }
  private addKings() {
    new King(Colors.BLACK, this.getCell(4, 0));
    new King(Colors.WHITE, this.getCell(4, 7));
  }
  private addQueens() {
    new Queen(Colors.BLACK, this.getCell(3, 0));
    new Queen(Colors.WHITE, this.getCell(3, 7));
  }
  private addKnights() {
    new Knight(Colors.BLACK, this.getCell(1, 0));
    new Knight(Colors.WHITE, this.getCell(1, 7));
    new Knight(Colors.BLACK, this.getCell(6, 0));
    new Knight(Colors.WHITE, this.getCell(6, 7));
  }
  private addBishops() {
    new Bishop(Colors.BLACK, this.getCell(2, 0));
    new Bishop(Colors.WHITE, this.getCell(2, 7));
    new Bishop(Colors.BLACK, this.getCell(5, 0));
    new Bishop(Colors.WHITE, this.getCell(5, 7));
  }
  private addRooks() {
    new Rook(Colors.BLACK, this.getCell(0, 0));
    new Rook(Colors.WHITE, this.getCell(0, 7));
    new Rook(Colors.BLACK, this.getCell(7, 0));
    new Rook(Colors.WHITE, this.getCell(7, 7));
  }
  public promoteQueen(color: Colors, x: number, y: number) {
    new Queen(color, this.getCell(x, y));
  }
  public addFigures() {
    this.addBishops();
    this.addKings();
    this.addPawns();
    this.addQueens();
    this.addRooks();
    this.addKnights();
  }
}
