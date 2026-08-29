import "dotenv/config";
import http from "http";
import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import { tune } from "./birthday.js";
import { announce } from "./announce.js";

const dtc = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

dtc.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (["dtc", "Dtc", "DTC"].includes(message.content)) {
    await message.react("❤️");
    await message.react("🇩");
    await message.react("🇹");
    await message.react("🇨");
  }
});

dtc.on("messageCreate", tune);

dtc.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!link") {
    message.reply("[GitHub](https://github.com/Delhi-Tech-Clubs)");
    message.react("dtcc:1542895871610462248");
  }
});

dtc.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!github") {
    message.reply("[GitHub](https://github.com/Delhi-Tech-Clubs)");
    message.react("dtcc:1542895871610462248");
  }
});

cron.schedule("0 9 * * *", () => announce(dtc), { timezone: "Asia/Kolkata" });

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("DTC");
}).listen(process.env.PORT || 3000, "0.0.0.0");

dtc.login(process.env.TOKEN);
