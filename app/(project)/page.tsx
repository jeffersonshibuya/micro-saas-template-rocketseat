import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>Login</div>
      <Link href={'/dashboard'}>Dashboard</Link>
    </main>
  );
}
