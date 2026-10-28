import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import { tune } from "./birthday.js";
import { announce } from "./announce.js";
import { count } from "./count.js";
import { onboard } from "./onboarding.js";
import { club } from "./club.js";
import { git } from "./git.js";
import http from 'http';

process.on("unhandledRejection", console.error);

const HQ = "1539307092366725190";

const dtc = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

dtc.once("ready", () => {
  dtc.user.setStatus("dnd");
});

dtc.on("guildMemberAdd", onboard);
dtc.on("messageCreate", tune);
dtc.on("messageCreate", count);
dtc.on("messageCreate", club);
dtc.on("messageCreate", git);

dtc.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("dtc bol ")) return;

  const content = message.content.slice(8);
  const hasMentions = message.mentions.everyone || message.mentions.roles.size > 0;

  if (hasMentions && !message.member.roles.cache.has(HQ)) {
    await message.delete();
    return;
  }

  console.log(`[dtc bol] ${message.author.tag} (${message.author.id}) | #${message.channel.name} | "${content}"`);
  await message.channel.send(content);
  await message.delete();
});

cron.schedule("0 9 * * *", () => announce(dtc), { timezone: "Asia/Kolkata" });

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('dtc');
}).listen(process.env.PORT || 3000);

dtc.login(process.env.TOKEN);
