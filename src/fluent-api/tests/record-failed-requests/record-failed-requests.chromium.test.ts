import * as path from 'path';
import { FakeServer } from 'simple-fake-server';
import * as SUT from '../../playwright-fluent';
import { stringifyRequest, RequestInfo } from '../../../utils';

describe('Playwright Fluent - recordFailedRequests(url)', (): void => {
  let p: SUT.PlaywrightFluent;
  let fakeServer: FakeServer | undefined = undefined;
  beforeAll(() => {
    fakeServer = new FakeServer(1244);
    fakeServer.start();
    //The FakeServer now listens on http://localhost:1244
  });
  afterAll(() => {
    if (fakeServer) {
      fakeServer.stop();
    }
  });
  beforeEach((): void => {
    p = new SUT.PlaywrightFluent();
  });
  afterEach(async (): Promise<void> => {
    await p.close();
  });

  test('should record failed requests 500', async (): Promise<void> => {
    // Given
    const url = `file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`;

    fakeServer &&
      // prettier-ignore
      fakeServer.http
        .get()
        .to('/500')
        .willFail(500);

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordFailedRequests()
      .navigateTo(url);

    // Then
    await p.waitForStabilityOf(async () => p.getFailedRequests().length, {
      stabilityInMilliseconds: 2000,
    });
    const requests = p.getFailedRequests();
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBe(1);

    const stringifiedSentRequest = await stringifyRequest(requests[0]);
    const failedRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(failedRequest.response!.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(failedRequest.response!.statusText).toBe('Internal Server Error');
  });

  test('should accumulate failed requests', async (): Promise<void> => {
    // Given
    const url500 = `file:${path.join(__dirname, 'record-failed-requests-500.test.html')}`;
    const url503 = `file:${path.join(__dirname, 'record-failed-requests-503.test.html')}`;
    const url400 = `file:${path.join(__dirname, 'record-failed-requests-400.test.html')}`;

    fakeServer && fakeServer.http.get().to('/500').willFail(500);
    fakeServer && fakeServer.http.get().to('/503').willFail(503);
    fakeServer && fakeServer.http.get().to('/400').willFail(400);

    // When
    await p
      .withBrowser('chromium')
      .withOptions({ headless: true })
      .withCursor()
      .recordFailedRequests()
      .navigateTo(url500)
      .wait(2000)
      .navigateTo(url503)
      .wait(2000)
      .navigateTo(url400);

    // Then
    await p.waitForStabilityOf(async () => p.getFailedRequests().length, {
      stabilityInMilliseconds: 2000,
    });
    const requests = p.getFailedRequests();
    expect(Array.isArray(requests)).toBe(true);
    expect(requests.length).toBe(3);

    const stringifiedSentRequest = await stringifyRequest(requests[0]);
    const failedRequest = JSON.parse(stringifiedSentRequest) as RequestInfo;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(failedRequest.response!.status).toBe(500);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(failedRequest.response!.statusText).toBe('Internal Server Error');

    // When I clear all failed request
    p.clearFailedRequests();

    // Then
    const remainingRequests = p.getFailedRequests();
    expect(Array.isArray(remainingRequests)).toBe(true);
    expect(remainingRequests.length).toBe(0);
  });
});
