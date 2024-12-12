import path from 'node:path';
const { test : baseTest } = require('@playwright/test');

// Path to the Chrome user data directory
const userDataDir = path.resolve('C:\\Users\\1361953\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 2');

// Extend the base test
const test = baseTest.extend({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      userDataDir, // Set user data directory
    });
    await use(context);
    await context.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
  },
});

module.exports = { test };
