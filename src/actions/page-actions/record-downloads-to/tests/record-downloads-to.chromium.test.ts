import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import {
  deleteFile,
  ensureDirectoryExists,
  fileExists,
  userHomeDirectory,
  waitUntil,
} from '../../../../utils';

describe('record downloads to', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});
  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should record successfull downloads', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: null, acceptDownloads: true });
    const page = await context.newPage();
    const downloadsDirectory = path.join(__dirname, 'downloads');
    await ensureDirectoryExists(downloadsDirectory);

    const expectedDownloadedFilepath = path.join(downloadsDirectory, 'download.zip');
    deleteFile(expectedDownloadedFilepath);

    // When
    await SUT.recordDownloadsTo(downloadsDirectory, page);
    await page.goto(`file:${path.join(__dirname, 'record-downloads-to.test.html')}`);
    await page.click('a#download-package');

    // Then
    // eslint-disable-next-line no-console
    console.log(`user home directory : '${userHomeDirectory}'`);
    await waitUntil(
      async () => fileExists(expectedDownloadedFilepath),
      `File '${expectedDownloadedFilepath}' is not downloaded`,
    );
  });
});
