const channel_id = "1540568102490742875";
let c;

export async function init(client) {
  try {
    const channel = await client.channels.fetch(channel_id);
    const last = (await channel.messages.fetch({ limit: 1 })).first();
    c = last ? Number(last.content.trim()) + 1 : 1;
    //testing..
    console.log(`Count initialized: ${c}`);
  } catch (err) {
    console.error(err);
  }
}

export async function count(message) {
  if (message.author.bot || message.channel.id !== channel_id) return;

  const num = Number(message.content.trim());

  if (num === c) {
    message.react("dtcc:1542895871610462248").catch(console.error);
    c++;
  } else if (!isNaN(num)) {
    message.delete().catch(console.error);
  }
}
