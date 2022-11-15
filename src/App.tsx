import { useEffect, useState } from "react";
import "./App.sass";
import { Board } from "./models/Board";
import { Colors } from "./models/Colors";
import { Player } from "./models/Player";
import { useMediaQuery } from "react-responsive";
import Desktop from "./components/displays/Desktop";
import Mobile from "./components/displays/Mobile";
const App = () => {
  const [board, setBoard] = useState(new Board());
  const whitePlayer = new Player(Colors.WHITE);
  const blackPlayer = new Player(Colors.BLACK);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  useEffect(() => {
    restart();
  }, []);

  function swapPlayer() {
    setCurrentPlayer(
      currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }

  function restart() {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
  }
  return (
    <div className="app">
      {isDesktopOrLaptop && (
        <Desktop
          restart={restart}
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
        />
      )}
      {isTabletOrMobile && (
        <Mobile
          restart={restart}
          board={board}
          setBoard={setBoard}
          currentPlayer={currentPlayer}
          swapPlayer={swapPlayer}
        />
      )}
    </div>
  );
};

export default App;
