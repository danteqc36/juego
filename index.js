require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');
const { startGame, checkGuess } = require('./game');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Comando iniciar
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "🎮 Bienvenido al juego!\nUsa /play para jugar");
});

// Iniciar juego
bot.onText(/\/play/, (msg) => {
  startGame(msg.from.id);
  bot.sendMessage(msg.chat.id, "Adivina un número del 1 al 10");
});

// Ranking
bot.onText(/\/ranking/, (msg) => {
  db.all("SELECT username, score FROM users ORDER BY score DESC LIMIT 10", [], (err, rows) => {
    let text = "🏆 Ranking:\n\n";
    rows.forEach((r, i) => {
      text += `${i + 1}. ${r.username} - ${r.score}\n`;
    });
    bot.sendMessage(msg.chat.id, text);
  });
});

// Mensajes (intentos)
bot.on("message", (msg) => {
  const guess = parseInt(msg.text);
  if (isNaN(guess)) return;

  const result = checkGuess(msg.from.id, guess);

  if (result.error) return;

  if (result.result === "win") {
    bot.sendMessage(msg.chat.id, `🎉 Correcto! Era ${result.number}`);

    db.run(
      `INSERT INTO users(id, username, score)
       VALUES(?, ?, 1)
       ON CONFLICT(id) DO UPDATE SET score = score + 1`,
      [msg.from.id, msg.from.username]
    );

  } else {
    bot.sendMessage(msg.chat.id, "❌ Intenta otra vez");
  }
});
