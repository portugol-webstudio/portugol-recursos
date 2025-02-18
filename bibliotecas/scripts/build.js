import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import yaml from "yaml";
import { createTypeAlias, printNode, zodToTs } from "zod-to-ts";
import { schema } from "./schema.js";

const baseDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const allFiles = await fs.readdir(baseDir);
const libFiles = allFiles.filter(file => file.startsWith("bibliotecas.") && file.endsWith(".yml"));

/**
 * @type {import('zod').z.infer<typeof schema>}
 */
let mergedLibs = {
  $schema: "./bibliotecas.schema.json",
  bibliotecas: [],
};

for (const libFile of libFiles) {
  const fileData = await fs.readFile(path.join(baseDir, libFile), "utf8");
  const libData = schema.parse(yaml.parse(fileData));

  mergedLibs.bibliotecas.push(...libData.bibliotecas);
}

for (const lib of mergedLibs.bibliotecas) {
  lib.constantes.sort((a, b) => a.nome.localeCompare(b.nome));
  lib.funções.sort((a, b) => a.nome.localeCompare(b.nome));
}

await fs.writeFile(
  path.join(baseDir, "bibliotecas.yml"),
  "# yaml-language-server: $schema=./bibliotecas.schema.json\n" + yaml.stringify(mergedLibs),
);

await fs.writeFile(path.join(baseDir, "bibliotecas.json"), JSON.stringify(mergedLibs, undefined, 2) + "\n");

const identifier = "Schema";
const { node } = zodToTs(schema, identifier);
const typeAlias = createTypeAlias(node, identifier);
const nodeString = printNode(typeAlias);

await fs.writeFile(
  path.join(baseDir, "index.d.ts"),
  nodeString + `\n\nexport const bibliotecas: Schema["bibliotecas"];\n`,
);
