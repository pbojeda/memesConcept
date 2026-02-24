import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:3001", // NextJS usually runs on port 3000, but terminal says it's 3001 right now. Adjust to 3000 or 3001 as needed
        supportFile: false,
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
