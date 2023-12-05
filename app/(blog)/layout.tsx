import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>
        <Link href="/">Blog App</Link>
      </h1>
      <div>{children}</div>
    </div>
  );
}
