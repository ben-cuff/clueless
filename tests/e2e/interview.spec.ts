import test, { expect } from "@playwright/test";

test("Interview two sum", async ({ page }) => {
  await page.goto("http://localhost:3000/interview/new?questionNumber=1");
  await expect(page.locator("body")).toMatchAriaSnapshot(`
      - text: Question 1 Easy
      - heading "Two Sum" [level=2]
      - paragraph: "/Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target\\\\. You may assume that each input would have exactly one solution, and you may not use the same element twice\\\\. You can return the answer in any order\\\\. Example 1: Input: nums = \\\\[\\\\d+,\\\\d+,\\\\d+,\\\\d+\\\\], target = 9 Output: \\\\[\\\\d+,\\\\d+\\\\] Explanation: Because nums\\\\[0\\\\] \\\\+ nums\\\\[1\\\\] == 9, we return \\\\[0, 1\\\\]\\\\. Example 2: Input: nums = \\\\[\\\\d+,\\\\d+,4\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\] Example 3: Input: nums = \\\\[\\\\d+,\\\\d+\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\] Constraints: 2 <= nums\\\\.length <= \\\\d+ -\\\\d+ <= nums\\\\[i\\\\] <= \\\\d+ -\\\\d+ <= target <= \\\\d+ Only one valid answer exists\\\\. Follow-up: Can you come up with an algorithm that is less than O\\\\(n2\\\\) time complexity\\\\?/"
      `);

  await expect(page.locator("body")).toMatchAriaSnapshot(`
      - text: AI
      - paragraph: Welcome to the interview! Before we begin, do you have any questions? When you're ready, please talk through your approach to the problem before you start coding. Explaining your thought process and communication skills are an important part of the interview.
      - textbox "Your message here"
      - button "Submit"
      `);
  await expect(
    page.getByRole("textbox", { name: "Your message here" })
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Your message here" })
    .fill(
      "Problem Recap\nGiven an array of integers and a target sum, find two distinct indices in the array such that the numbers at those indices add up to the target. Return the indices.\nStep-by-Step Solution Approach\n1. Understand the Problem\nInput: An array of integers, e.g., [2, 7, 11, 15], and a target sum, e.g., 9.\nOutput: Indices of two numbers that add up to the target, e.g., [0, 1] because 2 + 7 = 9.\n2. Brute Force Approach\nFor each element, check every other element to see if their sum equals the target.\nThis is simple but inefficient (O(n²) time complexity).\n3. Optimized Approach\nUse a hash map (dictionary) to store numbers and their indices as we iterate through the array.\nFor each number, calculate its complement (target - current number).\nCheck if the complement exists in the hash map:\nIf yes, we found the pair.\nIf no, add the current number and its index to the hash map.\nThis approach reduces the time complexity to O(n).\n4. Edge Cases\nWhat if there are duplicate numbers?\nWhat if no solution exists?\nWhat if the array is empty or has only one element?\n5. Return Value\nReturn the indices as soon as a valid pair is found.\nIf no pair is found, decide whether to return an empty list, None, or raise an exception (based on requirements).\nSummary:\nI would solve Two Sum by iterating through the array once, using a hash map to track previously seen numbers and their indices, and checking for the complement at each step. This ensures an efficient and clear solution."
    );
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByTestId("chat-message-user-1")
      .first()
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-2")
      .first()
  ).toBeVisible();

  await page.getByRole("button", { name: "Run Testcases" }).click();
  await expect(
    page.getByTestId("chat-message-user-3").first()
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-4").first()
  ).toBeVisible();

  await page.getByRole("link", { name: "Interview" }).click();

  await page.waitForTimeout(2000);

  await expect(
    page.getByRole("button", { name: "View" }).first()
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "×" }).first()).toBeVisible();

  const firstInterviewTitle = await page
    .getByRole("button", { name: "View" })
    .first()
    .innerText();
  await page.getByRole("button", { name: "×" }).first().click();

  await expect(async () => {
    const currentFirstTitle = await page
      .getByRole("button", { name: "View" })
      .first()
      .innerText();
    return currentFirstTitle !== firstInterviewTitle;
  }).toPass({ timeout: 2000 });
});

