import { expect, test } from "@playwright/test";

test("navigate-to-questions", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Questions" }).click();
  await expect(page.locator("body")).toMatchAriaSnapshot(`
    - heading "Questions" [level=1]
    - text: "Search:"
    - textbox "Search for questions..."
    - combobox: Select Difficulty
    - text: Select companies Select topics...
    - heading "1. Two Sum" [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/two-sum
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Hash Table
    - heading "2. Add Two Numbers" [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/add-two-numbers
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Linked List Math Recursion
    - heading "3. Longest Substring Without Repeating Characters" [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/longest-substring-without-repeating-characters
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Hash Table String Sliding Window
    - heading "4. Median of Two Sorted Arrays" [level=2]
    - text: Hard
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/median-of-two-sorted-arrays
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Binary Search Divide and Conquer
    - heading "5. Longest Palindromic Substring" [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/longest-palindromic-substring
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Two Pointers String Dynamic Programming
    - heading "6. Zigzag Conversion" [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/zigzag-conversion
      - img "leetcode-logo"
    - button "Start Interview"
    - text: String
    - heading "7. Reverse Integer" [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/reverse-integer
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Math
    - heading "8. String to Integer (atoi)" [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/string-to-integer-atoi
      - img "leetcode-logo"
    - button "Start Interview"
    - text: String
    - heading "9. Palindrome Number" [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/palindrome-number
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Math
    - heading /\\d+\\. Regular Expression Matching/ [level=2]
    - text: Hard
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/regular-expression-matching
      - img "leetcode-logo"
    - button "Start Interview"
    - text: String Dynamic Programming Recursion
    - heading /\\d+\\. Container With Most Water/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/container-with-most-water
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Greedy
    - heading /\\d+\\. Integer to Roman/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/integer-to-roman
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Hash Table Math String
    - heading /\\d+\\. Roman to Integer/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/roman-to-integer
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Hash Table Math String
    - heading /\\d+\\. Longest Common Prefix/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/longest-common-prefix
      - img "leetcode-logo"
    - button "Start Interview"
    - text: String Trie
    - heading /\\d+\\. 3Sum/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/3sum
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Sorting
    - heading /\\d+\\. 3Sum Closest/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/3sum-closest
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Sorting
    - heading /\\d+\\. Letter Combinations of a Phone Number/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/letter-combinations-of-a-phone-number
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Hash Table String Backtracking
    - heading /\\d+\\. 4Sum/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/4sum
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Sorting
    - heading /\\d+\\. Remove Nth Node From End of List/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/remove-nth-node-from-end-of-list
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Linked List Two Pointers
    - heading /\\d+\\. Valid Parentheses/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/valid-parentheses
      - img "leetcode-logo"
    - button "Start Interview"
    - text: String Stack
    - navigation "pagination":
      - list:
        - listitem
        - listitem: "1"
        - listitem: "2"
        - listitem: Next
    - button /\\d+ per page/
    `);
});

test("navigate-to-interview", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.getByRole("link", { name: "Interview" }).click();
  await expect(page.locator("body")).toContainText("Start Random Interview");
  await expect(
    page.getByRole("button", { name: "Start Random Interview" })
  ).toBeVisible();
});

test("navigate-home", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page.getByRole("link", { name: "Clueless" }).click();
  await expect(page).toHaveURL("/");
});

test("navigate-to-settings", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page
    .getByRole("banner")
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .click();
  await page.getByRole("menuitem", { name: "Settings" }).click();
  await expect(
    page.getByRole("button", { name: "Delete Account" })
  ).toBeVisible();
  await expect(page).toHaveURL("/settings");
});
