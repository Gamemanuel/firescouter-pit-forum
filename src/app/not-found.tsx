// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 – Page Not Found</h1>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <Link href="/" className="text-blue-600 underline hover:text-blue-800">
        Go back home
      </Link>
    </main>
  );
}