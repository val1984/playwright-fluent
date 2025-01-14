import { ElementHandle } from 'playwright';
import * as SUT from '../index';
import { defaultCheckOptions } from '../../check-handle';

describe('uncheck handle', (): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  beforeEach((): void => {});

  test('should throw an error when the browser has not been launched', async (): Promise<void> => {
    // Given
    const handle: ElementHandle<Element> | undefined = undefined;

    // When
    // Then
    const expectedError = new Error("Cannot uncheck 'foobar' because no browser has been launched");

    await SUT.uncheckHandle(handle, 'foobar', undefined, defaultCheckOptions).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
