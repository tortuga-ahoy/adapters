const w = {
  id: "gog-games",
  name: "GOG Games",
  type: "source",
  version: "0.1.0",
  source: "https://gog-games.to/",
  support: "https://gog-games.to/donate",
  cloudflare: !0,
  search: async (o, { query: a }) => {
    const t = await o.newPage();
    return await t.goto(`https://gog-games.to/search/${a}`), await t.waitForSelector(".game-blocks"), await t.$$eval(
      ".block",
      (n) => n.reduce((r, e) => (r.push({
        title: e.querySelector(".title").textContent.trim(),
        url: e.href.trim(),
        cover: e.querySelector(".image img").src.replace("_196", "")
      }), r), [])
    );
  },
  fetch: async (o, { url: a }) => {
    const t = await o.newPage();
    await t.goto(a);
    const s = await t.waitForSelector("#game-details"), n = s.$eval("h1", (e) => e.textContent.trim()), r = await s.$$eval(".items-group", (e) => {
      let i = [];
      for (const c of e) {
        const l = c.querySelector(".title");
        if (l && l.textContent.trim().toLowerCase().includes("game download")) {
          const u = c.querySelectorAll(".item-expand-wrap");
          i = [
            ...i,
            ...Array.from(u).map((g) => {
              const m = g.querySelector(".item[title]").getAttribute("title").trim(), p = g.querySelector(".items-group a").href.trim();
              return { name: m, href: p };
            })
          ];
        }
      }
      return i;
    });
    return {
      cover: null,
      title: n,
      subtitle: "",
      description: "",
      info: "",
      downloads: r
    };
  }
};
export {
  w as default
};
