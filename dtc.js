import "dotenv/config";
import http from "http";
import { Client, GatewayIntentBits } from "discord.js";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (["dtc", "Dtc", "DTC"].includes(message.content)) {
    await message.react("❤️");
    await message.react("🇩");
    await message.react("🇹");
    await message.react("🇨");
  }
});

http.createServer((req, res) => {
  res.writeHead(200);
  res.end("DTC");
}).listen(process.env.PORT || 3000, "0.0.0.0");

bot.login(process.env.TOKEN);
