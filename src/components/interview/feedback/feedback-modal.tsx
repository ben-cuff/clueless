import LoadingSpinner from '@/components/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useFeedback from '@/hooks/use-feedback';
import FeedbackContent from './feedback-content';
import FeedbackError from './feedback-error';

export default function FeedbackModal({
  interviewId,
}: {
  interviewId: string;
}) {
  const { isModalOpen, toggleModal, feedbackContent, isLoading, error } =
    useFeedback(interviewId);

  return (
    <>
      <Button onClick={toggleModal} className="fixed top-20 left-4 z-50">
        Open Feedback
      </Button>
      <Dialog open={isModalOpen} onOpenChange={toggleModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {isLoading && <LoadingSpinner />}
          </div>
          {!isLoading &&
            (error !== '' ? (
              <FeedbackError message={error} />
            ) : (
              <FeedbackContent feedback={feedbackContent} />
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
