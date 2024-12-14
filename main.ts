import { main } from "./src/index.ts";

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main({
    mongoUri: Deno.env.get("MONGO_URI") || "",
    port: Number(Deno.env.get("PORT") || 8000),
  });
}
