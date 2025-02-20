import { generateSchemaTypes } from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  howtocook: {
    from: {
      source: "url",
      url: "https://localhost:7010/swagger/v1/swagger.json",
    },
    outputDir: "src/generated",
    to: async (context) => {
      await generateSchemaTypes(context, {
        filenamePrefix: "howtocook",
      });
    },
  },
});
