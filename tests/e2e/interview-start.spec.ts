import test, { expect } from "@playwright/test";

test("Interview start", async ({ page }) => {
  await page.goto("http://localhost:3000/interview");

  await test.step("Verify start interview button is visible and clickable", async () => {
    await expect(
      page.getByRole("button", { name: "Start Random Interview" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Start Random Interview" }).click();
  });

  await test.step("Verify interview page is loaded", async () => {
    await expect(
      page.getByRole("button", { name: "Run Testcases" })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Your message here" })
    ).toBeVisible();
    await expect(
      page.getByRole("combobox").filter({ hasText: "Python (3.8.1)" })
    ).toBeVisible();
  });
});
