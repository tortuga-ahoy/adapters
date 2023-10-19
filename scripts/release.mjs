import { join, relative, resolve } from "path";
import { readdir, writeFile } from "fs/promises";

const ROOT_PATH = process.cwd();

const buildAdaptersMap = async () => {
  const adapters = [];
  const files = await readdir(ROOT_PATH, { withFileTypes: true });
  for (const file of files) {
    try {
      const filepath = join(ROOT_PATH, file.name);
      const { id, name, type, version, source, draft } = (await import(`file://${filepath}`))
        .default;
      if (file.name.startsWith(".") || draft) {
        continue;
      }
      adapters.push({
        id,
        name,
        type,
        version,
        source,
        module: relative(ROOT_PATH, filepath),
      });
    } catch (error) {}
  }
  return adapters;
};

buildAdaptersMap().then(async (adapters) => {
  await writeFile(join(ROOT_PATH, "index.json"), JSON.stringify(adapters, null, 2));
  process.exit();
});