test("interview two sum early complete", async ({ page }) => {
  await page.goto("http://localhost:3000/interview/new?questionNumber=1");
  await expect(page.locator("body")).toMatchAriaSnapshot(`
            - text: Question 1 Easy
            - heading "Two Sum" [level=2]
            - paragraph: "/Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target\\\\. You may assume that each input would have exactly one solution, and you may not use the same element twice\\\\. You can return the answer in any order\\\\. Example 1: Input: nums = \\\\[\\\\d+,\\\\d+,\\\\d+,\\\\d+\\\\], target = 9 Output: \\\\[\\\\d+,\\\\d+\\\\] Explanation: Because nums\\\\[0\\\\] \\\\+ nums\\\\[1\\\\] == 9, we return \\\\[0, 1\\\\]\\\\. Example 2: Input: nums = \\\\[\\\\d+,\\\\d+,4\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\] Example 3: Input: nums = \\\\[\\\\d+,\\\\d+\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\] Constraints: 2 <= nums\\\\.length <= \\\\d+ -\\\\d+ <= nums\\\\[i\\\\] <= \\\\d+ -\\\\d+ <= target <= \\\\d+ Only one valid answer exists\\\\. Follow-up: Can you come up with an algorithm that is less than O\\\\(n2\\\\) time complexity\\\\?/"
            `);
  await page.locator(".bg-card.text-card-foreground").click();
  await expect(page.locator("body")).toMatchAriaSnapshot(`
            - text: AI
            - paragraph: Welcome to the interview! Before we begin, do you have any questions? When you're ready, please talk through your approach to the problem before you start coding. Explaining your thought process and communication skills are an important part of the interview.
            - textbox "Your message here"
            - button "Submit"
            `);
  await expect(
    page.getByRole("textbox", { name: "Your message here" })
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Your message here" })
    .fill(
      "Problem Recap\nGiven an array of integers and a target sum, find two distinct indices in the array such that the numbers at those indices add up to the target. Return the indices.\nStep-by-Step Solution Approach\n1. Understand the Problem\nInput: An array of integers, e.g., [2, 7, 11, 15], and a target sum, e.g., 9.\nOutput: Indices of two numbers that add up to the target, e.g., [0, 1] because 2 + 7 = 9.\n2. Brute Force Approach\nFor each element, check every other element to see if their sum equals the target.\nThis is simple but inefficient (O(n²) time complexity).\n3. Optimized Approach\nUse a hash map (dictionary) to store numbers and their indices as we iterate through the array.\nFor each number, calculate its complement (target - current number).\nCheck if the complement exists in the hash map:\nIf yes, we found the pair.\nIf no, add the current number and its index to the hash map.\nThis approach reduces the time complexity to O(n).\n4. Edge Cases\nWhat if there are duplicate numbers?\nWhat if no solution exists?\nWhat if the array is empty or has only one element?\n5. Return Value\nReturn the indices as soon as a valid pair is found.\nIf no pair is found, decide whether to return an empty list, None, or raise an exception (based on requirements).\nSummary:\nI would solve Two Sum by iterating through the array once, using a hash map to track previously seen numbers and their indices, and checking for the complement at each step. This ensures an efficient and clear solution."
    );
  await page.getByRole("button", { name: "Submit" }).click();

  await expect(
    page.getByTestId("chat-message-user-1").first()
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-2").first()
  ).toBeVisible();

  await page.getByRole("button", { name: "Run Testcases" }).click();
  await expect(
    page.getByTestId("chat-message-user-3").first()
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-4").first()
  ).toBeVisible();

  await page.getByRole("button", { name: "End Interview Early" }).click();
  await expect(page.getByRole("dialog", { name: "Feedback" })).toBeVisible();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Close" }).click();
  await expect(
    page.getByRole("button", { name: "Open Feedback" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Open Feedback" }).click();
  await expect(page.getByRole("dialog", { name: "Feedback" })).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("link", { name: "Interview" }).click();
  await expect(
    page.getByRole("button", { name: "View Feedback" }).first()
  ).toBeVisible();

  await expect(page.getByRole("button", { name: "×" }).first()).toBeVisible();

  const firstInterviewTitle = await page
    .getByRole("button", { name: "View" })
    .first()
    .innerText();
  await page.getByRole("button", { name: "×" }).first().click();

  await expect(async () => {
    const currentFirstTitle = await page
      .getByRole("button", { name: "View" })
      .first()
      .innerText();
    return currentFirstTitle !== firstInterviewTitle;
  }).toPass({ timeout: 2000 });
});

test("interview two sum resume and delete", async ({ page }) => {
  await page.goto("http://localhost:3000/interview/new?questionNumber=1");
  await expect(page.locator("body")).toMatchAriaSnapshot(`
            - text: Question 1 Easy
            - heading "Two Sum" [level=2]
            - paragraph: "/Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target\\\\. You may assume that each input would have exactly one solution, and you may not use the same element twice\\\\. You can return the answer in any order\\\\. Example 1: Input: nums = \\\\[\\\\d+,\\\\d+,\\\\d+,\\\\d+\\\\], target = 9 Output: \\\\[\\\\d+,\\\\d+\\\\] Explanation: Because nums\\\\[0\\\\] \\\\+ nums\\\\[1\\\\] == 9, we return \\\\[0, 1\\\\]\\\\. Example 2: Input: nums = \\\\[\\\\d+,\\\\d+,4\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\] Example 3: Input: nums = \\\\[\\\\d+,\\\\d+\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\] Constraints: 2 <= nums\\\\.length <= \\\\d+ -\\\\d+ <= nums\\\\[i\\\\] <= \\\\d+ -\\\\d+ <= target <= \\\\d+ Only one valid answer exists\\\\. Follow-up: Can you come up with an algorithm that is less than O\\\\(n2\\\\) time complexity\\\\?/"
            `);
  await page.locator(".bg-card.text-card-foreground").click();
  await expect(page.locator("body")).toMatchAriaSnapshot(`
            - text: AI
            - paragraph: Welcome to the interview! Before we begin, do you have any questions? When you're ready, please talk through your approach to the problem before you start coding. Explaining your thought process and communication skills are an important part of the interview.
            - textbox "Your message here"
            - button "Submit"
            `);
  await page.getByRole("textbox", { name: "Your message here" }).click();
  await page
    .getByRole("textbox", { name: "Your message here" })
    .fill(
      "Problem Recap\nGiven an array of integers and a target sum, find two distinct indices in the array such that the numbers at those indices add up to the target. Return the indices.\nStep-by-Step Solution Approach\n1. Understand the Problem\nInput: An array of integers, e.g., [2, 7, 11, 15], and a target sum, e.g., 9.\nOutput: Indices of two numbers that add up to the target, e.g., [0, 1] because 2 + 7 = 9.\n2. Brute Force Approach\nFor each element, check every other element to see if their sum equals the target.\nThis is simple but inefficient (O(n²) time complexity).\n3. Optimized Approach\nUse a hash map (dictionary) to store numbers and their indices as we iterate through the array.\nFor each number, calculate its complement (target - current number).\nCheck if the complement exists in the hash map:\nIf yes, we found the pair.\nIf no, add the current number and its index to the hash map.\nThis approach reduces the time complexity to O(n).\n4. Edge Cases\nWhat if there are duplicate numbers?\nWhat if no solution exists?\nWhat if the array is empty or has only one element?\n5. Return Value\nReturn the indices as soon as a valid pair is found.\nIf no pair is found, decide whether to return an empty list, None, or raise an exception (based on requirements).\nSummary:\nI would solve Two Sum by iterating through the array once, using a hash map to track previously seen numbers and their indices, and checking for the complement at each step. This ensures an efficient and clear solution."
    );
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByTestId("chat-message-user-1").first()
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-2").first()
  ).toBeVisible();

  await page.getByRole("button", { name: "Run Testcases" }).click();
  await expect(
    page.getByTestId("chat-message-user-3").first()
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-4").first()
  ).toBeVisible();

  await page.getByRole("link", { name: "Interview" }).click();
  await expect(
    page.getByRole("button", { name: "Resume" }).first()
  ).toBeVisible();

  await page.getByRole("button", { name: "Resume" }).first().click();

  await expect(
    page.getByTestId("chat-message-user-1")
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-2")
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-user-3")
  ).toBeVisible();
  await expect(
    page.getByTestId("chat-message-model-4")
  ).toBeVisible();

  await page.getByRole("link", { name: "Interview" }).click();
  await expect(
    page.getByRole("button", { name: "Resume" }).first()
  ).toBeVisible();

  await expect(page.getByRole("button", { name: "×" }).first()).toBeVisible();

  const firstInterviewTitle = await page
    .getByRole("button", { name: "View" })
    .first()
    .innerText();
  await page.getByRole("button", { name: "×" }).first().click();

  await expect(async () => {
    const currentFirstTitle = await page
      .getByRole("button", { name: "View" })
      .first()
      .innerText();
    return currentFirstTitle !== firstInterviewTitle;
  }).toPass({ timeout: 2000 });
});
