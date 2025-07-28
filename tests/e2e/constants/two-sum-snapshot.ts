const TWO_SUM_SNAPSHOT = `
    - text: Question 1 Easy
    - heading "Two Sum" [level=2]
    - paragraph:
      - strong:
        - text: Given an array of integers
        - code: nums
        - text: and an integer
        - code: target
        - text: ", return indices of the two numbers such that they add up to"
        - code: target
        - text: .
      - text: You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.
      - strong: "Example 1:"
      - text: "/Input: nums = \\\\[\\\\d+,\\\\d+,\\\\d+,\\\\d+\\\\], target = 9 Output: \\\\[\\\\d+,\\\\d+\\\\]/"
      - strong: "Explanation:"
      - paragraph: Because nums[0] + nums[1] == 9, we return [0, 1].
      - strong: "Example 2:"
      - text: "/Input: nums = \\\\[\\\\d+,\\\\d+,4\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\]/"
      - strong: "Example 3:"
      - text: "/Input: nums = \\\\[\\\\d+,\\\\d+\\\\], target = 6 Output: \\\\[\\\\d+,\\\\d+\\\\]/"
      - strong: "Constraints:"
      - text: /2 <= nums\\.length <= \\d+/
      - superscript: "4"
      - text: /-\\d+/
      - superscript: "9"
      - text: /<= nums\\[i\\] <= \\d+/
      - superscript: "9"
      - text: /-\\d+/
      - superscript: "9"
      - text: /<= target <= \\d+/
      - superscript: "9"
      - text: Only one valid answer exists.
      - strong: "Follow-up:"
      - text: Can you come up with an algorithm that is less than O(n
      - superscript: "2"
      - text: ) time complexity?
      `;

export default TWO_SUM_SNAPSHOT;
