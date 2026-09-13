import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import { tune } from "./birthday.js";
import { announce } from "./announce.js";
import { count } from "./count.js";
import { onboard } from "./onboarding.js";
import http from 'http';

process.on("unhandledRejection", console.error);

const dtc = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

dtc.on("guildMemberAdd", onboard);

dtc.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (["dtc", "Dtc", "DTC"].includes(message.content)) {
    message.react("❤️");
    message.react("🇩");
    message.react("🇹");
    message.react("🇨");
  }
});

dtc.on("messageCreate", tune);
dtc.on("messageCreate", count);

dtc.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!link") {
    message.channel.send("[GitHub](https://github.com/Delhi-Tech-Clubs)");
    message.react("dtcc:1542895871610462248");
  }
});

dtc.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!github") {
    message.channel.send("[GitHub](https://github.com/Delhi-Tech-Clubs)");
    message.react("dtcc:1542895871610462248");
  }
});

cron.schedule("0 9 * * *", () => announce(dtc), { timezone: "Asia/Kolkata" });

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('dtc');
}).listen(process.env.PORT || 3000);

dtc.login(process.env.TOKEN);
