import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function PythonSolutionCard({
  pythonSolution,
}: {
  pythonSolution: string;
}) {
  return (
    <Card className="h-full w-1/2">
      <CardHeader>Sample Python Solution</CardHeader>
      <CardContent>
        <pre className="text-sm overflow-auto">{pythonSolution}</pre>
      </CardContent>
    </Card>
  );
}
