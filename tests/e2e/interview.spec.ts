import test, { expect } from '@playwright/test';
import TWO_SUM_USER_RESPONSE from './constants/two-sum-user-response';

test('Interview two sum', async ({ page }) => {
  await test.step('Load interview question', async () => {
    await page.goto('http://localhost:3000/interview/new?questionNumber=1');
    await expect(page.locator('body')).toContainText('Two Sum');
  });

  await test.step('Check interview UI', async () => {
    await expect(page.locator('body')).toContainText('Two Sum');
  });

  await test.step('Submit solution approach', async () => {
    await expect(
      page.getByRole('textbox', { name: 'Your message here' })
    ).toBeVisible();
    await page
      .getByRole('textbox', { name: 'Your message here' })
      .fill(TWO_SUM_USER_RESPONSE);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByTestId('chat-message-user-1').first()).toBeVisible();
    await expect(
      page.getByTestId('chat-message-model-2').first()
    ).toBeVisible();
  });

  await test.step('Run test cases', async () => {
    await page.getByRole('button', { name: 'Run Testcases' }).click();
    await expect(page.getByTestId('chat-message-user-3').first()).toBeVisible();
    await expect(
      page.getByTestId('chat-message-model-4').first()
    ).toBeVisible();
  });

  await test.step('Navigate to interview list and delete interview', async () => {
    await page.getByRole('link', { name: 'Interview' }).click();
    await page.waitForTimeout(2000);

    await expect(
      page.getByRole('button', { name: 'View' }).first()
    ).toBeVisible();
    await expect(page.getByRole('button', { name: '×' }).first()).toBeVisible();

    const firstInterviewTitle = await page
      .getByRole('button', { name: 'View' })
      .first()
      .innerText();
    await page.getByRole('button', { name: '×' }).first().click();

    await expect(async () => {
      const currentFirstTitle = await page
        .getByRole('button', { name: 'View' })
        .first()
        .innerText();
      return currentFirstTitle !== firstInterviewTitle;
    }).toPass({ timeout: 2000 });
  });
});

test('interview two sum early complete', async ({ page }) => {
  await test.step('Load interview question', async () => {
    await page.goto('http://localhost:3000/interview/new?questionNumber=1');
    await expect(page.locator('body')).toContainText('Two Sum');
  });

  await test.step('Check interview UI', async () => {
    await expect(page.locator('body')).toContainText('Two Sum');
  });

  await test.step('Submit solution approach', async () => {
    await expect(
      page.getByRole('textbox', { name: 'Your message here' })
    ).toBeVisible();
    await page
      .getByRole('textbox', { name: 'Your message here' })
      .fill(TWO_SUM_USER_RESPONSE);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByTestId('chat-message-user-1').first()).toBeVisible();
    await expect(
      page.getByTestId('chat-message-model-2').first()
    ).toBeVisible();
  });

  await test.step('Run test cases', async () => {
    await page.getByRole('button', { name: 'Run Testcases' }).click();
    await expect(page.getByTestId('chat-message-user-3').first()).toBeVisible();
    await expect(
      page.getByTestId('chat-message-model-4').first()
    ).toBeVisible();
  });

  await test.step('End interview early and view feedback', async () => {
    await page.getByRole('button', { name: 'End Interview Early' }).click();
    await expect(page.getByRole('dialog', { name: 'Feedback' })).toBeVisible();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(
      page.getByRole('button', { name: 'Open Feedback' })
    ).toBeVisible();
    await page.getByRole('button', { name: 'Open Feedback' }).click();
    await expect(page.getByRole('dialog', { name: 'Feedback' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
  });

  await test.step('Navigate to interview list and delete interview', async () => {
    await page.getByRole('link', { name: 'Interview' }).click();

    const firstInterviewTitle = await page
      .getByRole('button', { name: 'View' })
      .first()
      .innerText();
    await page.getByRole('button', { name: '×' }).first().click();

    await expect(async () => {
      const currentFirstTitle = await page
        .getByRole('button', { name: 'View' })
        .first()
        .innerText();
      return currentFirstTitle !== firstInterviewTitle;
    }).toPass({ timeout: 2000 });
  });
});

test('interview two sum resume and delete', async ({ page }) => {
  await test.step('Load interview question', async () => {
    await page.goto('http://localhost:3000/interview/new?questionNumber=1');
    await expect(page.locator('body')).toContainText('Two Sum');
  });

  await test.step('Check interview UI', async () => {
    await expect(page.locator('body')).toContainText('Two Sum');
  });

  await test.step('Submit solution approach', async () => {
    await expect(
      page.getByRole('textbox', { name: 'Your message here' })
    ).toBeVisible();
    await page
      .getByRole('textbox', { name: 'Your message here' })
      .fill(TWO_SUM_USER_RESPONSE);
    await page.getByRole('button', { name: 'Submit' }).click();

    await expect(page.getByTestId('chat-message-user-1').first()).toBeVisible();
    await expect(
      page.getByTestId('chat-message-model-2').first()
    ).toBeVisible();
  });

  await test.step('Run test cases', async () => {
    await page.getByRole('button', { name: 'Run Testcases' }).click();
    await expect(page.getByTestId('chat-message-user-3').first()).toBeVisible();
    await expect(
      page.getByTestId('chat-message-model-4').first()
    ).toBeVisible();
  });

  await test.step('Navigate to interview list and resume interview', async () => {
    await page.getByRole('link', { name: 'Interview' }).click();
    await expect(
      page.getByRole('button', { name: 'Resume' }).first()
    ).toBeVisible();

    await page.getByRole('button', { name: 'Resume' }).first().click();

    await expect(page.getByTestId('chat-message-user-1')).toBeVisible();
    await expect(page.getByTestId('chat-message-model-2')).toBeVisible();
    await expect(page.getByTestId('chat-message-user-3')).toBeVisible();
    await expect(page.getByTestId('chat-message-model-4')).toBeVisible();
  });

  await test.step('Navigate to interview list and delete interview', async () => {
    await page.getByRole('link', { name: 'Interview' }).click();
    await expect(
      page.getByRole('button', { name: 'Resume' }).first()
    ).toBeVisible();

    await expect(page.getByRole('button', { name: '×' }).first()).toBeVisible();

    const firstInterviewTitle = await page
      .getByRole('button', { name: 'View' })
      .first()
      .innerText();
    await page.getByRole('button', { name: '×' }).first().click();

    await expect(async () => {
      const currentFirstTitle = await page
        .getByRole('button', { name: 'View' })
        .first()
        .innerText();
      return currentFirstTitle !== firstInterviewTitle;
    }).toPass({ timeout: 2000 });
  });
});
