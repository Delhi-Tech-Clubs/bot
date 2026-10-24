export async function git(message) {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith("dtc git ")) return;

  const username = message.content.slice(8).trim();
  if (!username) return;

  try {
    const res = await fetch(
      `https://api.github.com/orgs/Delhi-Tech-Clubs/memberships/${username}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "member" }),
      }
    );
    if (res.ok) await message.react("dtcc:1542895871610462248");
  } catch {}
}
