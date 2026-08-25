require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

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

bot.login(process.env.TOKEN);
