import * as SUT from '../index';
import { ElementHandle } from 'playwright';

describe('handle has text', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should return false when handle is undefined', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.hasHandleText(handle, 'foobar');

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.hasHandleText(handle, 'foobar');

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is null and expected value is empty', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | null = null;

    // When
    const result = await SUT.hasHandleText(handle, '');

    // Then
    expect(result).toBe(false);
  });

  test('should return false when handle is undefined and expected value is empty', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    const result = await SUT.hasHandleText(handle, '');

    // Then
    expect(result).toBe(false);
  });
});
