import { test, expect } from '@playwright/test';

test('main page displays real farm content and navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'МАРТ', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'О хозяйстве' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Что мы выращиваем' })).toBeAttached();
  for (const name of ['Пшеница', 'Подсолнечник', 'Лён']) {
    await expect(page.getByRole('heading', { name, exact: true })).toBeAttached();
  }
  await expect(page.locator('#contacts')).toBeAttached();
});

test('organic SVG waves are applied and layout has no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#wave-a')).toHaveCount(1);
  await expect(page.locator('#wave-b')).toHaveCount(1);
  const style = await page.locator('#about').evaluate(el => getComputedStyle(el).clipPath);
  expect(style).toContain('wave-a');
  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport + 2);
});

test('wheat GLB asset is available', async ({ request }) => {
  const response = await request.get('/models/wheat-seed.glb');
  expect(response.ok()).toBeTruthy();
  const data = await response.body();
  expect(data.byteLength).toBeGreaterThan(1000);
  expect(data.subarray(0,4).toString()).toBe('glTF');
});

test('scrolling works and capture desktop/mobile reference screenshot', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('hero.png'), fullPage: false });
  await page.locator('#products').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Что мы выращиваем' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('products.png'), fullPage: false });
  if (testInfo.project.name === 'desktop-chromium') {
    await expect(page.locator('.seeds canvas')).toHaveCount(1, { timeout: 15000 });
  }
});

test('product cards open real details and can be collapsed', async ({ page }) => {
  await page.goto('/');
  const wheat=page.getByRole('button',{name:'Подробнее: Пшеница'});
  await wheat.scrollIntoViewIfNeeded();
  await wheat.click();
  await expect(wheat).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.crop-detail')).toContainText('Пшеница');
  await wheat.click();
  await expect(wheat).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('.crop-detail')).toHaveCount(0);
});

test('contacts have a usable address and mobile menu works', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('button',{name:/Скопировать адрес/})).toBeAttached();
  await expect(page.locator('#contacts')).toContainText('село Светлое');
  if(testInfo.project.name==='mobile-chromium'){
    await page.getByRole('button',{name:'Открыть меню'}).click();
    await expect(page.locator('header nav')).toHaveClass(/active/);
    await page.locator('header nav').getByRole('link',{name:'Продукция'}).click();
    await expect(page.locator('header nav')).not.toHaveClass(/active/);
  }
});

test('mobile waves are shallow, glowing and do not overlap section headings', async ({ page }, testInfo) => {
  if(testInfo.project.name!=='mobile-chromium')return;
  await page.goto('/');
  const sections=['#about','#products','.land','#contacts'];
  const clips=['wave-a-mobile','wave-b-mobile','wave-c-mobile','wave-d-mobile'];
  for(let i=0;i<sections.length;i++){
    const section=page.locator(sections[i]);
    await section.scrollIntoViewIfNeeded();
    const clip=await section.evaluate(el=>getComputedStyle(el).clipPath);
    expect(clip).toContain(clips[i]);
    const heading=section.getByRole('heading').first();
    await expect(heading).toBeVisible();
    const safe=await heading.evaluate(el=>{
      const h=el.getBoundingClientRect(),s=el.closest('section').getBoundingClientRect();
      return h.top-s.top>60 && h.width>0 && h.right<=window.innerWidth+2;
    });
    expect(safe).toBeTruthy();
    await expect(section.locator('.wave-mobile')).toBeVisible();
    await expect(section.locator('.wave-desktop')).toBeHidden();
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});

test('mobile about landscape extends behind the full products wave', async ({ page }, testInfo) => {
  if(testInfo.project.name!=='mobile-chromium')return;
  await page.goto('/');
  const geometry=await page.evaluate(()=>{
    const about=document.querySelector('#about').getBoundingClientRect();
    const products=document.querySelector('#products').getBoundingClientRect();
    return {overlap:about.bottom-products.top,required:products.height*.075};
  });
  expect(geometry.overlap).toBeGreaterThan(geometry.required);
});
