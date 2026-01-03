console.log("Welcome to Tic Tac Toe");

// Audio
let music = new Audio("music.mp3");
let audioTurn = new Audio("ting.mp3");
let gameoverSound = new Audio("gameover.mp3");

music.loop = true;
music.volume = 0.3;

// Game state
let turn_sym = "X";
let Over = false;
let isMuted = false;
let gameMode = "ai"; // ai or pvp

// Start music on first interaction
let musicStarted = false;
document.body.addEventListener("click", () => {
    if (!musicStarted) {
        music.play();
        musicStarted = true;
    }
});

// Mode selector
const modeSelect = document.getElementById("modeSelect");
modeSelect.addEventListener("change", () => {
    gameMode = modeSelect.value;
    resetGame();
});

// Winning patterns
const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Check win
const checkWin = () => {
    let boxtexts = document.getElementsByClassName("boxtext");

    for (let [a,b,c] of wins) {
        if (
            boxtexts[a].innerText &&
            boxtexts[a].innerText === boxtexts[b].innerText &&
            boxtexts[a].innerText === boxtexts[c].innerText
        ) {
            document.querySelector(".info").innerText =
                boxtexts[a].innerText + " Won";

            Over = true;
            document.querySelector(".imgbox img").style.visibility = "visible";
            music.pause();
            gameoverSound.play();
            return true;
        }
    }
    return false;
};

// Get empty cells
const getEmptyIndexes = () => {
    let boxes = document.getElementsByClassName("boxtext");
    let empty = [];
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerText === "") empty.push(i);
    }
    return empty;
};

// AI move
const aiMove = () => {
    if (Over) return;

    let boxtexts = document.getElementsByClassName("boxtext");

    // Try win or block
    for (let sym of ["O", "X"]) {
        for (let [a,b,c] of wins) {
            let cells = [boxtexts[a], boxtexts[b], boxtexts[c]];
            let count = cells.filter(v => v.innerText === sym).length;
            let empty = cells.find(v => v.innerText === "");
            if (count === 2 && empty) {
                empty.innerText = "O";
                audioTurn.play();
                checkWin();
                turn_sym = "X";
                document.querySelector(".info").innerText = "Turn for X";
                return;
            }
        }
    }

    // Center
    if (boxtexts[4].innerText === "") {
        boxtexts[4].innerText = "O";
    } else {
        let empty = getEmptyIndexes();
        let move = empty[Math.floor(Math.random() * empty.length)];
        boxtexts[move].innerText = "O";
    }

    audioTurn.play();
    turn_sym = "X";
    document.querySelector(".info").innerText = "Turn for X";
};

// Box click logic
Array.from(document.getElementsByClassName("box")).forEach((box, index) => {
    let boxtext = box.querySelector(".boxtext");

    box.addEventListener("click", () => {
        if (boxtext.innerText !== "" || Over) return;

        // Player move
        boxtext.innerText = turn_sym;
        audioTurn.play();

        if (checkWin()) return;

        if (gameMode === "ai") {
            if (turn_sym === "X") {
                turn_sym = "O";
                document.querySelector(".info").innerText = "AI Thinking...";
                setTimeout(aiMove, 500);
            }
        } else {
            // Player vs Player
            turn_sym = turn_sym === "X" ? "O" : "X";
            document.querySelector(".info").innerText =
                "Turn for " + turn_sym;
        }
    });
});

// Reset game
const resetGame = () => {
    document.querySelectorAll(".boxtext").forEach(e => e.innerText = "");
    Over = false;
    turn_sym = "X";

    document.querySelector(".info").innerText = "Turn for X";
    document.querySelector(".imgbox img").style.visibility = "hidden";

    music.currentTime = 0;
    music.play();
};

// Reset button
document.getElementById("reset").addEventListener("click", resetGame);

// Mute / Unmute
const muteBtn = document.getElementById("mute");
muteBtn.addEventListener("click", () => {
    isMuted = !isMuted;

    music.muted = isMuted;
    audioTurn.muted = isMuted;
    gameoverSound.muted = isMuted;

    muteBtn.innerText = isMuted ? "🔇 Unmute" : "🔊 Mute";
});
