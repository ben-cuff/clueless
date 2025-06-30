import Link from "next/link";

export default function InterviewError() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-4xl">
      <h1>Error Loading this page, try again later</h1>
      <Link href={"/"} className="mt-10 text-xl">Return home</Link>
    </div>
  );
}
