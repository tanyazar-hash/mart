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
  for(const route of ['/', '/#/about', '/#/machinery', '/#/contacts', '/#/products', '/#/products/wheat', '/#/products/sunflower', '/#/products/flax']){
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(overflow, 'overflow on '+route).toBeLessThanOrEqual(2);
  }
});

test('farm, machinery and contacts pages render with their intended content', async ({ page }) => {
  await page.goto('/#/about');
  await expect(page.locator('main h1').first()).toBeVisible();
  await page.goto('/#/machinery');
  await expect(page.locator('.machinery-hero h1')).toContainText('Современная');
  await expect(page.locator('.machinery-card')).toHaveCount(4);
  await page.locator('.machinery-card').first().click();
  await expect(page.locator('.machinery-detail')).toBeVisible();
  await expect(page.locator('.machinery-card')).toHaveCount(4);
  await page.locator('.machinery-card').nth(1).click();
  await expect(page.locator('.machinery-card')).toHaveCount(4);
  await page.goto('/#/contacts');
  await expect(page.locator('main')).toBeVisible();
});

test('products scroll cue keeps the route and scrolls to the first culture', async ({ page }) => {
  await page.goto('/#/products');
  await page.locator('.product-scroll').click();
  await expect(page).toHaveURL(/#\/products$/);
  await expect(page.locator('#culture-wheat')).toBeInViewport();
});

test('machinery hero background is configured and not replaced by a solid panel', async ({ page }) => {
  await page.goto('/#/machinery');
  const image=await page.locator('.machinery-hero').evaluate(el=>getComputedStyle(el).backgroundImage);
  expect(image).toContain('tract2.png');
});
