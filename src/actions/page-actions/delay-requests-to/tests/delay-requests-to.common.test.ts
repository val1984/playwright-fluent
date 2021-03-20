import * as SUT from '../index';
import { Page } from 'playwright';

describe('delay requests to', (): void => {
  beforeEach((): void => {
    jest.setTimeout(30000);
  });

  test('should return an error when browser has not been launched', async (): Promise<void> => {
    // Given
    const page: Page | undefined = undefined;

    // When
    // Then
    const expectedError = new Error(
      "Cannot delay requests to '/foobar' because no browser has been launched",
    );
    await SUT.delayRequestsTo('/foobar', 10, page).catch((error): void =>
      expect(error).toMatchObject(expectedError),
    );
  });
});
