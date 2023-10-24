export default {
  id: "fitgirl-repacks",
  name: "FitGirl Repacks",
  type: "source",
  version: "0.1.3",
  source: "https://fitgirl-repacks.site/",
  support: "https://fitgirl-repacks.site/donations/",

  search: async (browser, { query }) => {
    const page = await browser.newPage();
    await page.goto(`https://fitgirl-repacks.site/?s=${query}`, { waitUntil: "load" });
    await page.waitForSelector("#content");

    const results = await page.$$eval(".entry-header", (entries) =>
      entries.reduce((entries, entry) => {
        const category = entry.querySelector(".entry-meta .cat-links").textContent;
        if (category.toLowerCase().includes("repack")) {
          entries.push({
            title: entry.querySelector("h1").textContent.split("–")[0].trim(),
            url: entry.querySelector("h1 a").href.trim(),
          });
        }
        return entries;
      }, [])
    );
    return results;
  },

  fetch: async (browser, { url }) => {
    const gamePage = await browser.newPage();
    await gamePage.goto(url, { waitUntil: "load" });
    const content = await gamePage.waitForSelector(".entry-content");

    const cover = await content.$$eval(`img`, (images) => images[0].src);

    const { title, version } = await content.$eval(`h3`, (heading) => {
      const title = heading.querySelector("strong");
      const spans = heading.querySelectorAll("span");
      const subtitle = spans.length > 1 ? spans[spans.length - 1] : title.querySelector("span");
      const version = subtitle?.textContent.trim() || "";
      return {
        title: title.textContent.replace(version, "").trim(),
        version,
      };
    });

    const description = await content.$eval(
      `.su-spoiler-content`,
      (description) => description?.outerHTML || ""
    );

    const [info, downloads] = await content.$$eval(`ul`, (lists) => {
      const exceptions = ["JDownloader2"];

      const downloads = Array.from(lists[0].querySelectorAll(`li`)).reduce((downloads, element) => {
        element.querySelectorAll("a").forEach((link, index, array) => {
          if (!exceptions.some((e) => e.localeCompare(link.textContent.trim()))) {
            return downloads;
          }
          downloads.push({
            name:
              index === 0
                ? link.textContent.trim()
                : `${array[0].textContent.trim()} (${link.textContent.trim()})`,
            href: link.href,
          });
        });
        return downloads;
      }, []);
      const info = lists[1]?.outerHTML || "";
      return [info, downloads];
    });

    const data = {
      cover,
      title,
      version,
      description,
      info,
      downloads,
    };

    return data;
  },
};
