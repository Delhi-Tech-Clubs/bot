import "dotenv/config";
import http from "http";
import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import { tune } from "./birthday.js";
import { announce } from "./announce.js";
import { init, count } from "./count.js";

process.on("unhandledRejection", console.error);

const dtc = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

dtc.once("ready", () => init(dtc));

dtc.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (["dtc", "Dtc", "DTC"].includes(message.content)) {
    message.react("❤️").catch(console.error);
    message.react("🇩").catch(console.error);
    message.react("🇹").catch(console.error);
    message.react("🇨").catch(console.error);
  }
});

dtc.on("messageCreate", tune);
dtc.on("messageCreate", count);

dtc.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!link") {
    message.channel.send("[GitHub](https://github.com/Delhi-Tech-Clubs)").catch(console.error);
    message.react("dtcc:1542895871610462248").catch(console.error);
  }
});

dtc.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content === "!github") {
    message.channel.send("[GitHub](https://github.com/Delhi-Tech-Clubs)").catch(console.error);
    message.react("dtcc:1542895871610462248").catch(console.error);
  }
});

cron.schedule("0 9 * * *", () => announce(dtc), { timezone: "Asia/Kolkata" });

http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <body bgcolor="#0d0d0d">
      <center>
        <img src="https://s6.imgcdn.dev/Y8k6ut.png">
      </center>
    </body>
  `);
}).listen(process.env.PORT || 3000, "0.0.0.0");

dtc.login(process.env.TOKEN);
