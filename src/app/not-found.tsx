import Link from 'next/link'
import Image from 'next/image'
import { HomeIcon } from '@heroicons/react/24/outline'


const Blinking = ({ children }: { children: string }) => (
  <h1 className="relative inline-block text-6xl sm:text-8xl font-bold text-black dark:text-white leading-none">
    <span
      className="absolute top-0 left-[2px] text-red-500 glitch1"
      aria-hidden="true"
    >
      {children}
    </span>
    <span
      className="absolute top-0 left-[-2px] text-cyan-500 glitch2"
      aria-hidden="true"
    >
      {children}
    </span>
    {children}
  </h1>
)

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-center p-6">
      <Image
        src="https://hackclub.com/404/dinobox.svg"
        alt="Spinning Dino"
        width={256}
        height={256}
        className="animate-spin-slow mb-6 aspect-square"
      />
      <Blinking>404!</Blinking>
      <p className="mt-4 mb-6 text-lg text-gray-600 dark:text-gray-400">
        We couldn’t find that page.
      </p>
      <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded transition">
        <HomeIcon className="w-6 h-6 text-white" />
      </Link>
    </main>
  )
}