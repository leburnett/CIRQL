import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CategoryDotList } from "@/components/CategoryDotList";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white">
      <CategoryDotList />
    </main>
  );
}
