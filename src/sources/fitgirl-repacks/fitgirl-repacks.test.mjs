import adapter from "./fitgirl-repacks.mjs";
import { testAdapter } from "@/tests/tests.mjs";

await testAdapter(adapter, {
  searchQuery: "fallout",
  gameUrl: "https://fitgirl-repacks.site/fallout-4/",
});
