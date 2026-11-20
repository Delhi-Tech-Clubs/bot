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

let current = -1n;
let lastUser = null;

let initialized = false;
let queue = Promise.resolve();

function hasBotReaction(message, emojiId) {
  return message.reactions.cache.some(
    (r) => r.emoji.id === emojiId && r.me
  );
}


async function init(message) {
  let before = message.id;


  for (let page = 0; page < 5; page++) {
    const messages = await message.channel.messages.fetch({
      limit: 100,
      before,
    });

    if (messages.size === 0) break;

    const sorted = [...messages.values()].sort(
      (a, b) => b.createdTimestamp - a.createdTimestamp
    );

    for (const prev of sorted) {
      const text = prev.content.trim();

      if (!/^\d+$/.test(text)) continue;

      if (hasBotReaction(prev, OK_EMOJI_ID)) {
        current = BigInt(text);
        lastUser = prev.author.id;
        initialized = true;
        return;
      }


      if (hasBotReaction(prev, BAD_EMOJI_ID)) {
        current = -1n;
        lastUser = null;
        initialized = true;
        return;
      }
    }

    before = sorted[sorted.length - 1].id;

    if (messages.size < 100) break;
  }

  current = -1n;
  lastUser = null;
  initialized = true;
}


async function processCount(message) {
  if (message.author.bot || message.channel.id !== channel_id) return;

  const text = message.content.trim();


  if (!/^\d+$/.test(text)) {
    await message.delete().catch(console.error);
    return;
  }


  if (!initialized) {
    await init(message);
  }

  const num = BigInt(text);
  const sameUser = message.author.id === lastUser;

  if (num === current + 1n && !sameUser) {
    try {
      await message.react(OK_EMOJI_ID);

      current = num;
      lastUser = message.author.id;
    } catch (error) {
      console.error("Failed to add OK reaction:", error);
    }

    return;
  }

  const broke = current >= 0n ? current.toString() : "0";

  current = -1n;
  lastUser = null;

  await message.react(BAD_EMOJI_ID).catch((error) => {
    console.error("Failed to add BAD reaction:", error);
  });

  await message.channel.send(
    `${message.author} MF broke it at **${broke}**${
      sameUser
        ? " (, you can't count twice in a row dumbass)"
        : ""
    }. Start again from **0**.`
  ).catch(console.error);
}

export async function count(message) {
  queue = queue
    .then(() => processCount(message))
    .catch((error) => {
      console.error("Counting system error:", error);
    });

  return queue;
}

