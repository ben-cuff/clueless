import { errorLog } from '@/utils/logger';
import { test } from '@playwright/test';
import { promises as fs } from 'fs';
import path from 'path';
import { doLogin, doRegister } from './utils/auth';

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

// Ensure auth directory exists
(async () => {
  const authDir = path.dirname(authFile);
  try {
    await fs.mkdir(authDir, { recursive: true });
  } catch (error) {
    errorLog(`Failed to create auth directory: ${error}`);
  }
})();

test('register-and-authenticate', async ({ page }) => {
  await test.step('register user', async () => {
    await doRegister(page);
  });

  await test.step('login user', async () => {
    await doLogin(page);
  });
  await page.context().storageState({ path: authFile });
});
