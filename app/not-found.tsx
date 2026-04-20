import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-3">Page not found</h1>
      <p className="mt-4 max-w-md text-neutral-600">
        We couldn&apos;t find the page you&apos;re looking for. It may have moved, or you may have
        followed an old link.
      </p>
      <div className="mt-8">
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
