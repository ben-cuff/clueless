import { expect, test as teardown } from "@playwright/test";

teardown("deleteAccount", async ({ page }) => {
  await page.goto("http://localhost:3000/settings");
  await page.waitForTimeout(2000);
  page.once("dialog", (dialog) => {
    dialog.accept().catch(() => {});
  });
  await page.getByRole("button", { name: "Delete Account" }).click();

  await expect(page).toHaveURL(`/`);
  await expect(page.getByRole("button", { name: "?" })).toBeVisible();
});
