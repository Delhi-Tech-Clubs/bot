import { ChannelType, PermissionFlagsBits as P } from "discord.js";

const prefix = "dtc +club ";
const category = "1539259832899473472";
const emoji_id = "1542895871610462248";
const emoji_name = "dtcc";

const title = (s) =>
  s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

export async function club(message) {
  if (message.author.bot || !message.guild) return;
  if (!message.content.toLowerCase().startsWith(prefix)) return;
  if (!message.member.permissions.has(P.Administrator)) return;

  const name = message.content.slice(prefix.length).trim();
  if (!name) return;

  try {
    const guild = message.guild;

    const role = await guild.roles.create({
      name: name.toLowerCase(),
      color: 0xffffff,
    });

    await guild.channels.create({
      name: name.toLowerCase(),
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: [
        { id: guild.roles.everyone.id, deny: [P.ViewChannel] },
        { id: role.id, allow: [P.ViewChannel] },
      ],
    });

    const path = `/guilds/${guild.id}/onboarding`;
    const ob = await message.client.rest.get(path);

    const prompts = ob.prompts.map((p) => ({
      id: p.id,
      type: p.type,
      title: p.title,
      single_select: p.single_select,
      required: p.required,
      in_onboarding: p.in_onboarding,
      options: p.options.map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        role_ids: o.role_ids,
        channel_ids: o.channel_ids,
        emoji_id: o.emoji?.id,
        emoji_name: o.emoji?.name,
        emoji_animated: o.emoji?.animated,
      })),
    }));

    const q = prompts.find((p) => p.title.includes("clubs")) ?? prompts[1];

    q.options.push({
      title: title(name),
      role_ids: [role.id],
      channel_ids: [],
      emoji_id,
      emoji_name,
      emoji_animated: false,
    });

    await message.client.rest.put(path, {
      body: {
        prompts,
        default_channel_ids: ob.default_channel_ids,
        enabled: ob.enabled,
        mode: ob.mode,
      },
    });

    message.react(`${emoji_name}:${emoji_id}`).catch(() => {});
  } catch (err) {
    console.error(err);
  }
}
