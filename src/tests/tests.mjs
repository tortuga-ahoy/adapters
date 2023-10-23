import { describe, expect, afterAll, test, expectTypeOf } from "vitest";

const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

export const testAdapter = async (adapter, props) => {
  test(`should have a valid semantic version number (${adapter.version})`, () => {
    expect(adapter.version).toMatch(SEMVER_REGEX);
  });

  test(`should have a valid type (${adapter.type})`, () => {
    expect(["source", "metadata", "filehost"]).toContain(adapter.type);
  });

  describe.runIf(adapter.type === "source")("working correctly as a source adapter", async () => {
    test(`should have a valid source (${adapter.source})`, () => {
      expect(adapter.source).toBeTruthy();
    });

    const puppeteer = await import("puppeteer-extra");
    const StealthPlugin = (await import("puppeteer-extra-plugin-stealth")).default;
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: "./.local/chromeUserData",
    });

    let page = (await browser.pages())[0];
    await page.goto(adapter.source, { waitUntil: "load" });
    const challenge = await page.$("iframe[src*='challenges.cloudflare']");
    if (challenge) {
      await page.close();
      page = await browser.newPage();
      page.evaluate(() =>
        alert(
          `Test suite needs manual challenge clearance on this site to run automated tasks.\nPlease solve the challenge, close the browser, and run the test again`
        )
      );
      await page.goto(adapter.source);
      browser.disconnect();
      return;
    }

    describe(`searching games`, () => {
      test(
        `should return a list of valid results`,
        async () => {
          const results = await adapter.search(browser, { query: props.searchQuery });
          expect(results).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ title: expect.any(String), url: expect.any(String) }),
            ])
          );
        },
        { timeout: 10 * 30000 }
      );
      test(
        `should handle searches with no results`,
        async () => {
          const results = await adapter.search(browser, { query: `$0bp94U@l9/R` });
          expect(results).toHaveLength(0);
        },
        { timeout: 10 * 30000 }
      );
    });

    describe(`fetching a single game`, async () => {
      let game = {};
      test(
        `should return a valid object`,
        async () => {
          const result = await adapter.fetch(browser, { url: props.gameUrl });
          expect(result).toBeDefined();
          game = result;
        },
        { timeout: 10 * 30000 }
      );
      test(`should have the title being a valid string`, () => {
        expectTypeOf(game.title).toBeString();
      });
      test(`should have the downloads being a valid list of objects`, () => {
        expect(game.downloads).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: expect.any(String), href: expect.any(String) }),
          ])
        );
      });
      afterAll(() => console.log(game));
    });

    afterAll(async () => {
      await browser.close();
    });
  });
};
