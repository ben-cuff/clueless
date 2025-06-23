import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="w-full flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-3xl font-bold">Welcome to Clueless</h1>
        </header>
      </div>
    );
  }
  return (
    <>
      <h1>Home page</h1>
    </>
  );
}
