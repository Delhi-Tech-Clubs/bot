const CHANNEL_ID = "1539258785724366961";
const BOARDS_DATE = new Date("2027-02-16T00:00:00+05:30");

export async function boardsCountdown(client) {
  const daysLeft = Math.ceil((BOARDS_DATE - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return;

  const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
  if (channel) await channel.send(`${daysLeft} days left for boards`).catch(console.error);
}
