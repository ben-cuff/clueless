import { Interview } from "@/types/interview";

export default function InterviewCardDeleteButton({
  interview,
  handleDeleteInterview,
}: {
  interview: Interview;
  handleDeleteInterview: (userId: number, interviewId: string) => Promise<void>;
}) {
  return (
    <button
      className="absolute top-0 right-2 hover:text-red-500 text-lg font-bold hover:cursor-pointer rounded-full transition-colors"
      onClick={() => {
        handleDeleteInterview(interview.userId, interview.id);
      }}
    >
      ×
    </button>
  );
}
