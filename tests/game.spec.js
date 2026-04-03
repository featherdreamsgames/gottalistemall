const { test, expect } = require('@playwright/test');

async function submit(page, value) {
  await page.fill('#inputField', value);
  await page.click('#submitBtn');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await expect(page.locator('#inputField')).toBeEnabled();
});

test('accepts a valid entry and updates score', async ({ page }) => {
  await submit(page, 'Pikachu');
  await expect(page.locator('#score')).toHaveText('1');
});

test('shows custom response for digimon', async ({ page }) => {
  await submit(page, 'Agumon');
  await expect(page.locator('#message')).toContainText('Wrong franchise.');
});

test('starter custom response only triggers on first accepted entry', async ({ page }) => {
  await submit(page, 'Bulbasaur');
  await expect(page.locator('#message')).toContainText('I choose you!');

  await submit(page, 'Charmander');
  await expect(page.locator('#message')).not.toContainText('I choose you!');
});

test('misspelling response appears', async ({ page }) => {
  await submit(page, 'Onyx');
  await expect(page.locator('#message')).toContainText("That's a common misspelling. Try again.");
});

test("accepts apostrophe variant like farfetch'd", async ({ page }) => {
  await submit(page, "farfetch'd");
  await expect(page.locator('#score')).toHaveText('1');
});

test('start over resets score and timer state', async ({ page }) => {
  await submit(page, 'Pikachu');
  await expect(page.locator('#score')).toHaveText('1');

  await page.click('#restartBtn');
  await expect(page.locator('#score')).toHaveText('0');
  await expect(page.locator('#timer')).toHaveText('60');
});
