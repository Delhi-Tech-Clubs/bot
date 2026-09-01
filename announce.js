import { getEntries } from "./notion.js";

export async function announce(dtc) {
  const entries = await getEntries();
  const todayDay = new Date().getDate();
  const todayMonth = new Date().getMonth() + 1; // +1 as months are 0-indexed
  const channel = await dtc.channels.fetch(process.env.ANNOUNCE_CHANNEL_ID);
  //1542513148861489282
  //converting channel id to smt which discord.js can use

  for (const entry of entries) {
    const parts = entry.bdate.split("/");
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    // Number() strips leading zeros so 06 === 6

    if (day === todayDay && month === todayMonth) {
      await channel.send(`@everyone today is <@${entry.discordId}>'s birthday!!`);
    }
  }
}
