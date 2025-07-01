import { expect, test } from "@playwright/test";

test("questions-initial-load", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
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

test("questions-search", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page
    .getByRole("textbox", { name: "Search for questions..." })
    .fill("two sum");
  await page.waitForTimeout(3000);
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
    - heading /\\d+\\. Two Sum II - Input Array Is Sorted/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/two-sum-ii-input-array-is-sorted
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Binary Search
    - heading /\\d+\\. Two Sum III - Data structure design/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/two-sum-iii-data-structure-design
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Hash Table Two Pointers Design Data Stream
    - heading /\\d+\\. Two Sum IV - Input is a BST/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/two-sum-iv-input-is-a-bst
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Hash Table Two Pointers Tree Depth First Search Breadth First Search Binary Search Tree Binary Tree
    - heading /\\d+\\. Two Sum Less Than K/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/two-sum-less-than-k
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Binary Search Sorting
    - heading /\\d+\\. Two Sum BSTs/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/two-sum-bsts
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Two Pointers Binary Search Stack Tree Depth First Search Binary Search Tree Binary Tree
    - heading /\\d+\\. Sum of Two Integers/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/sum-of-two-integers
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Math Bit Manipulation
    - heading /\\d+\\. Minimum Index Sum of Two Lists/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/minimum-index-sum-of-two-lists
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Hash Table String
    - heading /\\d+\\. Maximum Sum of Two Non-Overlapping Subarrays/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Dynamic Programming Sliding Window
    - heading /\\d+\\. Convert Integer to the Sum of Two No-Zero Integers/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/convert-integer-to-the-sum-of-two-no-zero-integers
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Math
    - heading /\\d+\\. Minimum Equal Sum of Two Arrays After Replacing Zeros/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/minimum-equal-sum-of-two-arrays-after-replacing-zeros
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Greedy
    - heading /\\d+\\. Minimum ASCII Delete Sum for Two Strings/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings
      - img "leetcode-logo"
    - button "Start Interview"
    - text: String Dynamic Programming
    - heading /\\d+\\. Minimize Product Sum of Two Arrays/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/minimize-product-sum-of-two-arrays
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Greedy Sorting
    - heading /\\d+\\. Minimum XOR Sum of Two Arrays/ [level=2]
    - text: Hard
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/minimum-xor-sum-of-two-arrays
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Dynamic Programming Bit Manipulation Bitmask
    - heading /\\d+\\. Partition Array Into Two Arrays to Minimize Sum Difference/ [level=2]
    - text: Hard
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Two Pointers Binary Search Dynamic Programming Bit Manipulation Ordered Set Bitmask
    - heading /\\d+\\. Merge Two 2D Arrays by Summing Values/ [level=2]
    - text: Easy
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/merge-two-2d-arrays-by-summing-values
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Hash Table Two Pointers
    - heading /\\d+\\. Find Two Non-overlapping Sub-arrays Each With Target Sum/ [level=2]
    - text: Medium
    - link "leetcode-logo":
      - /url: https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum
      - img "leetcode-logo"
    - button "Start Interview"
    - text: Array Hash Table Binary Search Dynamic Programming Sliding Window
    - navigation "pagination":
      - list:
        - listitem
        - listitem: "1"
        - listitem
    - button /\\d+ per page/
    `);
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
  await page.waitForTimeout(3000);
  await expect(page.locator("body")).toMatchAriaSnapshot(`
      - heading "Questions" [level=1]
      - text: "Search:"
      - textbox "Search for questions..."
      - combobox: Select Difficulty
      - text: Select companies Array
      - button
      - text: Binary Search
      - button
      - heading "1. Two Sum" [level=2]
      - text: Easy
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/two-sum
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Hash Table
      - heading "4. Median of Two Sorted Arrays" [level=2]
      - text: Hard
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/median-of-two-sorted-arrays
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Binary Search Divide and Conquer
      - heading /\\d+\\. Container With Most Water/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/container-with-most-water
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers Greedy
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
      - heading /\\d+\\. 4Sum/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/4sum
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers Sorting
      - heading /\\d+\\. Remove Duplicates from Sorted Array/ [level=2]
      - text: Easy
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/remove-duplicates-from-sorted-array
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers
      - heading /\\d+\\. Remove Element/ [level=2]
      - text: Easy
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/remove-element
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers
      - heading /\\d+\\. Next Permutation/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/next-permutation
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers
      - heading /\\d+\\. Search in Rotated Sorted Array/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/search-in-rotated-sorted-array
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Binary Search
      - heading /\\d+\\. Find First and Last Position of Element in Sorted Array/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Binary Search
      - heading /\\d+\\. Search Insert Position/ [level=2]
      - text: Easy
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/search-insert-position
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Binary Search
      - heading /\\d+\\. Valid Sudoku/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/valid-sudoku
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Hash Table Matrix
      - heading /\\d+\\. Sudoku Solver/ [level=2]
      - text: Hard
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/sudoku-solver
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Hash Table Backtracking Matrix
      - heading /\\d+\\. Combination Sum/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/combination-sum
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Backtracking
      - heading /\\d+\\. Combination Sum II/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/combination-sum-ii
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Backtracking
      - heading /\\d+\\. First Missing Positive/ [level=2]
      - text: Hard
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/first-missing-positive
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Hash Table
      - heading /\\d+\\. Trapping Rain Water/ [level=2]
      - text: Hard
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/trapping-rain-water
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers Dynamic Programming Stack Monotonic Stack
      - heading /\\d+\\. Jump Game II/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/jump-game-ii
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Dynamic Programming Greedy
      - heading /\\d+\\. Permutations/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/permutations
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Backtracking
      - navigation "pagination":
        - list:
          - listitem
          - listitem: "1"
          - listitem: "2"
          - listitem: Next
      - button /\\d+ per page/
      `);
});

test("questions-filter-by-difficulty", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Medium" }).click();
  await expect(page.locator("body")).toMatchAriaSnapshot(`
      - heading "Questions" [level=1]
      - text: "Search:"
      - textbox "Search for questions..."
      - combobox: Medium
      - text: Select companies Select topics...
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
      - heading /\\d+\\. Generate Parentheses/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/generate-parentheses
        - img "leetcode-logo"
      - button "Start Interview"
      - text: String Dynamic Programming Backtracking
      - heading /\\d+\\. Swap Nodes in Pairs/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/swap-nodes-in-pairs
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Linked List Recursion
      - heading /\\d+\\. Divide Two Integers/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/divide-two-integers
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Math Bit Manipulation
      - heading /\\d+\\. Next Permutation/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/next-permutation
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Two Pointers
      - heading /\\d+\\. Search in Rotated Sorted Array/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/search-in-rotated-sorted-array
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Binary Search
      - heading /\\d+\\. Find First and Last Position of Element in Sorted Array/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Binary Search
      - heading /\\d+\\. Valid Sudoku/ [level=2]
      - text: Medium
      - link "leetcode-logo":
        - /url: https://leetcode.com/problems/valid-sudoku
        - img "leetcode-logo"
      - button "Start Interview"
      - text: Array Hash Table Matrix
      - navigation "pagination":
        - list:
          - listitem
          - listitem: "1"
          - listitem: "2"
          - listitem: Next
      - button /\\d+ per page/
      `);
});

test("questions-pagination", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await page.getByRole("button", { name: "per page" }).click();
  await page.getByRole("menuitem", { name: "100" }).click();
  await expect(page.getByText("100. Same TreeEasyStart")).toBeVisible();
});

test("questions-pagination-next-previous", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await expect(page.getByText("1. Two SumEasyStart")).toBeVisible();
  await page.getByLabel("Go to next page").click();
  await expect(
    page.getByText(
      "Merge Two Sorted ListsEasyStart InterviewLinked ListRecursion"
    )
  ).toBeVisible();
  await page.getByLabel("Go to previous page").click();
  await expect(page.getByText("1. Two SumEasyStart")).toBeVisible();
});

test("questions-leetcode-link", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^1\. Two SumEasyStart InterviewArrayHash Table$/ })
      .getByRole("link")
  ).toBeVisible();
  const page1Promise = page.waitForEvent("popup");
  await page
    .locator("div")
    .filter({ hasText: /^1\. Two SumEasyStart InterviewArrayHash Table$/ })
    .getByRole("link")
    .click();
  const page1 = await page1Promise;
  await expect(page1).toHaveURL(
    "https://leetcode.com/problems/two-sum/description/"
  );
});

test("questions-start-interview", async ({ page }) => {
  await page.goto("http://localhost:3000/questions");
  await expect(
    page
      .locator("div")
      .filter({ hasText: /^1\. Two SumEasyStart InterviewArrayHash Table$/ })
      .getByRole("button")
  ).toBeVisible();
  await page
    .locator("div")
    .filter({ hasText: /^1\. Two SumEasyStart InterviewArrayHash Table$/ })
    .getByRole("button")
    .click();
  await expect(page).toHaveURL("/interview/new?questionNumber=1");
});
