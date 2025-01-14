import { Browser, webkit } from 'playwright';
import * as SUT from '..';

describe.skip('get-focused-handle', (): void => {
  let browser: Browser | undefined = undefined;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should return handle when selector exists on the page - webkit', async (): Promise<void> => {
    // Given
    browser = await webkit.launch({ headless: true });
    const context = await browser.newContext({ viewport: null });
    const page = await context.newPage();

    // When
    const result = await SUT.getFocusedHandle(page);

    // Then
    expect(result).toBeDefined();
  });
});
