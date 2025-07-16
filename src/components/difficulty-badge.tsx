import { READABLE_DIFFICULTIES } from '@/constants/difficulties';

export default function DifficultyBadge({
  difficulty,
}: {
  difficulty: 1 | 2 | 3;
}) {
  const difficultyStyledColors =
    difficulty === 1
      ? 'bg-green-300 text-green-800'
      : difficulty === 2
      ? 'bg-yellow-300 text-yellow-800'
      : 'bg-red-300 text-red-800';

  return (
    <div
      className={`px-2 py-1 rounded text-xs font-semibold ${difficultyStyledColors}`}
    >
      {READABLE_DIFFICULTIES[difficulty]}
    </div>
  );
}
