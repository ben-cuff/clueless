import { QuestionPartial } from '@/types/question';

export const CORE_QUESTIONS: QuestionPartial[] = [
  {
    id: 1,
    title: 'Two Sum',
    accuracy: 55.76387512256778,
    topics: ['ARRAY', 'HASH_TABLE'],
    prompt:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.\n \nExample 1:\n\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n\nExample 2:\n\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n\nExample 3:\n\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n\n \nConstraints:\n\n2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109\nOnly one valid answer exists.\n\n \nFollow-up: Can you come up with an algorithm that is less than O(n2) time complexity?',
    companies: ['GOOGLE', 'AMAZON', 'MICROSOFT', 'BLOOMBERG'],
    difficulty: 1,
    createdAt: new Date('2025-07-07T22:19:05.631Z'),
    updatedAt: new Date('2025-07-07T22:25:02.208Z'),
    titleSlug: 'two-sum',
  },
  {
    id: 9,
    title: 'Palindrome Number',
    accuracy: 59.21505867434021,
    topics: ['MATH'],
    prompt:
      'Given an integer x, return true if x is a palindrome, and false otherwise.\n \nExample 1:\n\nInput: x = 121\nOutput: true\nExplanation: 121 reads as 121 from left to right and from right to left.\n\nExample 2:\n\nInput: x = -121\nOutput: false\nExplanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.\n\nExample 3:\n\nInput: x = 10\nOutput: false\nExplanation: Reads 01 from right to left. Therefore it is not a palindrome.\n\n \nConstraints:\n\n-231 <= x <= 231 - 1\n\n \nFollow up: Could you solve it without converting the integer to a string?',
    companies: [],
    difficulty: 1,
    createdAt: new Date('2025-07-07T22:19:06.600Z'),
    updatedAt: new Date('2025-07-07T22:19:06.600Z'),
    titleSlug: 'palindrome-number',
  },
  {
    id: 20,
    title: 'Valid Parentheses',
    accuracy: 42.31221714149291,
    topics: ['STRING', 'STACK'],
    prompt:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\nAn input string is valid if:\n\nOpen brackets must be closed by the same type of brackets.\nOpen brackets must be closed in the correct order.\nEvery close bracket has a corresponding open bracket of the same type.\n\n \nExample 1:\n\nInput: s = \"()\"\nOutput: true\n\nExample 2:\n\nInput: s = \"()[]{}\"\nOutput: true\n\nExample 3:\n\nInput: s = \"(]\"\nOutput: false\n\nExample 4:\n\nInput: s = \"([])\"\nOutput: true\n\n \nConstraints:\n\n1 <= s.length <= 104\ns consists of parentheses only '()[]{}'.\n\n",
    companies: ['BLOOMBERG', 'INTUIT'],
    difficulty: 1,
    createdAt: new Date('2025-07-07T22:19:07.706Z'),
    updatedAt: new Date('2025-07-07T22:25:09.040Z'),
    titleSlug: 'valid-parentheses',
  },
  {
    id: 144,
    title: 'Binary Tree Preorder Traversal',
    accuracy: 73.20494054111234,
    topics: ['STACK', 'TREE', 'DEPTH_FIRST_SEARCH', 'BINARY_TREE'],
    prompt:
      "Given the root of a binary tree, return the preorder traversal of its nodes' values.\n \nExample 1:\n\nInput: root = [1,null,2,3]\nOutput: [1,2,3]\nExplanation:\n\n\nExample 2:\n\nInput: root = [1,2,3,4,5,null,8,null,null,6,7,9]\nOutput: [1,2,4,5,6,7,3,8,9]\nExplanation:\n\n\nExample 3:\n\nInput: root = []\nOutput: []\n\nExample 4:\n\nInput: root = [1]\nOutput: [1]\n\n \nConstraints:\n\nThe number of nodes in the tree is in the range [0, 100].\n-100 <= Node.val <= 100\n\n \nFollow up: Recursive solution is trivial, could you do it iteratively?\n",
    companies: [],
    difficulty: 1,
    createdAt: new Date('2025-07-07T22:19:20.691Z'),
    updatedAt: new Date('2025-07-07T22:19:20.691Z'),
    titleSlug: 'binary-tree-preorder-traversal',
  },
  {
    id: 412,
    title: 'Fizz Buzz',
    accuracy: 74.36264742312456,
    topics: ['MATH', 'STRING', 'SIMULATION'],
    prompt:
      'Given an integer n, return a string array answer (1-indexed) where:\n\nanswer[i] == "FizzBuzz" if i is divisible by 3 and 5.\nanswer[i] == "Fizz" if i is divisible by 3.\nanswer[i] == "Buzz" if i is divisible by 5.\nanswer[i] == i (as a string) if none of the above conditions are true.\n\n \nExample 1:\nInput: n = 3\nOutput: ["1","2","Fizz"]\nExample 2:\nInput: n = 5\nOutput: ["1","2","Fizz","4","Buzz"]\nExample 3:\nInput: n = 15\nOutput: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]\n\n \nConstraints:\n\n1 <= n <= 104\n\n',
    companies: [],
    difficulty: 1,
    createdAt: new Date('2025-07-07T22:19:46.918Z'),
    updatedAt: new Date('2025-07-07T22:19:46.918Z'),
    titleSlug: 'fizz-buzz',
  },
];
