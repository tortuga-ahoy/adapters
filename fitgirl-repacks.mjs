const v = {
  id: "fitgirl-repacks",
  name: "FitGirl Repacks",
  type: "source",
  version: "0.1.3",
  source: "https://fitgirl-repacks.site/",
  support: "https://fitgirl-repacks.site/donations/",
  search: async (u, { query: p }) => {
    const e = await u.newPage();
    return await e.goto(`https://fitgirl-repacks.site/?s=${p}`, { waitUntil: "load" }), await e.waitForSelector("#content"), await e.$$eval(
      ".entry-header",
      (w) => w.reduce((s, o) => (o.querySelector(".entry-meta .cat-links").textContent.toLowerCase().includes("repack") && s.push({
        title: o.querySelector("h1").textContent.split("–")[0].trim(),
        url: o.querySelector("h1 a").href.trim()
      }), s), [])
    );
  },
  fetch: async (u, { url: p }) => {
    const e = await u.newPage();
    await e.goto(p, { waitUntil: "load" });
    const r = await e.waitForSelector(".entry-content"), w = await r.$$eval("img", (t) => t[0].src), { title: s, version: o } = await r.$eval("h3", (t) => {
      const c = t.querySelector("strong"), a = t.querySelectorAll("span"), i = a.length > 1 ? a[a.length - 1] : c.querySelector("span"), n = (i == null ? void 0 : i.textContent.trim()) || "";
      return {
        title: c.textContent.replace(n, "").trim(),
        version: n
      };
    }), g = await r.$eval(
      ".su-spoiler-content",
      (t) => (t == null ? void 0 : t.outerHTML) || ""
    ), [h, m] = await r.$$eval("ul", (t) => {
      var n;
      const c = ["JDownloader2"], a = Array.from(t[0].querySelectorAll("li")).reduce((f, y) => (y.querySelectorAll("a").forEach((l, $, x) => {
        if (!c.some((C) => C.localeCompare(l.textContent.trim())))
          return f;
        f.push({
          name: $ === 0 ? l.textContent.trim() : `${x[0].textContent.trim()} (${l.textContent.trim()})`,
          href: l.href
        });
      }), f), []);
      return [((n = t[1]) == null ? void 0 : n.outerHTML) || "", a];
    });
    return {
      cover: w,
      title: s,
      version: o,
      description: g,
      info: h,
      downloads: m
    };
  }
};
export {
  v as default
};
