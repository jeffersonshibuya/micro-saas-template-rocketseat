import { handleAuth } from "@/app/actions/handle-auth";

const LoginPage = () => {
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
