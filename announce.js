import { getEntries } from "./notion.js";

const BIRTHDAY_ROLE = "1566381788689993858";

export async function announce(dtc) {
  try {
    const entries = await getEntries();
    const today = new Date();
    const channel = await dtc.channels.fetch(process.env.ANNOUNCE_CHANNEL_ID);

    for (const entry of entries) {
      const [day, month] = entry.bdate.split("/").map(Number);

      if (day === today.getDate() && month === today.getMonth() + 1) {
        channel.send(`@here today is <@${entry.discordId}>'s birthday!!`);

        const guild = channel.guild;
        const member = await guild.members.fetch(entry.discordId).catch(() => null);
        if (member) await member.roles.add(BIRTHDAY_ROLE).catch(() => {});
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export async function removeBirthdayRoles(dtc) {
  try {
    const guild = await dtc.guilds.fetch(process.env.GUILD_ID);
    const role = guild.roles.cache.get(BIRTHDAY_ROLE);
    if (!role) return;

    for (const [, member] of role.members) {
      await member.roles.remove(BIRTHDAY_ROLE).catch(() => {});
    }
  } catch (err) {
    console.error(err);
  }
}
