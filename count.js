const channel_id = "1540568102490742875";

export async function count(message) {
  if (message.author.bot || message.channel.id !== channel_id) return;

  const num = Number(message.content.trim());

  const prev = (
    await message.channel.messages.fetch({ limit: 1, before: message.id })
  ).first();

  const expected = prev ? Number(prev.content.trim()) + 1 : 1;
  //testing..
  console.log(`Count expected: ${expected}`);

  if (num === expected) {
    message.react("dtcc:1542895871610462248");
  } else {
    message.delete();
  }
}
