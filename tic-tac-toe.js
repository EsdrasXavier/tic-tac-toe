const DATA_CELL_ATTR = 'data-cell-index';

const WINNING_CONDITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const EMPTY_CELL = '';
const X_MARK = 'X';
const O_MARK = 'O';

const WIN_STATUS = 'WIN';
const DRAW_STATUS = 'DRAW';
const ACTIVE_STATUS = 'ACTIVE';

const createCell = (index) => {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.setAttribute(DATA_CELL_ATTR, index);

    return cell;
}

const createCellContent = (playerMark) => `<span>${playerMark}</span>`;

const getCurrentPlayerTurnMessage = (currentPlayer) => `It's ${currentPlayer}'s turn`;
const getWinningMessage = (currentPlayer) => `Player ${currentPlayer} has won!`;
const getDrawMessage = () => `Game ended in a draw!`;


class TicTacToeGame {
    _gameState = new Array(9).fill(EMPTY_CELL);
    _winnerCells = [];

    _boardContainer = null;
    _statusContainer = null;

    _gameStatus = ACTIVE_STATUS;
    _currentPlayer = X_MARK;

    constructor(gameContainerId) {
        this._boardContainer = document.getElementById(gameContainerId);

        if (this._boardContainer === null) {
            throw new Error(`Game container with id '${gameContainerId}' does not exist!`);
        }
    }

    set statusContainer(containerId) {
        this._statusContainer = document.getElementById(containerId);

        if (this._statusContainer === null) {
            throw new Error(`Container with id '${gameContainerId}' does not exist!`);
        }
    }

    get isGameActive() {
        return this._gameStatus === ACTIVE_STATUS;
    }

    get isGameOver() {
        return !this.isGameActive;
    }


    start() {
        this._renderCells();
        this._updateGameStatusUI();
    }

    reset() {
        this._gameStatus = ACTIVE_STATUS;
        this._currentPlayer = X_MARK;
        this._winnerCells = [];

        this._clearCells();
        this._updateGameStatusUI();
    }

    _renderCells() {
        for (let cellNumber = 0; cellNumber < 9; cellNumber++) {
            const cell = this._boardContainer.appendChild(createCell(cellNumber));
            cell.addEventListener('click', (event) => this._handleCellClick(event));
        }
    }

    _handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (!this.isGameActive || this._gameState[clickedCellIndex] !== '') {
            return;
        }

        this._gameState[clickedCellIndex] = this._currentPlayer;
        this._updateCellUI(clickedCell);

        this._checkForGameOver();

        if (this.isGameActive) {
            this._changePlayer();
        }

        this._updateGameStatusUI();
    }

    _checkForGameOver() {
        let isGameOver = false;

        for (let i = 0; i <= 7; i++) {
            const winCondition = WINNING_CONDITIONS[i];
            const cell1 = this._gameState[winCondition[0]];
            const cell2 = this._gameState[winCondition[1]];
            const cell3 = this._gameState[winCondition[2]];

            if (cell1 === '' || cell2 === '' || cell3 === '') {
                continue;
            }

            if (cell1 === cell2 && cell2 === cell3) {
                isGameOver = true;
                this._winnerCells = [winCondition[0], winCondition[1], winCondition[2]];
                break;
            }
        }

        if (isGameOver) {
            this._gameStatus = WIN_STATUS;
            return;
        }

        const isDraw = !this._gameState.includes(EMPTY_CELL);

        if (isDraw) {
            this._gameStatus = DRAW_STATUS;
        }
    }

    _updateCellUI(cell) {
        cell.innerHTML = createCellContent(this._currentPlayer);
    }

    _clearCells() {
        document.querySelectorAll('.cell')
            .forEach((cell, index) => {
                this._gameState[index] = EMPTY_CELL;
                cell.innerHTML = EMPTY_CELL;
            });
    }

    _updateGameStatusUI() {
        if (this.isGameActive) {
            this._statusContainer.innerHTML = getCurrentPlayerTurnMessage(this._currentPlayer);
            return;
        }

        if (this._gameStatus === DRAW_STATUS) {
            this._statusContainer.innerHTML = getDrawMessage();
        } else {
            this._showWinnerAnimation();
            this._statusContainer.innerHTML = getWinningMessage(this._currentPlayer);
        }
    }

    _showWinnerAnimation() {
        this._winnerCells.forEach(index => document
            .querySelector(`[${DATA_CELL_ATTR}='${index}']`)
            .firstChild
            .classList
            .add('winner'));
    }

    _changePlayer() {
        const nextPlayer = this._currentPlayer === X_MARK ? O_MARK : X_MARK;
        this._currentPlayer = nextPlayer
    }
}