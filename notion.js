import "dotenv/config";
import { Client } from "@notionhq/client";

//https://mud-icicle-618.notion.site/3c9321b7ba0480abb79dd71e35c2841a?v=3c9321b7ba0480d0a7cb000caecdd852&source=copy_link

const notion = new Client({
  auth: process.env.NOTION_API,
});

/*
(async () => {
  const result = await notion.databases.retrieve({ database_id: "3c9321b7ba0480abb79dd71e35c2841a" });
  console.log(result.data_sources);
})();
*/

async function createEntry(discordId, bdate) {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: process.env.NOTION_DATA_SOURCE_ID,
    },
    properties: {
      discordid: { title: [{ text: { content: discordId } }] },
      bdate: { rich_text: [{ text: { content: bdate } }] },
    },
  });
}

async function getEntries() {
  const result = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATA_SOURCE_ID,
  });

  return result.results.map((entry) => ({
    discordId: entry.properties.discordid.title[0].plain_text,
    bdate: entry.properties.bdate.rich_text[0].plain_text,
  }));
}

async function updateEntry(discordId, bdate) {
  const result = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATA_SOURCE_ID,
    filter: { property: "discordid", title: { equals: discordId } },
  });

  if (result.results.length === 0) return false;

  await notion.pages.update({
    page_id: result.results[0].id,
    properties: {
      bdate: { rich_text: [{ text: { content: bdate } }] },
    },
  });

  return true;
}

export { createEntry, getEntries, updateEntry };
