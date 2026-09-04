import { getEntries } from "./notion.js";

export async function announce(dtc) {
  try {
    const entries = await getEntries();
    const today = new Date();
    const channel = await dtc.channels.fetch(process.env.ANNOUNCE_CHANNEL_ID);
    //1542513148861489282
    //converting channel id to smt which discord.js can use

    for (const entry of entries) {
      const [day, month] = entry.bdate.split("/").map(Number);

      if (day === today.getDate() && month === today.getMonth() + 1) {
        channel.send(`@everyone today is <@${entry.discordId}>'s birthday!!`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
