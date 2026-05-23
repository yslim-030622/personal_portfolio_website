import Link from "next/link";

export default function RootNotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[1100px] flex-col justify-center px-5 py-24 md:px-8">
      <p className="text-[0.72rem] uppercase text-fg-muted">404</p>
      <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.96] text-fg">
        Page not found.
      </h1>
      <Link className="link-underline mt-8 w-fit text-sm" href="/">
        return home
      </Link>
    </main>
  );
}
