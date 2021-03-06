const NodeEnvironment = require('jest-environment-node');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const installHelpers = require('./install-helpers');
const { TEMP_DIR } = require('./utils');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    const browserWSEndpoint = fs.readFileSync(
      path.join(TEMP_DIR, 'wsEndpoint'),
      'utf8'
    );

    if (!browserWSEndpoint) {
      throw new Error('browserWSEndpoint not found');
    }

    const browser = await puppeteer.connect({
      browserWSEndpoint
    });

    const activePage = (await browser.pages())[0];
    const page = activePage || (await browser.newPage());

    this.global.browser = browser;
    this.global.page = page;
    console.log('setting global.page', page);

    installHelpers(this.global);
  }

  async dispose() {
    await this.teardown();
  }
}

module.exports = PuppeteerEnvironment;
