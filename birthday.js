import { createEntry, updateEntry } from "./notion.js";

const prefix = "!tune ";

export async function tune(message) {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  const bdate = message.content.slice(prefix.length).trim();
  const discordId = message.author.id;

  try {
    const updated = await updateEntry(discordId, bdate);
    if (!updated) await createEntry(discordId, bdate);
    await message.react("dtc:1542082724121022537");
  } catch (error) {
    console.error(error);
  }
}
