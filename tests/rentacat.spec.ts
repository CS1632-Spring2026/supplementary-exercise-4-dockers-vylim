import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8080/';

async function setCatCookies(
    page: any,
    cat1: boolean,
    cat2: boolean,
    cat3: boolean
) {
    await page.evaluate(
        ([c1, c2, c3]) => {
            document.cookie = `1=${c1}`;
            document.cookie = `2=${c2}`;
            document.cookie = `3=${c3}`;
        },
        [String(cat1), String(cat2), String(cat3)]
    );
}

test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await setCatCookies(page, false, false, false);
    await page.goto(BASE_URL);
});

test('TEST-1-RESET', async ({ page }) => {
    await setCatCookies(page, true, true, true);
    
    await page.getByRole('link', { name: 'Reset' }).click();
    
    await expect(page.locator('body')).toContainText('ID 1. Jennyanydots');
    await expect(page.locator('body')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('body')).toContainText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    
    const secondImage = page.locator('ol img').nth(1);
    await expect(secondImage).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    
    const bodyText = await page.locator('body').textContent();
    const idMatches = bodyText?.match(/ID \d\./g) || [];
    
    expect(idMatches.length).toBe(3);
    await expect(page.locator('body')).toContainText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    
    const inputs = page.locator('input');
    await inputs.nth(0).fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();
    
    await expect(page.locator('body')).toContainText('Rented out');
    await expect(page.locator('body')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('body')).toContainText('ID 3. Mistoffelees');
    await expect(page.locator('#rentResult')).toHaveText('Success!');
});

test('TEST-6-RETURN', async ({ page }) => {
    await setCatCookies(page, false, true, true);
    
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    
    const inputs = page.locator('input');
    await inputs.nth(1).fill('2');
    await page.getByRole('button', { name: 'Return' }).click();
    
    await expect(page.locator('body')).toContainText('ID 1. Jennyanydots');
    await expect(page.locator('body')).toContainText('ID 2. Old Deuteronomy');
    await expect(page.locator('body')).toContainText('Rented out');
    await expect(page.locator('#returnResult')).toHaveText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();

    await page.locator('input').fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();

    await expect(page.locator('#feedResult')).toHaveText('Nom, nom, nom.', { timeout: 10000});
})

test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.locator('body')).toContainText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
    await page.goto(BASE_URL + 'greet-a-cat/Jennyanydots');
    await expect(page.locator('body')).toContainText('Meow! from Jennyanydots');
});

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    await setCatCookies(page, true, true, true);
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.locator('body')).toHaveScreenshot();
});


