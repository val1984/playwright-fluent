import * as SUT from '../index';
import { Browser, chromium } from 'playwright';

describe('get client rectangle', (): void => {
  let browser: Browser | undefined = undefined;
  beforeEach((): void => {
    jest.setTimeout(30000);
  });
  afterEach(
    async (): Promise<void> => {
      if (browser) {
        await browser.close();
      }
    },
  );
  test('should return an error when selector is not found - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();

    // When

    // Then
    const expectedError = new Error('Error: failed to find element matching selector "foobar"');
    await SUT.getClientRectangleOf('foobar', page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});