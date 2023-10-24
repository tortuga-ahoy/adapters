const p = {
  id: "gog-games",
  name: "GOG Games",
  type: "source",
  version: "0.1.1",
  source: "https://gog-games.to/",
  support: "https://gog-games.to/donate",
  cloudflare: !0,
  search: async (a, { query: o }) => {
    const e = await a.newPage();
    return await e.goto(`https://gog-games.to/search/${o}`, { waitUntil: "load" }), await e.waitForSelector(".container.search"), await e.$$eval(
      ".block",
      (n) => n.reduce((r, t) => (r.push({
        title: t.querySelector(".title").textContent.trim(),
        url: t.href.trim(),
        cover: t.querySelector(".image img").src.replace("_196", "")
      }), r), [])
    );
  },
  fetch: async (a, { url: o }) => {
    const e = await a.newPage();
    await e.goto(o, { waitUntil: "load" });
    const i = await e.waitForSelector("#game-details"), n = await i.$eval("h1", (t) => t.textContent.trim()), r = await i.$$eval(".items-group", (t) => t.reduce((s, c) => {
      const l = c.querySelector(".title");
      if (!l)
        return s;
      if (l.textContent.trim().toLowerCase().includes("game download")) {
        const g = c.querySelectorAll(".item-expand-wrap");
        return [
          ...s,
          ...Array.from(g).map((u) => {
            const m = u.querySelector(".item[title]").getAttribute("title").trim(), w = u.querySelector(".items-group a").href.trim();
            return { name: m, href: w };
          })
        ];
      }
      return s;
    }, []));
    return {
      cover: null,
      title: n,
      version: "",
      description: "",
      info: "",
      downloads: r
    };
  }
};
export {
  p as default
};
