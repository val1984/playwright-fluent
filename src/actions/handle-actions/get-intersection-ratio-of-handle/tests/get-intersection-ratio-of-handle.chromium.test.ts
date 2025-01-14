import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition } from '../../../dom-actions';

describe('get intersection ratio of handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return 0 when selector is out of viewport - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'get-intersection-ratio-of-handle.test.html')}`;
    await page.goto(url);

    const selector = '#out-of-view-port';
    const handle = await page.$(selector);

    // When
    const result = await SUT.getIntersectionRatioOfHandle(handle);

    // Then
    expect(result).toBe(0);
  });

  test('should return 1 when selector is inside of viewport - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'get-intersection-ratio-of-handle.test.html')}`;
    await page.goto(url);

    const selector = '#in-view-port';
    const handle = await page.$(selector);

    // When
    const result = await SUT.getIntersectionRatioOfHandle(handle);

    // Then
    expect(result).toBe(1);
  });

  test('should return a ratio when selector is intersecting viewport - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'get-intersection-ratio-of-handle.test.html')}`;
    await page.goto(url);

    const selector = 'playwright-mouse-pointer';
    const handle = await page.$(selector);

    // When
    const result = await SUT.getIntersectionRatioOfHandle(handle);

    // Then
    expect(result).toBeGreaterThan(0.1);
    expect(result).toBeLessThan(0.5);
  });
});
