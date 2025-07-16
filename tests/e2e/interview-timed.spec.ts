import test, { expect } from '@playwright/test';
import TWO_SUM_SNAPSHOT from './constants/two-sum-snapshot';
import TWO_SUM_USER_RESPONSE from './constants/two-sum-user-response';

test('Interview two sum timed', async ({ page }) => {
  await test.step('Load interview question', async () => {
    await page.goto(
      'http://localhost:3000/interview/new?questionNumber=1&type=TIMED'
    );
    await expect(page.locator('body')).toMatchAriaSnapshot(TWO_SUM_SNAPSHOT);
  });

  await test.step('Check timer UI', async () => {
    expect(await page.getByTestId('timer')).toBeVisible();
    const timerBefore = await page.getByTestId('timer').innerText();
    await page.waitForTimeout(2000);
    const timerAfter = await page.getByTestId('timer').innerText();
    expect(timerAfter).not.toBe(timerBefore);
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

test('Interview two sum feedback', async ({ page }) => {
  await test.step('Load interview question', async () => {
    await page.goto(
      'http://localhost:3000/interview/new?questionNumber=1&type=TIMED'
    );
    await expect(page.locator('body')).toMatchAriaSnapshot(TWO_SUM_SNAPSHOT);
  });

  await test.step('Check timer UI', async () => {
    expect(await page.getByTestId('timer')).toBeVisible();
    const timerBefore = await page.getByTestId('timer').innerText();
    await page.waitForTimeout(2000);
    const timerAfter = await page.getByTestId('timer').innerText();
    expect(timerAfter).not.toBe(timerBefore);
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

  await test.step('Navigate to interview list and verify on correct page', async () => {
    await page.getByRole('link', { name: 'Interview' }).click();
    await expect(
      page.getByRole('button', { name: 'Start Random Timed Interview' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Start Random Interview' })
    ).toBeVisible();
    await expect(page).toHaveURL(/\/interview/);
  });

  await test.step('Navigate to interview feedback and verify', async () => {
    await expect(
      page.getByRole('button', { name: 'View' }).first()
    ).toBeVisible();
    await page.getByRole('button', { name: 'View Feedback' }).first().click();
    await expect(page).toHaveURL(/\/interview\/feedback/);
  });

  await test.step('Check feedback modal', async () => {
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

  await test.step('Navigate to back to interview list and delete interview', async () => {
    await page.getByRole('link', { name: 'Interview' }).click();
    await expect(
      page.getByRole('button', { name: 'View Feedback' }).first()
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
