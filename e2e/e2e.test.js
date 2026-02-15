const puppetteer = require("puppeteer");

jest.setTimeout(60000); // default puppeteer timeout

describe("Credit Card Validator form", () => {
  let browser = null;
  let page = null;
  const baseUrl = "http://localhost:9000";

  beforeAll(async () => {
    browser = await puppetteer.launch({
      headless: false, // show gui
      slowMo: 250,
      devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test("should have label element for card input", async () => {
    await page.goto(baseUrl);

    const input = await page.$('input[id="card-number"]');
    expect(input).not.toBeNull();

    const placeholder = await page.$eval(
      'input[id="card-number"]',
      (el) => el.placeholder,
    );
    expect(placeholder).toBe("Введите номер карты");
  });

  test('should validate a valid Visa card number', async () => {
    await page.goto(baseUrl);
    await page.type('.card-input', '4960142984516724');
    await page.click('.validate-btn');

    const resultText = await page.$eval('.validation-result', (el) => el.textContent.trim());
    expect(resultText).toEqual('✅ Валидная карта VISA');

    const resultElement = await page.$('.validation-result');
    const classList = await page.evaluate((element) => [...element.classList], resultElement);
    expect(classList.includes('success')).toBe(true);
  });

  test('should format credit card numbers with spaces automatically', async () => {
    await page.goto(baseUrl);
    await page.type('.card-input', '2203327418464200');

    const value = await page.$eval('#card-number', el => el.value);
    expect(value).toEqual('2203 3274 1846 4200');
  });
});
