const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "3hvytt",
  reporter: 'cypress-mochawesome-reporter',
    e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);

    },
  },
});
