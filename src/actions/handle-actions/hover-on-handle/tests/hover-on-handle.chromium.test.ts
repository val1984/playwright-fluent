import * as path from 'path';
import { Browser, chromium } from 'playwright';
import * as SUT from '../index';
import { showMousePosition, getClientRectangleOf } from '../../../dom-actions';
import { defaultVerboseOptions } from '../../is-handle-visible';
import { defaultHoverOptions, HoverOptions } from '../hover-on-handle';
import { injectCursor } from '../../../dom-actions/inject-cursor';
import { isHandleVisibleInViewport } from '../../is-handle-visible-in-viewport';

describe('hover on handle', (): void => {
  let browser: Browser | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  afterEach(async (): Promise<void> => {
    if (browser) {
      await browser.close();
    }
  });

  test('should hover on a selector that is out of viewport - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#out-of-view-port';
    const handle = await page.$(selector);
    const isSelectorVisibleBeforeScroll = await isHandleVisibleInViewport(
      handle,
      defaultVerboseOptions,
    );

    const options: HoverOptions = {
      ...defaultHoverOptions,
    };

    // When
    await SUT.hoverOnHandle(handle, selector, page, options);
    const isSelectorVisibleAfterScroll = await isHandleVisibleInViewport(
      handle,
      defaultVerboseOptions,
    );

    // Then
    expect(isSelectorVisibleBeforeScroll).toBe(false);
    expect(isSelectorVisibleAfterScroll).toBe(true);

    const mousePositionClientRectangle = await getClientRectangleOf(
      'playwright-mouse-pointer',
      page,
    );
    const mouseX = mousePositionClientRectangle.left + mousePositionClientRectangle.width / 2;
    const mouseY = mousePositionClientRectangle.top + mousePositionClientRectangle.height / 2;

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;
    expect(Math.abs(mouseX - expectedX)).toBeLessThanOrEqual(1);
    expect(Math.abs(mouseY - expectedY)).toBeLessThanOrEqual(1);
  });

  test('should throw when selector is hidden - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#hidden';
    const handle = await page.$(selector);
    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 1000,
    };
    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on '#hidden' because this selector is not visible",
    );

    await SUT.hoverOnHandle(handle, selector, page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should throw when selector is always moving - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#moving';
    const handle = await page.$(selector);

    const options: HoverOptions = {
      ...defaultHoverOptions,
      timeoutInMilliseconds: 500,
    };

    // When
    // Then
    const expectedError = new Error(
      "Cannot hover on '#moving' because this selector is always moving",
    );
    await SUT.hoverOnHandle(handle, selector, page, options).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });

  test('should wait for selector to stop moving - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);

    const selector = '#moving';
    const handle = await page.$(selector);

    // When
    const options: SUT.HoverOptions = {
      ...SUT.defaultHoverOptions,
      verbose: false,
    };
    await SUT.hoverOnHandle(handle, selector, page, options);

    // Then
    const mousePositionClientRectangle = await getClientRectangleOf(
      'playwright-mouse-pointer',
      page,
    );
    const mouseX = mousePositionClientRectangle.left + mousePositionClientRectangle.width / 2;
    const mouseY = mousePositionClientRectangle.top + mousePositionClientRectangle.height / 2;

    const currentClientRectangle = await getClientRectangleOf(selector, page);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;

    expect(Math.abs(mouseX - expectedX)).toBeLessThan(3);
    expect(Math.abs(mouseY - expectedY)).toBeLessThan(3);
  });

  test('should hover on a selector that is inside an iframe - chromium', async (): Promise<void> => {
    // Given
    browser = await chromium.launch({ headless: true });
    const browserContext = await browser.newContext({ viewport: null });
    const page = await browserContext.newPage();
    await showMousePosition(page);
    const url = `file:${path.join(__dirname, 'hover-on-handle.test.html')}`;
    await page.goto(url);
    const frameSelector = 'iframe';
    const frameHandle = await page.$(frameSelector);
    const frame = await frameHandle?.contentFrame();
    await injectCursor(frame);
    const selector = '#inside-iframe';
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const handle = await frame!.$(selector);

    const options: HoverOptions = {
      ...defaultHoverOptions,
    };

    // When
    await SUT.hoverOnHandle(frameHandle, frameSelector, page, options);
    await SUT.hoverOnHandle(handle, selector, frame, options);
    const isSelectorVisibleAfterScroll = await isHandleVisibleInViewport(
      handle,
      defaultVerboseOptions,
    );

    // Then
    // expect(isSelectorVisibleBeforeScroll).toBe(false);
    expect(isSelectorVisibleAfterScroll).toBe(true);

    const mousePositionClientRectangle = await getClientRectangleOf(
      'playwright-mouse-pointer',
      frame,
    );
    const mouseX = mousePositionClientRectangle.left + mousePositionClientRectangle.width / 2;
    const mouseY = mousePositionClientRectangle.top + mousePositionClientRectangle.height / 2;

    const currentClientRectangle = await getClientRectangleOf(selector, frame);
    const expectedX = currentClientRectangle.left + currentClientRectangle.width / 2;
    const expectedY = currentClientRectangle.top + currentClientRectangle.height / 2;
    expect(Math.abs(mouseX - expectedX)).toBeLessThanOrEqual(1);
    expect(Math.abs(mouseY - expectedY)).toBeLessThanOrEqual(1);
  });
});
