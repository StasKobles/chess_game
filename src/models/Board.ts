import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { Figure, FigureNames } from "./figures/Figure";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";
var lodash = require("lodash");

export class Board {
  cells: Cell[][] = []; //Y X
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];
  whiteCheck: boolean = false;
  blackCheck: boolean = false;
  checkmate: boolean = false;
  stalemate: boolean = false;
  promotePawnCell: Cell | null = null;

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
    newBoard.whiteCheck = this.whiteCheck;
    newBoard.checkmate = this.checkmate;
    newBoard.stalemate = this.stalemate;
    newBoard.promotePawnCell = this.promotePawnCell;
    return newBoard;
  }
  public highlightCells(selectedCell: Cell | null, color: Colors | undefined) {
    const info = this.checkList();
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        let target = row[j];
        if (info?.king.figure) {
          target.available = false;
          if (
            selectedCell === info.king &&
            !!selectedCell?.figure?.canMove(target)
          ) {
            if (this.isCellUnderAttack(target, color)) {
              const copyCells: Board = lodash.cloneDeep(this);
              copyCells.cells[selectedCell.y][selectedCell.x].figure = null;
              copyCells.cells[target.y][target.x].figure = selectedCell.figure;
              (copyCells.isKingUnderAttack().BlackCheckFigures &&
                selectedCell.figure?.color === Colors.BLACK) ||
              (copyCells.isKingUnderAttack().WhiteCheckFigures &&
                selectedCell.figure?.color === Colors.WHITE)
                ? (target.available = false)
                : (target.available = true);
            }
          }
          if (selectedCell !== info.king) {
            this.checkMoves(target) && !!selectedCell?.figure?.canMove(target)
              ? (target.available = true)
              : (target.available = false);
          }
        }
        if (!info?.king && !info?.attacker) {
          if (selectedCell?.figure?.name === FigureNames.KING) {
            if (
              this.isCellUnderAttack(target, color) &&
              !!selectedCell?.figure?.canMove(target)
            ) {
              target.available = true;
            } else {
              target.available = false;
            }
            if (
              selectedCell?.figure?.isFirstStep &&
              (target === this.cells[0][2] ||
                target === this.cells[0][6] ||
                target === this.cells[7][2] ||
                target === this.cells[7][6])
            ) {
              target.available = !!this.castling(target, color);
            }
          }
          if (selectedCell?.figure?.name !== FigureNames.KING) {
            target.available = !!selectedCell?.figure?.canMove(target);
          }
        }
        if (
          selectedCell &&
          selectedCell.figure?.name !== FigureNames.KING &&
          target.available
        ) {
          const copyCells: Board = lodash.cloneDeep(this);
          copyCells.cells[selectedCell.y][selectedCell.x].figure = null;
          copyCells.cells[target.y][target.x].figure = selectedCell.figure;
          (copyCells.isKingUnderAttack().BlackCheckFigures &&
            selectedCell.figure?.color === Colors.BLACK) ||
          (copyCells.isKingUnderAttack().WhiteCheckFigures &&
            selectedCell.figure?.color === Colors.WHITE)
            ? (target.available = false)
            : (target.available = true);
        }
      }
    }
  }
  public castling(target: Cell, color: Colors | undefined): boolean {
    if (
      color === Colors.BLACK &&
      target.x === 2 &&
      target.y === 0 &&
      this.cells[0][0].figure?.isFirstStep &&
      this.cells[0][4].figure?.isFirstStep &&
      !this.cells[0][1].figure &&
      !this.cells[0][2].figure &&
      !this.cells[0][3].figure &&
      this.isCellUnderAttack(this.getCell(2, 0), Colors.BLACK) &&
      this.isCellUnderAttack(this.getCell(3, 0), Colors.BLACK) &&
      this.isCellUnderAttack(this.getCell(4, 0), Colors.BLACK)
    ) {
      return true;
    }
    if (
      color === Colors.BLACK &&
      target.x === 6 &&
      target.y === 0 &&
      this.cells[0][7].figure?.isFirstStep &&
      this.cells[0][4].figure?.isFirstStep &&
      !this.cells[0][5].figure &&
      !this.cells[0][6].figure &&
      this.isCellUnderAttack(this.getCell(4, 0), Colors.BLACK) &&
      this.isCellUnderAttack(this.getCell(5, 0), Colors.BLACK) &&
      this.isCellUnderAttack(this.getCell(6, 0), Colors.BLACK)
    ) {
      return true;
    }
    if (
      color === Colors.WHITE &&
      target.x === 2 &&
      target.y === 7 &&
      this.cells[7][0].figure?.isFirstStep &&
      this.cells[7][4].figure?.isFirstStep &&
      !this.cells[7][1].figure &&
      !this.cells[7][2].figure &&
      !this.cells[7][3].figure &&
      this.isCellUnderAttack(this.getCell(2, 7), Colors.WHITE) &&
      this.isCellUnderAttack(this.getCell(3, 7), Colors.WHITE) &&
      this.isCellUnderAttack(this.getCell(3, 7), Colors.WHITE)
    ) {
      return true;
    }
    if (
      color === Colors.WHITE &&
      target.x === 6 &&
      target.y === 7 &&
      this.cells[7][7].figure?.isFirstStep &&
      this.cells[7][4].figure?.isFirstStep &&
      !this.cells[7][5].figure &&
      !this.cells[7][6].figure &&
      this.isCellUnderAttack(this.getCell(6, 7), Colors.WHITE) &&
      this.isCellUnderAttack(this.getCell(5, 7), Colors.WHITE) &&
      this.isCellUnderAttack(this.getCell(4, 7), Colors.WHITE)
    ) {
      return true;
    }
    return false;
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
  public isCellUnderAttack(target: Cell, color: Colors | undefined): boolean {
    let targetUnderAttack: boolean = false;
    this.cells.forEach((element) => {
      element.forEach((cell) => {
        if (cell.figure?.color !== color) {
          if (
            cell.figure?.name === FigureNames.PAWN &&
            cell.isPawnAttack(target)
          ) {
            targetUnderAttack = true;
          }

          if (
            cell.figure?.canMove(target) &&
            cell.figure?.name !== FigureNames.PAWN
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
  }
  public isCheckmate(color: Colors | undefined) {
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
    if (this.whiteCheck || this.blackCheck) {
      const oppositeColor =
        color === Colors.BLACK ? Colors.WHITE : Colors.BLACK;
      let checkmate: boolean = true;
      const copyCells: Board = lodash.cloneDeep(this);

      copyCells.cells.forEach((element) => {
        element.forEach((cell) => {
          if (cell.figure && cell.figure?.color === oppositeColor) {
            copyCells.highlightCells(cell, oppositeColor);
            for (let i = 0; i < copyCells.cells.length; i++) {
              const row = copyCells.cells[i];
              for (let j = 0; j < row.length; j++) {
                if (row[j].available === true) {
                  checkmate = false;
                }
              }
            }
          }
        });
      });
      if (checkmate) {
        this.checkmate = true;
      }
    }
    if (!this.whiteCheck && !this.blackCheck) {
      const oppositeColor =
        color === Colors.BLACK ? Colors.WHITE : Colors.BLACK;
      let stalemate: boolean = true;
      const copyCells: Board = lodash.cloneDeep(this);

      copyCells.cells.forEach((element) => {
        element.forEach((cell) => {
          if (cell.figure && cell.figure?.color === oppositeColor) {
            copyCells.highlightCells(cell, oppositeColor);
            for (let i = 0; i < copyCells.cells.length; i++) {
              const row = copyCells.cells[i];
              for (let j = 0; j < row.length; j++) {
                if (row[j].available === true) {
                  console.log(row[j]);
                  stalemate = false;
                }
              }
            }
          }
        });
      });
      if (stalemate) {
        this.stalemate = true;
      }
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
  public pawnReady() {
    let pawnCell: Cell | null = null;
    this.cells.forEach((element) => {
      element.forEach((cell) => {
        if (
          cell?.figure?.name === FigureNames.PAWN &&
          (cell.y === 0 || cell.y === 7)
        ) {
          pawnCell = cell;
        }
      });
    });
    this.promotePawnCell = pawnCell;
  }
  public promotePawn(color: Colors | undefined, cell: Cell, type: FigureNames) {
    if (type === FigureNames.QUEEN && color) {
      new Queen(color, cell);
    }
    if (type === FigureNames.ROOK && color) {
      new Rook(color, cell);
    }
    if (type === FigureNames.KNIGHT && color) {
      new Knight(color, cell);
    }
    if (type === FigureNames.BISHOP && color) {
      new Bishop(color, cell);
    }
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
