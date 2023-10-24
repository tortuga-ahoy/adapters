import extension from "./gog-games.mjs";
import { testExtension } from "@/tests/tests.mjs";

await testExtension(extension, {
  searchQuery: "fallout",
  gameUrl: "https://gog-games.to/game/fallout_classic",
});
