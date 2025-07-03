import test, { expect } from "@playwright/test";

test("recommended questions appearing", async ({ page }) => {
  await test.step("Navigate to questions page and verify recommended questions", async () => {
    await page.goto("http://localhost:3000/questions");
    await expect(
      page.getByRole("heading", { name: "Recommended Questions" })
    ).toBeVisible();
  });
  
  await test.step("Hide recommended questions", async () => {
    await expect(
      page.getByRole("button", { name: "Hide Recommended" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Hide Recommended" }).click();
  });

  await test.step("Verify recommended questions are hidden", async () => {
    await expect(
      page.getByRole("heading", { name: "Recommended Questions" })
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Show Recommended" })
    ).toBeVisible();
  });

  await test.step("Show recommended questions", async () => {
    await page.getByRole("button", { name: "Show Recommended" }).click();
  });

  await test.step("Verify recommended questions are visible again", async () => {
    await expect(
      page.getByRole("heading", { name: "Recommended Questions" })
    ).toBeVisible();
  });
});
