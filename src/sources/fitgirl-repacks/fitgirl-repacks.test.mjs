import extension from "./fitgirl-repacks.mjs";
import { testExtension } from "@/tests/tests.mjs";

await testExtension(extension, {
  searchQuery: "fallout",
  gameUrl: "https://fitgirl-repacks.site/fallout-4/",
});
