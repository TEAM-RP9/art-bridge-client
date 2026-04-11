"use client";
import Link from "next/link";

export default function TestIndexPage() {
  return (
    <main className="mx-auto max-w-2xl py-16 px-6">
      <h1 className="text-3xl font-bold mb-6">Component Test Pages</h1>
      <ul className="space-y-4">
        <li>
          <Link
            href="/test/profile"
            className="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
          >
            Profile Components
          </Link>
        </li>
        <li>
          <Link
            href="/test/auth"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800"
          >
            Auth Components
          </Link>
        </li>
      </ul>
      <p className="mt-8 text-gray-400 text-xs">Ainult arenduseks. Production buildis eemaldada või kaitsta.</p>
    </main>
  );
}
