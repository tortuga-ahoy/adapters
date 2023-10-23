const q = {
  id: "fitgirl-repacks",
  name: "FitGirl Repacks",
  type: "source",
  version: "0.1.2",
  source: "https://fitgirl-repacks.site/",
  support: "https://fitgirl-repacks.site/donations/",
  search: async (l, { query: u }) => {
    const e = await l.newPage();
    return await e.goto(`https://fitgirl-repacks.site/?s=${u}`), await e.waitForSelector("#content"), await e.$$eval(
      ".entry-header",
      (p) => p.reduce((s, a) => (a.querySelector(".entry-meta .cat-links").textContent.toLowerCase().includes("repack") && s.push({
        title: a.querySelector("h1").textContent.split("–")[0].trim(),
        url: a.querySelector("h1 a").href.trim()
      }), s), [])
    );
  },
  fetch: async (l, { url: u }) => {
    const e = await l.newPage();
    await e.goto(u);
    const r = await e.waitForSelector(".entry-content"), p = await r.$$eval("img", (t) => t[0].src), { title: s, subtitle: a } = await r.$eval("h3", (t) => {
      const c = t.querySelector("strong"), o = t.querySelectorAll("span"), n = o.length > 1 ? o[o.length - 1] : c.querySelector("span");
      return {
        title: c.textContent.replace(n, "").trim(),
        subtitle: (n == null ? void 0 : n.textContent.trim()) || ""
      };
    }), g = await r.$eval(
      ".su-spoiler-content",
      (t) => (t == null ? void 0 : t.outerHTML) || ""
    ), [h, m] = await r.$$eval("ul", (t) => {
      var w;
      const c = ["JDownloader2"], o = Array.from(t[0].querySelectorAll("li")).reduce((f, y) => (y.querySelectorAll("a").forEach((i, $, x) => {
        if (!c.some((C) => C.localeCompare(i.textContent.trim())))
          return f;
        f.push({
          name: $ === 0 ? i.textContent.trim() : `${x[0].textContent.trim()} (${i.textContent.trim()})`,
          href: i.href
        });
      }), f), []);
      return [((w = t[1]) == null ? void 0 : w.outerHTML) || "", o];
    });
    return {
      cover: p,
      title: s,
      subtitle: a,
      description: g,
      info: h,
      downloads: m
    };
  }
};
export {
  q as default
};
