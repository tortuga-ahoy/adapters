export default {
  id: "gog-games",
  name: "GOG Games",
  type: "source",
  version: "0.1.0",
  source: "https://gog-games.to/",
  support: "https://gog-games.to/donate",

  cloudflare: true,

  search: async (browser, { query }) => {
    const page = await browser.newPage();
    await page.goto(`https://gog-games.to/search/${query}`);
    await page.waitForSelector(".game-blocks");

    const results = await page.$$eval(".block", (blocks) =>
      blocks.reduce((results, block) => {
        results.push({
          title: block.querySelector(".title").textContent.trim(),
          url: block.href.trim(),
          cover: block.querySelector(".image img").src.replace("_196", ""),
        });
        return results;
      }, [])
    );
    return results;
  },

  fetch: async (browser, { url }) => {
    const gamePage = await browser.newPage();
    await gamePage.goto(url);

    const content = await gamePage.waitForSelector("#game-details");

    const title = content.$eval("h1", (title) => title.textContent.trim());

    const downloads = await content.$$eval(`.items-group`, (elements) => {
      let results = [];
      for (const element of elements) {
        const category = element.querySelector(".title");
        if (!category) continue;
        if (category.textContent.trim().toLowerCase().includes("game download")) {
          const items = element.querySelectorAll(".item-expand-wrap");
          results = [
            ...results,
            ...Array.from(items).map((item) => {
              const name = item.querySelector(".item[title]").getAttribute("title").trim();
              const href = item.querySelector(".items-group a").href.trim();
              return { name, href };
            }),
          ];
        }
      }
      return results;
    });

    return {
      cover: null,
      title,
      subtitle: "",
      description: "",
      info: "",
      downloads,
    };
  },
};
