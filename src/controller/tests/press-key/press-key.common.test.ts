import * as SUT from '../../controller';

describe('Playwright Controller - pressKey', (): void => {
  let pwc: SUT.PlaywrightController;
  beforeEach((): void => {
    jest.setTimeout(30000);
    pwc = new SUT.PlaywrightController();
  });
  afterEach(
    async (): Promise<void> => {
      await pwc.close();
    },
  );

  test('should give back an error on hover without launching the browser', async (): Promise<
    void
  > => {
    // Given

    // When
    let result: Error | undefined = undefined;
    try {
      await pwc.pressKey('Tab');
    } catch (error) {
      result = error;
    }

    // Then
    expect(result && result.message).toContain(
      "Cannot press key 'Tab' because no browser has been launched",
    );
  });
});
