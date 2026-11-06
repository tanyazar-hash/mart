import { test, expect } from '@playwright/test';

test('home and products routes render and navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'МАРТ', exact: true })).toBeVisible();
  await page.locator('.hero .btn.primary').click();
  await expect(page).toHaveURL(/#\/products$/);
  await expect(page.locator('.reference-hero h1')).toBeVisible();
  await page.locator('.reference-story.wheat .product-story-link').click();
  await expect(page).toHaveURL(/#\/products\/wheat$/);
  await expect(page.locator('.product-detail-inner h1')).toHaveText('Пшеница');
  await page.locator('.product-back').click();
  await expect(page).toHaveURL(/#\/products$/);
});

test('section links work from product detail', async ({ page }) => {
  await page.goto('/#/products/sunflower');
  await expect(page.locator('.product-detail-inner h1')).toHaveText('Подсолнечник');
  await page.locator('.product-detail-inner .btn').click();
  await expect(page).toHaveURL(/#\/contacts$/);
  await expect(page.locator('#contacts')).toBeVisible();
});

test('mobile menu opens and navigates', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile layout only');
  await page.goto('/#/products/flax');
  const menu=page.locator('.product-detail-page .hamburger');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#product-mobile-navigation').getByRole('link', { name: 'Главная' }).click();
  await expect(page).toHaveURL(/#\/$/);
  await expect(page.locator('.hero')).toBeVisible();
});

test('no unexpected horizontal overflow', async ({ page }) => {
  for(const route of ['/', '/#/products', '/#/products/wheat', '/#/products/sunflower', '/#/products/flax']){
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow, 'overflow on '+route).toBeLessThanOrEqual(2);
  }
});
