export default function RecommendedHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-col space-y-2">
      <h1 className="w-full text-2xl font-bold mb-6">Recommended Questions</h1>
      {children}
    </div>
  );
}
