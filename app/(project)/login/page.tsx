import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth()

  if(session) {
    redirect('/dahsboard')
  }

  return (
    <div>
      <form action={handleAuth}>
        <button
          type="submit"
          className="cursor-pointer border border-slate-400 p-2 rounded"
        >
          Signin with Google
        </button>
      </form>
    </div>
  );
};
export default LoginPage;
