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
export default function formatPromptWithBreaks(prompt: string) {
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
