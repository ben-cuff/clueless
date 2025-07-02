import { expect, test } from "@playwright/test";

test("questions-initial-load", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await expect(page.locator("body")).toContainText("1. Two Sum");
  await expect(page.locator("body")).toContainText("2. Add Two Numbers");
  await expect(page.locator("body")).toContainText(
    "3. Longest Substring Without Repeating Characters"
  );
  await expect(page.locator("body")).toContainText(
    "4. Median of Two Sorted Arrays"
  );
  await expect(page.locator("body")).toContainText(
    "5. Longest Palindromic Substring"
  );
});

test("questions-search", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page
    .getByRole("textbox", { name: "Search for questions..." })
    .fill("two sum");
  await page.waitForTimeout(1000);
  await expect(page.locator("body")).toContainText("1. Two Sum");
  await expect(page.locator("body")).toContainText(
    "167. Two Sum II - Input Array Is Sorted"
  );
  await expect(page.locator("body")).toContainText(
    "170. Two Sum III - Data structure design"
  );
  await expect(page.locator("body")).toContainText(
    "653. Two Sum IV - Input is a BST"
  );
  await expect(page.locator("body")).toContainText("1099. Two Sum Less Than K");
});

test("questions-filter-by-topics", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page
    .locator("div")
    .filter({ hasText: "Select topics..." })
    .nth(4)
    .click();
  await page.getByRole("option", { name: "Array", exact: true }).click();
  await page
    .getByRole("option", { name: "Binary Search", exact: true })
    .click();
  await page.waitForTimeout(1000);
  await expect(page.locator("body")).toContainText("1. Two Sum");
  await expect(page.locator("body")).toContainText(
    "4. Median of Two Sorted Arrays"
  );
  await expect(page.locator("body")).toContainText(
    "11. Container With Most Water"
  );
  await expect(page.locator("body")).toContainText("15. 3Sum");
  await expect(page.locator("body")).toContainText("16. 3Sum Closest");
});

test("questions-filter-by-difficulty", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Medium" }).click();
  await page.waitForTimeout(1000);
  await expect(page.locator("body")).toContainText("2. Add Two Numbers");
  await expect(page.locator("body")).toContainText(
    "3. Longest Substring Without Repeating Characters"
  );
  await expect(page.locator("body")).toContainText(
    "5. Longest Palindromic Substring"
  );
  await expect(page.locator("body")).toContainText("6. Zigzag Conversion");
  await expect(page.locator("body")).toContainText("7. Reverse Integer");
  await expect(page.locator("body")).not.toContainText("1. Two Sum");
});

test("questions-pagination", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "per page" }).click();
  await page.getByRole("menuitem", { name: "100" }).click();
  await expect(page.getByText("100. Same TreeEasyStart")).toBeVisible();
});

test("questions-pagination-next-previous", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await expect(page.locator("body")).toContainText("1. Two Sum");
  await expect(page.locator("body")).toContainText("2. Add Two Numbers");
  await expect(page.locator("body")).toContainText(
    "3. Longest Substring Without Repeating Characters"
  );
  await expect(page.locator("body")).toContainText(
    "4. Median of Two Sorted Arrays"
  );
  await expect(page.locator("body")).toContainText(
    "5. Longest Palindromic Substring"
  );
  await page.getByLabel("Go to next page").click();
  await expect(page.locator("body")).toContainText(
    "21. Merge Two Sorted Lists"
  );
  await expect(page.locator("body")).toContainText("22. Generate Parentheses");
  await expect(page.locator("body")).toContainText("23. Merge k Sorted Lists");
  await expect(page.locator("body")).toContainText("24. Swap Nodes in Pairs");
  await expect(page.locator("body")).toContainText(
    "25. Reverse Nodes in k-Group"
  );
  await page.getByLabel("Go to previous page").click();
  await expect(page.locator("body")).toContainText("1. Two Sum");
  await expect(page.locator("body")).toContainText("2. Add Two Numbers");
  await expect(page.locator("body")).toContainText(
    "3. Longest Substring Without Repeating Characters"
  );
  await expect(page.locator("body")).toContainText(
    "4. Median of Two Sorted Arrays"
  );
  await expect(page.locator("body")).toContainText(
    "5. Longest Palindromic Substring"
  );
});

test("questions-leetcode-link", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  const page1Promise = page.waitForEvent("popup");
  await page;
  await page
    .locator("div")
    .filter({
      hasText:
        /^1\. Two SumEasyGoogle, Amazon, Microsoft, BloombergStart InterviewArrayHash Table$/,
    })
    .getByRole("link")
    .click();
  const page1 = await page1Promise;
  await expect(page1).toHaveURL(
    /https:\/\/leetcode\.com\/problems\/two-sum(\/description)?/
  );
});

test("questions-start-interview", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page
    .locator("div")
    .filter({
      hasText:
        /^1\. Two SumEasyGoogle, Amazon, Microsoft, BloombergStart InterviewArrayHash Table$/,
    })
    .getByRole("button", { name: "Start" })
    .click();
  await expect(page).toHaveURL("/interview/new?questionNumber=1");
});
