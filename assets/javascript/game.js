// Word guess game / HangAnimal

const words = {
    giraffe: {
        name: "giraffe",
        url: "./assets/images/giraffe.jfif",
    },
    elephant: {
        name: "elephant",
        url: "./assets/images/elephant.jfif",
    },
    tiger: {
        name: "tiger",
        url: "./assets/images/tiger.jfif",
    },
    unicorn: {
        name: "unicorn",
        url: "./assets/images/unicorn.jfif",
    }
};

const allowedGuesses = 5;

const game = {
    currentWord: "",
    wordMap: null,
    guessedCharSet: null,
    correctNumChars: 0,
    correctGuesses: null,
    guessesLeft: allowedGuesses,
    wins: 0,
    gameState: {
        finished: false,
        win: false,
        loss: false
    },

    makeWordMap() {
        // Map -> <char, Set<int>> Maps characters in word to a set containing all the indices
        //  of the char in the word for faster lookup
        for (let i = 0; i < this.currentWord.length; i++) {
            const char = this.currentWord[i];
            const value = this.wordMap.get(char);
            if (value) {
                value.add(i);
            } else {
                this.wordMap.set(char, new Set([i]));
            }
        }
    },

    initCorrectGuessesArray() {
        // Creates array filled with underscores as char placeholders
        this.correctGuesses = [];
        for (let i = 0; i < this.currentWord.length; i++) {
            this.correctGuesses[i] = "_";
        }
    },

    initGame() {
        // Initializes game
        this.setGameState(false, false, false);

        // Picks a random word from words
        const wordKeys = Object.keys(words);
        const key = wordKeys[Math.floor(Math.random() * wordKeys.length)];
        this.currentWord = words[key].name;

        this.wordMap = new Map();
        this.guessedCharSet = new Set();
        this.correctNumChars = 0;
        this.guessesLeft = allowedGuesses;
        this.makeWordMap();
        this.initCorrectGuessesArray();
    },

    decrementGuesses() {
        this.guessesLeft--;
    },

    addGuess(char) {
        this.guessedCharSet.add(char);
    },

    incrementWins() {
        this.wins++;
    },

    setGameState(finished, win, loss) {
        this.gameState.finished = finished;
        this.gameState.win = win;
        this.gameState.loss = loss
    },

    showWord() {
        this.correctGuesses = this.currentWord.split("");
    },

    playRound(char) {
        if (this.guessedCharSet.has(char)) {
            // Char already guessed
            alert("You already guessed " + char + "!");
        } else {
            // Fill in char in correctGuesses
            let positionIter = this.wordMap.get(char);
            if (positionIter) {
                let positions = positionIter.entries();
                for (let [pos, x] of positions) {
                    this.correctGuesses[pos] = char;
                    this.correctNumChars += 1
                }
            } else {
                this.decrementGuesses();
            }
            this.addGuess(char);

            if (this.correctNumChars === this.currentWord.length) {
                // Win
                this.incrementWins();
                this.setGameState(true, true, false);
            }

            if (this.guessesLeft === 0) {
                // Loss
                this.setGameState(true, false, true);
                this.showWord()
            }
        }
    }
};

function showGameState(game) {

    // Convert guessed char set to an array
    const guessedChars = [];
    const charEntries = game.guessedCharSet.entries();
    for (let [char, x] of charEntries) {
        guessedChars.push(char);
    }
    // Updates game state display
    document.getElementById("wins").textContent = game.wins;
    document.getElementById("current-word").textContent = game.correctGuesses.join(" ");
    document.getElementById("guessed-chars").textContent = guessedChars.join(" ");
    document.getElementById("guesses-left").textContent = game.guessesLeft;
};

// Initializes game before any key press
function initGame() {
    game.initGame();
    showGameState(game);
};

initGame();

// Main game function
document.onkeyup = function WordGuessGame(event) {
    const guess = event.key;
    const endGameText = document.getElementById("end-game-text");

    if (game.gameState.finished) { // Reset game
        game.initGame();
        endGameText.textContent = "";
        const animalPic = document.getElementById("animalImg");
        if (animalPic) {
            animalPic.parentNode.removeChild(animalPic);
        }
    }

    game.playRound(guess);

    if (game.gameState.finished) { // Game is finished
        
        if (game.gameState.win) {
            endGameText.textContent = "You Win!"

            const imagePath = words[game.currentWord].url;
            const image = document.createElement("img");
            image.setAttribute("id", "animalImg");
            image.src = imagePath;
            const div = document.getElementById("picture");
            div.appendChild(image);
        } else {
            endGameText.textContent = "You Lose!"
        }
    }

    showGameState(game);
}
