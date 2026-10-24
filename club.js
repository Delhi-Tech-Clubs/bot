import { PermissionFlagsBits } from "discord.js";

const HQ = "1539307092366725190";

export async function club(message) {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith("dtc +club ")) return;
  if (!message.member.roles.cache.has(HQ)) return;

  const name = message.content.slice(10).trim().toLowerCase();
  if (!name) return;

  try {
    const { guild } = message;

    const role = await guild.roles.create({ name, color: 0xffffff });

    await guild.channels.create({
      name,
      parent: "1539259832899473472",
      permissionOverwrites: [
        { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: role.id, allow: [PermissionFlagsBits.ViewChannel] },
      ],
    });

    const ob = await message.client.rest.get(`/guilds/${guild.id}/onboarding`);
    const prompt = ob.prompts[1] ?? ob.prompts[0];

    for (const o of ob.prompts.flatMap(p => p.options)) {
      if (o.emoji) { o.emoji_id = o.emoji.id; o.emoji_name = o.emoji.name; }
    }

    prompt.options.push({
      title: name.replace(/\w+/g, w => w[0].toUpperCase() + w.slice(1)),
      role_ids: [role.id],
      channel_ids: [],
      emoji_id: "1542895871610462248",
      emoji_name: "dtcc",
      emoji_animated: false,
      description: null,
    });

    await message.client.rest.put(`/guilds/${guild.id}/onboarding`, {
      body: {
        prompts: ob.prompts,
        default_channel_ids: ob.default_channel_ids,
        enabled: ob.enabled,
        mode: ob.mode,
      },
    });

    await message.react("dtcc:1542895871610462248");
  } catch {}
}
