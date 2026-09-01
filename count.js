const channel_id = '1540568102490742875';
let c;

export async function init(client) {
  const channel = await client.channels.fetch(channel_id);
  const last = (await channel.messages.fetch({ limit: 1 })).first();
  c = last ? Number(last.content.trim()) + 1 : 1;
  //testing..
  console.log(`Count initialized: ${c}`);
}


export async function count(message) {
  if (message.author.bot || message.channel.id !== channel_id) return;

  const num = Number(message.content.trim());

  if (num === c) {
    await message.react("dtcc:1542895871610462248");
    c++;
  } else if (!isNaN(num)) {
    await message.delete();
  }
}
