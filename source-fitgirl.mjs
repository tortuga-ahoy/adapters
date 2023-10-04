export default {
  id: "fitgirl-repacks",
  name: "FitGirl Repacks",
  type: "source",
  version: "0.1.0",
  match: /^((http|https):\/\/)?fitgirl-repacks\.site/,
  source: "https://fitgirl-repacks.site/",
  support: "https://fitgirl-repacks.site/donations/",
  icon: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQAE/8QAJhAAAgEDAwEJAAAAAAAAAAAAAQIDBAURACExEhMUIjNhYnGBwf/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGREAAgMBAAAAAAAAAAAAAAAAERIAAQJR/9oADAMBAAIRAxEAPwAa8WUrdqmQ+WzB/D7sn8OtdiskPfYJBJMGVurG22N9SVtVc3WWRVQ8YUYBxx88nStqqEpq0UzITIwJ7TPpnj60DHYMoS1vs//Z",
  search: async (browser, { query }) => {
    const page = await browser.newPage();
    await page.goto(`https://fitgirl-repacks.site/?s=${query}`);
    await page.waitForSelector("#content");

    const results = await page.$$eval(".entry-header", (entries) =>
      entries.map((entry) => ({
        title: entry.querySelector("h1").textContent.split("–")[0].trim(),
        url: entry.querySelector("h1 a").href.trim(),
      }))
    );
    return results;
  },
  fetch: async (browser, { url }) => {
    const gamePage = await browser.newPage();
    await gamePage.goto(url);
    const content = await gamePage.waitForSelector(".entry-content");

    const data = {
      cover: await content.$$eval(`img`, (images) => images[0].src),
      title: await content.$eval(`h3 strong`, (title) => title.textContent.trim()),
      description: await content.$eval(`.su-spoiler-content`, (description) =>
        description.textContent.trim()
      ),
      info: await content.$$eval(`ul`, (lists) =>
        lists.lenght > 1 ? `<ul>${lists[1].innerHtml}</ul>` : ""
      ),
      downloads: await gamePage.$eval(`ul a[href^="magnet:"]`, (link) => link.href.trim()),
    };

    return data;
  },
};
