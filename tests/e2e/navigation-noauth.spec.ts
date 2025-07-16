import test, { expect, Page } from '@playwright/test';

test('navigate-to-interview-logged-out', async ({ page }) => {
  await test.step('navigate to banner and sign out', async () => {
    await signOut(page);
  });

  await test.step('navigate to interview page', async () => {
    page.once('dialog', (dialog) => {
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('link', { name: 'Interview' }).click();
  });

  await test.step('verify that we are on home page', async () => {
    await expect(
      page
        .locator('div')
        .filter({ hasText: 'An AI integrated interview' })
        .nth(1)
    ).toBeVisible();
    await expect(page).toHaveURL(/\/(\?error=unauthenticated)?$/);
  });
});

test('navigate-to-login', async ({ page }) => {
  await test.step('navigate to banner and sign out', async () => {
    await signOut(page);
  });

  await test.step('navigate to login page', async () => {
    await page.getByRole('button', { name: 'Login' }).click();
  });

  await test.step('verify that we are on login page', async () => {
    await expect(
      page.locator('div').filter({ hasText: /^Username:Password:Sign In$/ })
    ).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});

test('navigate-to-register', async ({ page }) => {
  await test.step('navigate to banner and sign out', async () => {
    await signOut(page);
  });

  await test.step('navigate to register page', async () => {
    await page.getByRole('button', { name: 'Sign Up' }).click();
  });

  await test.step('verify that we are on register page', async () => {
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Username:Password:Confirm Password:Register$/ })
    ).toBeVisible();
    await expect(page).toHaveURL('/register');
  });
});

test('navigate-between-register-and-login', async ({ page }) => {
  await test.step('navigate to banner and sign out', async () => {
    await signOut(page);
  });

  await test.step('navigate to and verify register page', async () => {
    await page.getByRole('button', { name: 'Sign Up' }).click();
    await expect(page).toHaveURL('/register');
  });

  await test.step('navigate to and verify login page', async () => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/login');
  });

  await test.step('navigate back to register page', async () => {
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL('/register');
  });
});

async function signOut(page: Page) {
  await page.goto('http://localhost:3000/');
  await page
    .getByRole('banner')
    .getByRole('button')
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();
  await page.waitForTimeout(2000);
}

test('navigate-to-goals-logged-out', async ({ page }) => {
  await test.step('navigate to banner and sign out', async () => {
    await signOut(page);
  });

  await test.step('navigate to goals page', async () => {
    page.once('dialog', (dialog) => {
      dialog.dismiss().catch(() => {});
    });
    await page.getByRole('link', { name: 'Goals' }).click();
  });

  await test.step('verify that we are on home page', async () => {
    await expect(
      page
        .locator('div')
        .filter({ hasText: 'An AI integrated interview' })
        .nth(1)
    ).toBeVisible();
    await expect(page).toHaveURL(/\/(\?error=unauthenticated)?$/);
  });
});
