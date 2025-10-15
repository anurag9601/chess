export function pawn(row: number, col: number, board: string[][], turnOf: string): number[][] {
    const moves: number[][] = [];
    if (turnOf === "White") {
        if (row > 0 && board[row - 1][col] === "") {
            moves.push([row - 1, col]);
        }

        if (row == 6 && board[row - 2][col] === "") {
            moves.push([row - 2, col]);
        }

        if (row > 0 && col >= 0 && board[row - 1][col - 1] !== "") {
            moves.push([row - 1, col - 1])
        }

        if (row > 0 && col <= 7 && board[row - 1][col + 1] !== "") {
            moves.push([row - 1, col + 1])
        }
    } else {
        if (row < 7 && board[row + 1][col] === "") {
            moves.push([row + 1, col])
        }

        if (row == 1 && board[row + 2][col] === "") {
            moves.push([row + 2, col]);
        }

        if (row < 7 && col >= 0 && board[row + 1][col - 1] !== "") {
            moves.push([row + 1, col - 1])
        }

        if (row < 7 && col <= 7 && board[row + 1][col + 1] !== "") {
            moves.push([row + 1, col + 1])
        }
    }

    return moves;
}

export function rook(row: number, col: number, board: string[][], turnOf: string): number[][] {
    const moves: number[][] = [];

    let rowIndex: number = row - 1;
    let colIndex: number = col;

    while (rowIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex])
            break
        } else {
            moves.push([rowIndex, colIndex])
            rowIndex -= 1;
        }
    }

    rowIndex = row + 1;
    colIndex = col;

    while (rowIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex += 1;
        }
    }

    rowIndex = row;
    colIndex = col - 1;

    while (colIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break
        } else {
            moves.push([rowIndex, colIndex]);
            colIndex -= 1;
        }
    }

    rowIndex = row;
    colIndex = col + 1;

    while (colIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break
        } else {
            moves.push([rowIndex, colIndex]);
            colIndex += 1;
        }
    }

    return moves;
}

export function knight(row: number, col: number, board: string[][], turnOf: string): number[][] {
    const moves: number[][] = [];
    if (row - 1 >= 0) {
        if (col - 2 >= 0) {
            moves.push([row - 1, col - 2]);
        }

        if (col + 2 <= 7) {
            moves.push([row - 1, col + 2])
        }
    }

    if (row - 2 >= 0) {
        if (col - 1 >= 0) {
            moves.push([row - 2, col - 1]);
        }

        if (col + 1 <= 7) {
            moves.push([row - 2, col + 1]);
        }
    }

    if (row + 1 <= 7) {
        if (col - 2 >= 0) {
            moves.push([row + 1, col - 2]);
        }

        if (col + 2 <= 7) {
            moves.push([row + 1, col + 2])
        }
    }

    if (row + 2 <= 7) {
        if (col - 1 >= 0) {
            moves.push([row + 2, col - 1]);
        }

        if (col + 1 <= 7) {
            moves.push([row + 2, col + 1]);
        }
    };

    return moves;
}

export function bishop(row: number, col: number, board: string[][], turnOf: string): number[][] {
    let moves: number[][] = [];

    let rowIndex: number = row - 1;
    let colIndex: number = col - 1;

    while (rowIndex >= 0 && colIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex -= 1;
            colIndex -= 1;
        }
    }

    rowIndex = row - 1;
    colIndex = col + 1;

    while (rowIndex >= 0 && colIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex -= 1;
            colIndex += 1;
        }
    }

    rowIndex = row + 1;
    colIndex = col - 1;

    while (rowIndex <= 7 && colIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex += 1;
            colIndex -= 1;
        }
    }

    rowIndex = row += 1;
    colIndex = col += 1;

    while (rowIndex <= 7 && colIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex += 1;
            colIndex += 1;
        }
    }

    return moves;
}

export function queen(row: number, col: number, board: string[][], turnOf: string): number[][] {
    let moves: number[][] = [];

    let rowIndex: number = row - 1;
    let colIndex: number = col - 1;

    while (rowIndex >= 0 && colIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex -= 1;
            colIndex -= 1;
        }
    }

    rowIndex = row - 1;
    colIndex = col + 1;

    while (rowIndex >= 0 && colIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex -= 1;
            colIndex += 1;
        }
    }

    rowIndex = row + 1;
    colIndex = col - 1;

    while (rowIndex <= 7 && colIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex += 1;
            colIndex -= 1;
        }
    }

    rowIndex = row += 1;
    colIndex = col += 1;

    while (rowIndex <= 7 && colIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex += 1;
            colIndex += 1;
        }
    }

    rowIndex = row - 1;
    colIndex = col;

    while (rowIndex >= 0) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex -= 1;
        }
    }

    rowIndex = row + 1;
    colIndex = col;

    while (rowIndex <= 7) {
        if (board[rowIndex][colIndex] !== "") {
            moves.push([rowIndex, colIndex]);
            break;
        } else {
            moves.push([rowIndex, colIndex]);
            rowIndex += 1;
        }
    };

    return moves;
}

export function king(row: number, col: number, board: string[][], turnOf: string): number[][] {
    const moves: number[][] = [];

    if (row - 1 >= 0) {
        moves.push([row - 1, col]);

        if (col - 1 >= 0) {
            moves.push([row - 1, col - 1]);
        }

        if (col + 1 <= 7) {
            moves.push([row - 1, col + 1]);
        }
    }

    if (col - 1 >= 0) {
        moves.push([row, col - 1]);
    }

    if (col + 1 <= 7) {
        moves.push([row, col + 1]);
    }

    if (row + 1 <= 7) {
        moves.push([row + 1, col]);

        if (col - 1 >= 0) {
            moves.push([row + 1, col - 1]);
        }

        if (col + 1 <= 7) {
            moves.push([row + 1, col + 1]);
        }
    };

    return moves;
}