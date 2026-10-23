// const channel_id = "1540568102490742875";

// export async function count(message) {
//   if (message.author.bot || message.channel.id !== channel_id) return;

//   const num = Number(message.content.trim());

//   const prev = (
//     await message.channel.messages.fetch({ limit: 1, before: message.id })
//   ).first();

//   const expected = prev ? Number(prev.content.trim()) + 1 : 1;
//   //testing..
//   console.log(`Count expected: ${expected}`);

//   if (num === expected) {
//     message.react("dtcc:1542895871610462248");
//   } else {
//     message.delete();
//   }
// }



const channel_id = "1540568102490742875";
const OK_EMOJI_ID = "1542895871610462248";
const BAD_EMOJI_ID = "1560344031777783908";

let current = -1;
let lastUser = null;
let ready = null;

async function init(message) {
  const prev = (
    await message.channel.messages.fetch({
      limit: 1,
      before: message.id,
    })
  ).first();

  const wasValid =
    prev &&
    /^\d+$/.test(prev.content.trim()) &&
    prev.reactions.cache.some(
      (r) => r.emoji.id === OK_EMOJI_ID && r.me
    );

  if (wasValid) {
    current = Number(prev.content.trim());
    lastUser = prev.author.id;
  }
}

export async function count(message) {
  if (message.author.bot || message.channel.id !== channel_id) return;

  const text = message.content.trim();
  if (!/^\d+$/.test(text)) {
    await message.delete().catch(() => {});
    return;
  }

  ready ??= init(message);
  await ready;

  const num = Number(text);
  const sameUser = message.author.id === lastUser;

  if (num === current + 1 && !sameUser) {
    current = num;
    lastUser = message.author.id;
    await message.react(`dtcc:${OK_EMOJI_ID}`).catch(() => {});
  } else {
    const broke = current;
    current = -1;
    lastUser = null;

    await message.react(`dtcc:${BAD_EMOJI_ID}`).catch(() => {});

    await message.channel
      .send(
        `${message.author} MF broke it at **${Math.max(broke, 0)}**${
          sameUser
            ? " (, you can't count twice in a row dumbass)"
            : ""
        }. Start again from **0**.`
      )
      .catch(() => {});
  }
}
