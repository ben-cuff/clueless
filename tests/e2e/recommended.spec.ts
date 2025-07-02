import test, { expect } from "@playwright/test";

test("recommended questions appearing", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await expect(
    page.getByRole("heading", { name: "Recommended Questions" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Hide Recommended" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Hide Recommended" }).click();
  await expect(
    page.getByRole("button", { name: "Show Recommended" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Show Recommended" }).click();
  await expect(
    page.getByRole("heading", { name: "Recommended Questions" })
  ).toBeVisible();
  await expect(
    page
      .locator(
        ".inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.rounded-md.text-sm.font-medium.transition-all.disabled\\:pointer-events-none.disabled\\:opacity-50.\\[\\&_svg\\]\\:pointer-events-none.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4.shrink-0.\\[\\&_svg\\]\\:shrink-0.outline-none.focus-visible\\:border-ring.focus-visible\\:ring-ring\\/50.focus-visible\\:ring-\\[3px\\].aria-invalid\\:ring-destructive\\/20.dark\\:aria-invalid\\:ring-destructive\\/40.aria-invalid\\:border-destructive.bg-primary"
      )
      .first()
  ).toBeVisible();
});
