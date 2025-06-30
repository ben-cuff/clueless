import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useFeedback from "@/hooks/use-feedback";

export default function FeedbackModal({
  interviewId,
}: {
  interviewId: string;
}) {
  const { isModalOpen, toggleModal } = useFeedback(interviewId);

  return (
    <>
      <Button onClick={toggleModal} className="fixed top-20 left-4 z-50">
        Open Feedback
      </Button>
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Please provide your feedback below.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
