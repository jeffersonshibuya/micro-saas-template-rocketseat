import { handleSignOut } from "@/app/actions/handle-signout";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div>
      Dahsboard
      {session?.user?.email ? session.user.email : "User not authenticated!"}
      {session?.user?.email && (
        <form action={handleSignOut}>
          <button type="submit" className="cursor-pointer p-2 border rounded">
            Logout
          </button>
        </form>
      )}

      <Link href={'/payments'}>Pagamentos</Link>
    </div>
  );
};
export default DashboardPage;
