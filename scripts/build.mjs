import { readdir, writeFile } from "fs/promises";
import { basename, extname, join, resolve } from "path";
import { build } from "vite";

const ROOT_PATH = join(process.cwd(), "src");
const BUILD_PATH = join(process.cwd(), "dist");

const readdirRecursive = async (dir) => {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);
      return dirent.isDirectory() ? readdirRecursive(res) : res;
    })
  );
  return Array.prototype.concat(...files);
};

const isValidAdapter = (file) => {
  const filename = basename(file);
  const extension = extname(file).toLowerCase();
  return (
    !filename.startsWith(".") &&
    !filename.includes("test.") &&
    !filename.includes("tests.") &&
    [(".js", ".mjs")].some((ext) => extension === ext)
  );
};

const getAdapters = async () => {
  const adapters = [];
  const files = (await readdirRecursive(ROOT_PATH)).filter(isValidAdapter);
  for (const file of files) {
    try {
      const module = await import(`file://${file}`);
      const adapter = module.default;
      if (adapter.draft) {
        continue;
      }
      adapters.push({ ...adapter, file });
    } catch (error) {
      console.error(file, error);
    }
  }
  return adapters;
};

const adapters = await getAdapters();

await build({
  build: {
    lib: {
      entry: adapters.map((adapter) => adapter.file),
      fileName: (_, entryName) => `${entryName}.mjs`,
      formats: ["es"],
    },
  },
});

const data = adapters.map(({ id, name, type, version, source, file }) => ({
  id,
  name,
  type,
  version,
  source,
  module: `${basename(file, extname(file))}.mjs`,
}));

await writeFile(join(BUILD_PATH, "index.json"), JSON.stringify(data, null, 2));

process.exit();
