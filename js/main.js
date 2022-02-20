document.addEventListener("DOMContentLoaded", () => {
  createSquares();

  let word;
  let possibleWords = [];

  fetchWords();

  let gameEnded = false;

  let guessedWords = [[]];
  let availableSpace = 1;
  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

  function fetchWords() {
    possibleWords = [
      "absol",
      "aipom",
      "arbok",
      "azelf",
      "bagon",
      "budew",
      "burmy",
      "deino",
      "ditto",
      "doduo",
      "eevee",
      "ekans",
      "entei",
      "gible",
      "gloom",
      "golem",
      "goomy",
      "hoopa",
      "hypno",
      "inkay",
      "klang",
      "klink",
      "kubfu",
      "lotad",
      "lugia",
      "luxio",
      "magby",
      "minun",
      "munna",
      "numel",
      "paras",
      "pichu",
      "ralts",
      "riolu",
      "rotom",
      "shinx",
      "snivy",
      "tepig",
      "throh",
      "toxel",
      "unown",
      "yanma",
      "zorua",
      "zubat",
    ];

    word = getRandomWord();

    console.log(possibleWords);
  }

  function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * possibleWords.length);

    return possibleWords[randomIndex];
  }

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));
      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    const isCorrectLetter = word.includes(letter);

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleDeleteLetter() {
    if (gameEnded) return;

    let currentWordArr = getCurrentWordArr();
    if (currentWordArr.length === 0) {
      return;
    }

    const removedLetter = currentWordArr.pop();

    const availableSpaceEl = document.getElementById(
      String(availableSpace - 1)
    );
    availableSpace = availableSpace - 1;
    availableSpaceEl.textContent = "";
  }

  function handleSubmitWord() {
    if (gameEnded) return;

    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters...");
    }

    const currentWord = currentWordArr.join("");

    if (possibleWords.indexOf(currentWord) === -1) {
      const suggestion = getRandomWord();

      window.alert(`That's not a Pokémon... why not try ${suggestion}?`);
      return;
    }

    const firstLetterId = guessedWordCount * 5 + 1;
    const interval = 200;
    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index);

        const letterId = firstLetterId + index;
        const letterEl = document.getElementById(letterId);
        letterEl.classList.add("animate__flipInX");
        letterEl.style = `background-color: ${tileColor}; border-color: ${tileColor}`;

        const keyElement = document.querySelector(`[data-key="${letter}"]`);
        keyElement.style = `background-color: ${tileColor};`;
      }, interval * index);
    });

    guessedWordCount += 1;

    if (currentWord === word) {
      window.alert("Congratultions!");
      gameEnded = true;
    }

    if (guessedWords.length === 6) {
      window.alert(`You lose! The word is ${word}`);
      gameEnded = true;
    }

    if (gameEnded) {
      return;
    }

    guessedWords.push([]);
  }

  function createSquares() {
    const gameBoard = document.getElementById("board");

    for (let index = 0; index < 30; index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute("data-key");

      handleKeyPress(letter);
    };
  }

  function handleKeyPress(letter) {
    if (letter === "del") {
      handleDeleteLetter();
      return;
    }

    if (letter === "enter") {
      handleSubmitWord();
      return;
    }

    updateGuessedWords(letter);
  }

  document.addEventListener("keydown", (e) => {
    let letter = e.key;

    if (letter === "Enter") letter = "enter";
    if (letter === "Backspace") letter = "del";

    if (letter.match(/^[a-zA-Z]$/) || letter === "del" || letter === "enter") {
      handleKeyPress(letter.toLowerCase());
    }
  });
});
