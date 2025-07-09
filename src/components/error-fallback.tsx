import Link from "next/link";

export default function ErrorFallback({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-4xl">
      <h1>{text}</h1>
      <Link href="/" className="mt-10 text-xl">
        Return home
      </Link>
    </div>
  );
}
