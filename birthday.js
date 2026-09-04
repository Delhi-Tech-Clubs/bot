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
    message.react("dtcc:1542895871610462248");
  } catch (err) {
    console.error(err);
  }
}
