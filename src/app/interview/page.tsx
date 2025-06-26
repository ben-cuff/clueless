"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const router = useRouter();
  return (
    <div className="flex w-full h-vh justify-center items-center">
      <Button onClick={() => router.push("/interview/new")}>
        Start new Interview
      </Button>
    </div>
  );
}
