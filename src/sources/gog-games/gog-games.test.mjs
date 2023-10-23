import adapter from "./gog-games.mjs";
import { testAdapter } from "@/tests/tests.mjs";

await testAdapter(adapter, {
  searchQuery: "fallout",
  gameUrl: "https://gog-games.to/game/fallout_classic",
});
