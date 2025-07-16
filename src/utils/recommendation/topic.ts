import { InterviewWithFeedback } from "@/types/interview";

/**  ["Arrays", "Trees"] feedbackNumber: 2
 *   ["Dynamic Programming", "Arrays"] feedbackNumber: 3
 *
 *   - Arrays: (1/3 + 1/4)/2 = 0.292
 *   - Trees: (1/3)/1 = 0.333
 *   - Dynamic Programming: (1/4)/1 = 0.25
 *
 * higher weight means user has performed worse on that topic
 */
function getTopicWeights(
  interviews: InterviewWithFeedback[]
): Map<string, number> {
  const topicWeights = new Map<string, number>();
  const topicCounts = new Map<string, number>();

  interviews.forEach((interview) => {
    const weight = 1 / ((interview?.feedback?.feedbackNumber ?? 0) + 1);

    interview.question.topics.forEach((topic) => {
      const currentCount = topicCounts.get(topic) ?? 0;
      topicCounts.set(topic, currentCount + 1);

      const currentWeight = topicWeights.get(topic) ?? 0;
      topicWeights.set(topic, currentWeight + weight);
    });
  });

  for (const [topic, weight] of topicWeights.entries()) {
    const count = topicCounts.get(topic) ?? 1;
    topicWeights.set(topic, weight / count);
  }

  return topicWeights;
}

export { getTopicWeights };
