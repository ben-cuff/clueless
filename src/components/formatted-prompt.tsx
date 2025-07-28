import React from 'react';

// this function adds line breaks after certain keywords like Example, Explanation or Constraints
// Needs to use react fragments as new lines will not persist otherwise
//
// Example:
// Input: "Given an array nums, find all unique triplets. Example 1: Input: nums = [-1,0,1,2,-1,-4] Explanation: The triplets are [-1,0,1] and [-1,-1,2]. Constraints: 3 <= nums.length <= 3000"
// Output: "Given an array nums, find all unique triplets.
// Example 1: Input: nums = [-1,0,1,2,-1,-4]
// Explanation: The triplets are [-1,0,1] and [-1,-1,2].
// Constraints: 3 <= nums.length <= 3000"
function formatPromptWithBreaks(prompt: string) {
  return (prompt || 'No prompt found')
    .replace(/(Example \d+:|Explanation:|Constraints:)/g, '\n$1')
    .split(/\n+/)
    .map((line, idx, arr) => (
      <React.Fragment key={idx}>
        {line}
        {idx < arr.length - 1 && <br />}
      </React.Fragment>
    ));
}

function getTwoSumFormattedPrompt() {
  return (
    <>
      <strong>
        Given an array of integers <code>nums</code> and an integer{' '}
        <code>target</code>, return indices of the two numbers such that they
        add up to <code>target</code>.
      </strong>
      <br />
      You may assume that each input would have exactly one solution, and you
      may not use the same element twice.
      <br />
      You can return the answer in any order.
      <br />
      <br />
      <strong>Example 1:</strong>
      <pre className="whitespace-pre-wrap bg-gray-300 dark:bg-gray-800 p-2 rounded">
        Input: nums = [2,7,11,15], target = 9 Output: [0,1]
      </pre>
      <strong>Explanation: </strong>
      <p>Because nums[0] + nums[1] == 9, we return [0, 1].</p>
      <strong>Example 2:</strong>
      <pre className="whitespace-pre-wrap bg-gray-300 dark:bg-gray-800 p-2 rounded">
        Input: nums = [3,2,4], target = 6 Output: [1,2]
      </pre>
      <strong>Example 3:</strong>
      <pre className="whitespace-pre-wrap bg-gray-300 dark:bg-gray-800 p-2 rounded">
        Input: nums = [3,3], target = 6 Output: [0,1]
      </pre>
      <br />
      <strong>Constraints:</strong>
      <br />2 &lt;= nums.length &lt;= 10<sup>4</sup>
      <br />
      -10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup>
      <br />
      -10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup>
      <br />
      Only one valid answer exists.
      <br />
      <br />
      <strong>Follow-up:</strong> Can you come up with an algorithm that is less
      than O(n<sup>2</sup>) time complexity?
    </>
  );
}

export default formatPromptWithBreaks;

export { getTwoSumFormattedPrompt };
