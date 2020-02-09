# Playwright Controller API

- Chainable Methods

  - [withBrowser(browser)](#withBrowserbrowser)
  - [withOptions(options)](#withOptionsoptions)
  - [navigateTo(url[, options])](#navigateTourl-options)
  - [close()](#close)

- Helper Methods

  - [currentBrowser()](#currentBrowser)
  - [currentPage()](#currentPage)
  - [getCurrentUrl()](#getCurrentUrl)

## Chainable Methods

### withBrowser(browser)

- browser : `BrowserName`

```js
BrowserName = 'chromium' | 'firefox' | 'webkit';
```

Will launch a browser together with a new page by using all `playwright` default settings and options.

Example:

```js
const browser = 'chromium';
const pwc = new PlaywrightController();
await pwc.withBrowser(browser);

// now if you want to use the playwright API from this point:
const browser = pwc.currentBrowser();
const page = pwc.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

### withOptions(options)

- options : `LaunchOptions`

```js
interface LaunchOptions {
  /**
   * Whether to run browser in headless mode.
   * Defaults to true
   *
   * @type {boolean}
   * @memberof LaunchOptions
   */
  headless: boolean;
  /**
   * Additional arguments to pass to the browser instance.
   * The list of Chromium flags can be found at
   * https://peter.sh/experiments/chromium-command-line-switches/
   *
   * @type {string[]}
   * @memberof LaunchOptions
   */
  args?: string[];
}
```

Will set browser options to apply when launching the browser.

Example:

```js
const browser = 'chromium';
const pwc = new PlaywrightController();

// start the browser in headfull mode
await pwc.withBrowser(browser).withOptions({ headless: false });
```

---

### navigateTo(url[, options])

- url: `string`
- options: `NavigationOptions`

```js
interface NavigationOptions {
  /**
   * Maximum navigation time in milliseconds,
   * defaults to 30 seconds,
   * pass 0 to disable timeout
   *
   * @type {number}
   * @memberof NavigationOptions
   */
  timeout: number;
}
```

Will navigate to the specified url.

Example:

```js
const browser = 'chromium';
const url = 'https://reactstrap.github.io/components/form';
const pwc = new PlaywrightController();

// prettier-ignore
await pwc
  .withBrowser(browser)
  .navigateTo(url);

// now if you want to use the playwright API from this point:
const browser = pwc.currentBrowser();
const page = pwc.currentPage();

// the browser and page objects are standard playwright objects
// so now you are ready to go by using the playwright API
```

---

### close()

Will close the browser. This should be the last method called in the chain.

---

## Helper Methods

### getCurrentUrl()

- returns: `Promise<string>`

Get the current url opened by the current page.

---

### currentPage()

- returns: `Page | undefined`

Get page instance of the controller in order to do stuff not covered by this API.

```js
const pwc = new PlaywrightController();

// use the pwc controller API
// ...

const page = pwc.currentPage();

// now use this page instance through the playwright API
```

---

### currentBrowser()

- returns: `Browser | undefined`

Get browser instance of the controller in order to do stuff not covered by this API.

```js
const pwc = new PlaywrightController();

// use the pwc controller API
// ...

const browser = pwc.currentBrowser();

// now use this browser instance through the playwright API
```

---