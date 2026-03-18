const activeGames = {};

function startGame(userId) {
  const number = Math.floor(Math.random() * 10) + 1;
  activeGames[userId] = number;
}

function checkGuess(userId, guess) {
  const number = activeGames[userId];

  if (!number) return { error: "No hay juego activo" };

  if (guess == number) {
    delete activeGames[userId];
    return { result: "win", number };
  } else {
    return { result: "lose" };
  }
}

module.exports = { startGame, checkGuess };
