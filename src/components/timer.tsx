import { secondsInMinute } from 'date-fns/constants';

export default function Timer({ timer }: { timer: number }) {
  const SECONDS_LEFT_TO_WARN = 180;

  return (
    <div
      className={`fixed z-50 top-16 right-4 px-3 py-1 rounded text-white font-mono text-lg ${
        timer <= SECONDS_LEFT_TO_WARN ? 'bg-red-600' : 'bg-gray-800'
      }`}
      data-testid="timer"
    >
      {getPaddedForm(timer)}
    </div>
  );
}

function getPaddedForm(seconds: number) {
  const m = Math.floor(seconds / secondsInMinute)
    .toString()
    .padStart(2, '0');
  const s = (seconds % secondsInMinute).toString().padStart(2, '0');
  return `${m}:${s}`;
}
