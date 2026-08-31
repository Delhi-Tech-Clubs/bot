const channel_id = '1540568102490742875';
let c = 1;

export async function count(message) {
  if (message.author.bot || message.channel.id !== channel_id) return;

  const num = Number(message.content.trim());

  if (num === c) {
    await message.react("dtcc:1542895871610462248");
    c++;
  }
  else {
    c = 1;
  }
}
