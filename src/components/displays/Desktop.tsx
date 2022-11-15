import { FC } from "react";
import { Board } from "../../models/Board";
import { Player } from "../../models/Player";
import BoardComponent from "../BoardComponent";
import LostFigures from "../LostFigures";
import Timer from "../Timer";

interface DesktopProps {
  restart: () => void;
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}
const Desktop: FC<DesktopProps> = ({
  restart,
  currentPlayer,
  board,
  setBoard,
  swapPlayer,
}) => {
  return (
    <div className="screen">
      <Timer restart={restart} currentPlayer={currentPlayer} />
      <BoardComponent
        restart={restart}
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
      ></BoardComponent>
      <div>
        <LostFigures figures={board.lostBlackFigures} title="Black figures" />
        <LostFigures figures={board.lostWhiteFigures} title="White figures" />
      </div>
    </div>
  );
};

export default Desktop;
