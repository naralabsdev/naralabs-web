import Link from "next/link";

export default function ContractNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4 text-center">
      <p className="text-sm font-medium text-neutral-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Contract not found</h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        This contract has no indexed events yet, or the identifier may be incorrect.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Back to explorer
      </Link>
    </main>
  );
}
