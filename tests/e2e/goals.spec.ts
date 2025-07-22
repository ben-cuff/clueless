import test, { expect } from '@playwright/test';

test('create goal', async ({ page }) => {
  await page.goto('http://localhost:3000/goals');

  await test.step('navigate to goals page and verify it is open', async () => {
    await page.goto('http://localhost:3000/goals');
    await expect(page).toHaveURL('http://localhost:3000/goals');
  });

  await test.step('Verify create goal page is visible and click questions goal tab', async () => {
    await expect(
      page.getByRole('heading', { name: 'Select Goal End Date' })
    ).toBeVisible();
    await expect(
      page.getByRole('tab', { name: 'Questions Goal' })
    ).toBeVisible();
    await page.getByRole('tab', { name: 'Questions Goal' }).click();
  });

  await test.step('Verify Questions Goal form is visible', async () => {
    await expect(
      page.getByLabel('Questions Goal').getByText('Questions Goal')
    ).toBeVisible();
    await expect(
      page.getByRole('spinbutton', { name: 'Total questions to complete' })
    ).toBeVisible();
    await page
      .getByRole('spinbutton', { name: 'Total questions to complete' })
      .fill('10');
  });

  await test.step('Create goal and verify goal progress is visible', async () => {
    await page.getByRole('button', { name: 'Create Goal' }).click();
    await expect(page.getByText('Goal Progress')).toBeVisible();
  });
});

test('view goal progress', async ({ page }) => {
  const bodyLocator = page.locator('body');

  await test.step('navigate to goals page and verify it is open', async () => {
    await page.goto('http://localhost:3000/goals');
    await expect(page).toHaveURL('http://localhost:3000/goals');
  });

  await test.step('Verify goal progress is visible', async () => {
    await expect(page.getByText('Goal Progress')).toBeVisible();
  });

  await test.step('Verify goal progress details are visible', async () => {
    await expect(bodyLocator).toContainText('Days left: 14');
    await expect(bodyLocator).toContainText(/[\d.]+% complete/);
  });

  await test.step('Verify goal dates are accurate (start day is today, end date is 14 days from now)', async () => {
    const DEFAULT_DAYS = 14;
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + DEFAULT_DAYS);

    const goalStartsText = `Goal starts: ${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    const goalEndsText = `Goal ends: ${
      endDate.getMonth() + 1
    }/${endDate.getDate()}/${endDate.getFullYear()}`;

    await expect(bodyLocator).toContainText(goalStartsText);
    await page
      .getByText(`Goal ends: ${endDate.getMonth() + 1}/${endDate.getDate()}/`)
      .click();
    await expect(bodyLocator).toContainText(goalEndsText);
  });

  await test.step('verify update form is visible', async () => {
    await expect(
      page.getByLabel('Hours Goal').getByText('Hours Goal')
    ).toBeVisible();
    await expect(
      page.getByRole('spinbutton', { name: 'Total hours spent studying' })
    ).toBeVisible();
  });
});

test('update goal', async ({ page }) => {
  const bodyLocator = page.locator('body');

  await test.step('navigate to goals page and verify it is open', async () => {
    await page.goto('http://localhost:3000/goals');
    await expect(page).toHaveURL('http://localhost:3000/goals');
  });

  await test.step('Verify update goal form is visible', async () => {
    await expect(
      page.getByRole('button', { name: 'Create Goal' })
    ).toBeVisible();
    await expect(
      page.getByRole('spinbutton', { name: 'Total hours spent studying' })
    ).toBeVisible();

    await page
      .getByRole('spinbutton', { name: 'Total hours spent studying' })
      .fill('10');
    await page.getByRole('button', { name: 'Create Goal' }).click();
  });

  await test.step('Update goal and verify goal progress is updated', async () => {
    await expect(page).toHaveURL('http://localhost:3000/goals');

    await expect(bodyLocator).toContainText(/[\d.]+ \/ [\d.]+ hours/);
    await expect(bodyLocator).toContainText(/[\d.]+% complete/);
    await expect(bodyLocator).toContainText('Days left: 14');
  });
});
