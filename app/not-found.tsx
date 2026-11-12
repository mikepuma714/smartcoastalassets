import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-luxe flex min-h-[70vh] flex-col items-start justify-center pt-32 pb-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl sm:text-6xl">This page has drifted out to sea.</h1>
      <p className="mt-4 max-w-lg text-muted">The residence or page you&rsquo;re looking for isn&rsquo;t available.</p>
      <Link href="/projects" className="btn-gold mt-8">
        View current residences
      </Link>
    </section>
  );
}
