import AlertClient from "@/components/alert-client";
import LandingCard from "@/components/landing-card";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { error } = await searchParams;

  if (!session?.user.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="w-full flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold">Welcome to Clueless</h1>
        </header>
        <LandingCard />
        <AlertClient message={error} />
      </div>
    );
  }
  return (
    <div className="flex flex-1 justify-center items-center text-center flex-col min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to Clueless</h1>
      <h3 className="text-xl  mb-8">Use the navbar to get started</h3>
      <AlertClient message={error} />
    </div>
  );
}
