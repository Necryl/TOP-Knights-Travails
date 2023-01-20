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
      moves.push(board[newLoc]);
    }
  });

  return moves;
}

function search(baseNode, targetNode) {
  const queue = {
    base: [baseNode],
    target: [targetNode],
  };

  let searchStatus = true;

  const visitor = (node, steps) => {
    return {
      node,
      steps,
    };
  };

  Object.keys(queue).forEach((type) => {
    queue[type][0].visitors[type].push(visitor(null, 0));
  });

  const process = (type, q) => {
    let result = false;
    const current = q.shift();
    const parentRecord = current.visitors[type].reduce((final, record) => {
      if (final.steps > record.steps) {
        final = record;
      }
      return final;
    });
    const children = [];
    current.moves.forEach((child) => {
      if (child !== parentRecord.node) {
        children.push(child);
      }
    });
    const newRecord = visitor(current, parentRecord.steps + 1);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.visitors[type].push(newRecord);
      if (child.visitors[type === "base" ? "target" : "base"].length !== 0) {
        result = child;
        break;
      }
      q.push(child);
    }
    return result;
  };

  let contactNode;
  while (searchStatus) {
    // eslint-disable-next-line no-loop-func
    Object.keys(queue).forEach((type) => {
      if (queue[type].length !== 0 && searchStatus) {
        const result = process(type, queue[type]);
        if (result !== false) {
          searchStatus = false;
          contactNode = result;
        }
      }
    });
  }
  return constructPath(contactNode);
}

function constructPath(node) {
  const path = [node.id];
  const probe = (type, currentNode, pathArray = path) => {
    const nextNode = currentNode.visitors[type].reduce((final, current) => {
      if (final.steps > current.steps) {
        final = current;
      }
      return final;
    }).node;
    if (nextNode !== null) {
      if (type === "base") {
        pathArray.unshift(nextNode.id);
      } else {
        pathArray.push(nextNode.id);
      }
      probe(type, nextNode, pathArray);
    }
  };
  probe("base", node);
  probe("target", node);

  return path;
}

function knightMoves(baseLoc, targetLoc, board, logToConsole = true) {
  const baseNode = board[baseLoc];
  const targetNode = board[targetLoc];
  const path = search(baseNode, targetNode);

  if (logToConsole) {
    /* eslint-disable no-console */
    console.log(`You made it in ${path.length} moves! Here's your path:`);
    path.forEach((loc) => console.log(JSON.stringify(loc)));
    /* eslint-enable no-console */
  }
  return path;
}

const board = generateBoard(8, 8);

knightMoves([0, 0], [7, 7], board);
