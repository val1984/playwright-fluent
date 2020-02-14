import { PlaywrightController } from '../../controller';
import { chromium, firefox, webkit } from 'playwright';
import * as path from 'path';

describe('Playwright Controller - ctor usage', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  test('should take existing browser and page instance of chromium', async (): Promise<void> => {
    // Given
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });

  test('should take existing browser and page instance of firefox', async (): Promise<void> => {
    // Given
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    // const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto('https://google.com');

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });

  test('should take existing browser and page instance of webkit', async (): Promise<void> => {
    // Given
    const browser = await webkit.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });

  test.skip('should take existing browser and page instance of firefox', async (): Promise<
    void
  > => {
    // Given
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext();
    const url = `file:${path.join(__dirname, 'ctor.test.html')}`;
    const page = await context.newPage();
    await page.goto(url);

    // When
    const pwc = new PlaywrightController(browser, page);

    // Then
    expect(pwc.currentBrowser()).toBe(browser);
    expect(pwc.currentPage()).toBe(page);
    await browser.close();
  });
});
