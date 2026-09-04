const welcome_channel_id = "1538407621550149696";

export async function onboard(member) {
  const channel = await member.guild.channels.fetch(welcome_channel_id);

  const msg = await channel.send(
    `Welcome to DTC <@${member.id}>!\n` +
    `- Tune your birthday in <#1542513130805010562>\n` +
    `- Check out count in <#1540568102490742875>`
  );
  msg.react("dtcc:1542895871610462248");
}
