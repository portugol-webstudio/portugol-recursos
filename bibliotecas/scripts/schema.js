import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const tipo = z.object({
  primitivo: z.enum(["cadeia", "caracter", "inteiro", "logico", "real", "vazio", "*"]).describe("Tipo primitivo"),
  dimensão: z.enum(["vetor", "matriz"]).optional().describe("Dimensão do tipo, vazio caso escalar"),
});

export const schema = z.object({
  $schema: z.string().optional(),
  bibliotecas: z.array(
    z.object({
      nome: z.string().describe("Nome da biblioteca (ex: Texto)"),
      descrição: z.string().describe("Descrição da biblioteca"),
      metadados: z.record(z.string(), z.string()).optional().describe("Metadados da biblioteca"),

      constantes: z.array(
        z.object({
          nome: z.string().describe("Nome da constante"),
          valor: z.any().describe("Valor da constante"),
          descrição: z.string().describe("Descrição da constante, suporta valor em markdown"),
          tipo: tipo.describe("Tipo da constante"),
          referência: z.string().optional().describe("Referência da função"),
        }),
      ),

      funções: z.array(
        z.object({
          nome: z.string().describe("Nome da função"),
          descrição: z.string().describe("Descrição da função, suporta valor em markdown"),
          retorno: z.object({
            tipo: tipo.describe("Tipo de retorno da função"),
            descrição: z.string().optional().describe("Descrição do retorno da função, suporta valor em markdown"),
          }),
          parâmetros: z.array(
            z.object({
              nome: z.string().describe("Nome do parâmetro"),
              tipo: tipo.describe("Tipo do parâmetro"),
              descrição: z.string().describe("Descrição do parâmetro, suporta valor em markdown"),
            }),
          ),
          referência: z.string().optional().describe("Referência da função"),
        }),
      ),
    }),
  ),
});

const jsonSchema = zodToJsonSchema(schema, "bibliotecasSchema");
const baseDir = path.join(path.dirname(url.fileURLToPath(import.meta.url)), "..");

await fs.writeFile(path.join(baseDir, "bibliotecas.schema.json"), JSON.stringify(jsonSchema, undefined, 2));
