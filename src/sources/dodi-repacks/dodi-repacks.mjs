const cleanTitle = (str) => {
  return str
    .split("-")
    .slice(1)
    .replace(/\[(.*?)\]/g, "")
    .replace(/\((.*?)\)/g, "")
    .trim();
};

export default {
  id: "dodi-repacks",
  name: "DODI Repacks",
  type: "source",
  version: "0.0.1",
  draft: true,
  source: "https://dodi-repacks.site/",
  support: "https://dodi-repacks.site/donate/",

  cloudflare: true,

  search: async (browser, { query }) => {
    const page = await browser.newPage();
    await page.goto(`https://dodi-repacks.site/?s=${query}`);
    await page.waitForSelector("#content");

    const results = await page.$$eval(".entry-header", (entries) =>
      entries.reduce((entries, entry) => {
        entries.push({
          title: cleanTitle(entry.querySelector(".entry-title").textContent),
          url: entry.querySelector(".entry-title a").href.trim(),
        });
        return entries;
      }, [])
    );
    return results;
  },

  fetch: async (browser, { url }) => {
    const gamePage = await browser.newPage();
    await gamePage.goto(url);

    const header = await gamePage.waitForSelector(".entry-header");
    const content = await gamePage.waitForSelector(".entry-content");

    const cover = await content.$$eval(`img`, (images) => images[0].src);
    const title = await header.$eval(`.entry-title`, (title) => cleanTitle(title));

    const downloads = await content.$$eval(`strong`, (elements) => {
      for (const element of elements) {
        if (element.textContent?.trim().toLowerCase().startsWith("torrent")) {
          return Array.from(element.querySelectorAll(`a`)).map((link) => ({
            name: "Torrent",
            href: link.href,
          }));
        }
      }
    });

    return {
      cover,
      title,
      subtitle: "",
      description: "",
      info: "",
      downloads,
    };
  },
};
