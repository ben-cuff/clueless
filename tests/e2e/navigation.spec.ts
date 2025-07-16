import { expect, test } from '@playwright/test';

test('navigate-to-questions', async ({ page }) => {
  await test.step('Click on Questions link', async () => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Questions' }).click();
  });

  await test.step('Verify questions are displayed', async () => {
    await expect(page.locator('body')).toContainText('1. Two Sum');
    await expect(page.locator('body')).toContainText('2. Add Two Numbers');
    await expect(page.locator('body')).toContainText(
      '3. Longest Substring Without Repeating Characters'
    );
    await expect(page.locator('body')).toContainText(
      '4. Median of Two Sorted Arrays'
    );
    await expect(page.locator('body')).toContainText(
      '5. Longest Palindromic Substring'
    );
  });

  await test.step('Verify URL', async () => {
    await expect(page).toHaveURL('http://localhost:3000/questions');
  });
});

test('navigate-to-interview', async ({ page }) => {
  await test.step('Click on Interview link', async () => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Interview' }).click();
  });

  await test.step('Verify interview page is displayed', async () => {
    await expect(page.locator('body')).toContainText('Start Random Interview');
    await expect(
      page.getByRole('button', { name: 'Start Random Interview' })
    ).toBeVisible();
  });
});

test('navigate-home', async ({ page }) => {
  await test.step('Click on Home link', async () => {
    await page.goto('http://localhost:3000/questions');
    await page.getByRole('link', { name: 'Clueless' }).click();
  });

  await test.step('Verify home page is displayed', async () => {
    await expect(page).toHaveURL('/');
  });
});

test('navigate-to-settings', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page
    .getByRole('banner')
    .getByRole('button')
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  await expect(
    page.getByRole('button', { name: 'Delete Account' })
  ).toBeVisible();
  await expect(page).toHaveURL('/settings');
});

test('navigate-to-goals', async ({ page }) => {
  await test.step('Click on Goals link', async () => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Goals' }).click();
  });

  await test.step('Verify goals page is displayed', async () => {
    await expect(page).toHaveURL('http://localhost:3000/goals');
    await expect(
      page.getByRole('heading', { name: 'Select Date Range' })
    ).toBeVisible();
  });
});
