/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import mainStyles from "./../styles/main.css";

function generateBoard(height, width) {
  const newBoard = {};
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const id = [col, row];
      const square = {
        id,
        moves: null,
        visitors: {
          base: [],
          target: [],
        },
      };
      newBoard[id] = square;
    }
  }
  Object.values(newBoard).forEach((squareNode) => {
    squareNode.moves = findPossibleMoves(squareNode.id, newBoard);
  });
  return newBoard;
}

function move(loc, instructions) {
  // loc = coordinates in an array; instructions= "udlr" || "uuuu" || "uuudllllrr"; u = up, d = down, l = left, r = right;
  const result = loc.slice(0);
  for (let i = 0; i < instructions.length; i++) {
    switch (instructions.charAt(i)) {
      case "u":
        result[1] += 1;
        break;
      case "d":
        result[1] -= 1;
        break;
      case "l":
        result[0] -= 1;
        break;
      case "r":
        result[0] += 1;
        break;
      default:
        throw Error("invalid instruction");
    }
  }
  return result;
}

function findPossibleMoves(id, board) {
  const moves = [];
  ["uur", "rru", "rrd", "ddr", "ddl", "lld", "llu"].forEach((sequence) => {
    const newLoc = move(id, sequence);
    if (typeof board[newLoc] !== "undefined") {
      moves.push(newLoc);
    }
  });

  return moves;
}

function search() {}

function constructPath() {}

function knightMoves() {}

const board = generateBoard(8, 8);

console.log(board);
