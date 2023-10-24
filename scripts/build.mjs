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

const isValidExtension = (file) => {
  const filename = basename(file);
  const extension = extname(file).toLowerCase();
  return (
    !filename.startsWith(".") &&
    !filename.includes("test.") &&
    !filename.includes("tests.") &&
    [(".js", ".mjs")].some((ext) => extension === ext)
  );
};

const getExtensions = async () => {
  const extensions = [];
  const files = (await readdirRecursive(ROOT_PATH)).filter(isValidExtension);
  for (const file of files) {
    try {
      const module = await import(`file://${file}`);
      const extension = module.default;
      if (extension.draft) {
        continue;
      }
      extensions.push({ ...extension, file });
    } catch (error) {
      console.error(file, error);
    }
  }
  return extensions;
};

const extensions = await getExtensions();

await build({
  build: {
    lib: {
      entry: extensions.map((extension) => extension.file),
      fileName: (_, entryName) => `${entryName}.mjs`,
      formats: ["es"],
    },
  },
});

const data = extensions.map(({ id, name, type, version, source, file }) => ({
  id,
  name,
  type,
  version,
  source,
  module: `${basename(file, extname(file))}.mjs`,
}));

await writeFile(join(BUILD_PATH, "index.json"), JSON.stringify(data, null, 2));

process.exit();
