import { expect, Page, test } from '@playwright/test';

test('questions-initial-load', async ({ page }) => {
  await page.goto('http://localhost:3000/questions');

  const bodyLocator = page.locator('body');
  await expect(bodyLocator).toContainText('1. Two Sum');
  await expect(bodyLocator).toContainText('2. Add Two Numbers');
  await expect(bodyLocator).toContainText(
    '3. Longest Substring Without Repeating Characters'
  );
  await expect(bodyLocator).toContainText('4. Median of Two Sorted Arrays');
  await expect(bodyLocator).toContainText('5. Longest Palindromic Substring');
});

test('questions-search', async ({ page }) => {
  await test.step('search for questions', async () => {
    await page.goto('http://localhost:3000/questions');
    await page
      .getByRole('textbox', { name: 'Search for questions...' })
      .fill('two sum');
  });

  await test.step('verify search results', async () => {
    const bodyLocator = page.locator('body');
    await page.waitForTimeout(1000);
    await expect(bodyLocator).toContainText('1. Two Sum');
    await expect(bodyLocator).toContainText(
      '167. Two Sum II - Input Array Is Sorted'
    );
    await expect(bodyLocator).toContainText(
      '170. Two Sum III - Data structure design'
    );
    await expect(bodyLocator).toContainText('653. Two Sum IV - Input is a BST');
    await expect(bodyLocator).toContainText('1099. Two Sum Less Than K');
  });
});

test('questions-filter-by-topics', async ({ page }) => {
  await test.step('press filter by topics', async () => {
    await page.goto('http://localhost:3000/questions');
    await page.getByText('Select topics...', { exact: true }).click();
    await page.waitForSelector('[role="option"]');
    await page.getByRole('option', { name: 'Array', exact: true }).click();
    await page
      .getByRole('option', { name: 'Binary Search', exact: true })
      .click();
  });

  await test.step('verify questions are displayed', async () => {
    const bodyLocator = page.locator('body');
    await expect(bodyLocator).toContainText('1. Two Sum');
    await expect(bodyLocator).toContainText('4. Median of Two Sorted Arrays');
    await expect(bodyLocator).toContainText('11. Container With Most Water');
    await expect(bodyLocator).toContainText('15. 3Sum');
    await expect(bodyLocator).toContainText('16. 3Sum Closest');
  });
});

test('questions-filter-by-difficulty', async ({ page }) => {
  await test.step('press filter by difficulty', async () => {
    await page.goto('http://localhost:3000/questions');
    await page.waitForTimeout(1000);
    await page.getByRole('combobox').click();
    await page.waitForTimeout(1000);
    await page.getByRole('option', { name: 'Medium' }).click();
    await page.waitForTimeout(1000);
  });

  await test.step('verify medium questions are displayed', async () => {
    const bodyLocator = page.locator('body');
    await expect(bodyLocator).toContainText('2. Add Two Numbers');
    await expect(bodyLocator).toContainText(
      '3. Longest Substring Without Repeating Characters'
    );
    await expect(bodyLocator).toContainText('5. Longest Palindromic Substring');
    await expect(bodyLocator).toContainText('6. Zigzag Conversion');
    await expect(bodyLocator).toContainText('7. Reverse Integer');

    await expect(bodyLocator).not.toContainText('1. Two Sum');
  });
});

test('questions-pagination', async ({ page }) => {
  await test.step('press per page button', async () => {
    await page.goto('http://localhost:3000/questions');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'per page' }).click();
    await page.getByRole('menuitem', { name: '100' }).click();
  });

  await test.step('verify 100 questions are displayed', async () => {
    await expect(page.getByText('100. Same Tree')).toBeVisible();
  });
});

test('questions-pagination-next-previous', async ({ page }) => {
  await page.goto('http://localhost:3000/questions');

  const bodyLocator = page.locator('body');

  await test.step('initial page load', async () => {
    await expect(bodyLocator).toContainText('1. Two Sum');
    await expect(bodyLocator).toContainText('2. Add Two Numbers');
    await expect(bodyLocator).toContainText(
      '3. Longest Substring Without Repeating Characters'
    );
    await expect(bodyLocator).toContainText('4. Median of Two Sorted Arrays');
    await expect(bodyLocator).toContainText('5. Longest Palindromic Substring');
  });

  await test.step('go to next page', async () => {
    await page.getByLabel('Go to next page').click();
    await expect(bodyLocator).toContainText('21. Merge Two Sorted Lists');
    await expect(bodyLocator).toContainText('22. Generate Parentheses');
    await expect(bodyLocator).toContainText('23. Merge k Sorted Lists');
    await expect(bodyLocator).toContainText('24. Swap Nodes in Pairs');
    await expect(bodyLocator).toContainText('25. Reverse Nodes in k-Group');
  });

  await test.step('go to previous page', async () => {
    await page.getByLabel('Go to previous page').click();
    await expect(bodyLocator).toContainText('1. Two Sum');
    await expect(bodyLocator).toContainText('2. Add Two Numbers');
    await expect(bodyLocator).toContainText(
      '3. Longest Substring Without Repeating Characters'
    );
    await expect(bodyLocator).toContainText('4. Median of Two Sorted Arrays');
    await expect(bodyLocator).toContainText('5. Longest Palindromic Substring');
  });
});

test('questions-leetcode-link', async ({ page }) => {
  let page1Promise: Promise<Page>;

  await test.step('click on leetcode link', async () => {
    await page.goto('http://localhost:3000/questions');
    page1Promise = page.waitForEvent('popup');
    await page
      .getByTestId('question-card-1')
      .getByRole('link', { name: 'leetcode-logo' })
      .click();
  });

  await test.step('verify leetcode page is opened', async () => {
    const page1 = await page1Promise;
    await expect(page1).toHaveURL(
      /https:\/\/leetcode\.com\/problems\/two-sum(\/description)?/
    );
  });
});