document.addEventListener("DOMContentLoaded", () => {
  createSquares();
  fetchWords();

  let gameEnded = false;

  let guessedWords = [[]];
  let availableSpace = 1;

  let word;
  let possibleWords = [];
  let guessedWordCount = 0;

  const keys = document.querySelectorAll(".keyboard-row button");

  function fetchWords() {
    const query = `query samplePokeAPIquery {
        squirdle: pokemon_v2_pokemonspecies(where: {name: {_regex: "^[a-zA-Z]{5}$"}}, order_by: {name: asc}) {
          name
        }
      }`;

    fetch("https://beta.pokeapi.co/graphql/v1beta", {
      method: "post",
      body: JSON.stringify({
        query,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then((result) => {
        const wordOptions = result.data.squirdle;

        const randomIndex = Math.floor(Math.random() * wordOptions.length);

        word = wordOptions[randomIndex].name;

        possibleWords = wordOptions.map((option) => option.name);

        console.log(possibleWords);
      });
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
      return "green";
    }

    return "orange";
  }

  function handleDeleteLetter() {
    if(gameEnded) return;

    let currentWordArr = getCurrentWordArr();
    if (currentWordArr.length === 0) {
      return;
    }

    const removedLetter = currentWordArr.pop();

    const availableSpaceEl = document.getElementById(String(availableSpace - 1));
    availableSpace = availableSpace - 1;
    availableSpaceEl.textContent = "";
  }

  function handleSubmitWord() {
    if(gameEnded) return;

    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== 5) {
      window.alert("Word must be 5 letters...");
    }

    const currentWord = currentWordArr.join("");

    if (possibleWords.indexOf(currentWord) === -1) {
      window.alert("That's not a Pokémon... silly!");
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

    if(gameEnded) {
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

      if(letter === "del"){
        handleDeleteLetter();
        return;
      }

      if (letter === "enter") {
        handleSubmitWord();
        return;
      }

      updateGuessedWords(letter);
    };
  }
});
