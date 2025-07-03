'use client';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center min-h-screen bg-Black">
      <div className="flex flex-col items-center justify-center space-y-6 p-6">
        <img src="/img/branding/simplifiedFaviconColorSmall.svg" width={400} className="mb-4" />

        <div className="w-full flex space-x-3 items-start justify-center">
          <button 
            type="button"
            onClick={() => router.push('/html/teamInfo')}
            className="
              w-50
              text-white
              font-bold
              py-4
              rounded-lg
              bg-fred
              space-x-4">
            New Form
          </button>

          <button
            type="button"
            onClick={() => router.push('https://example.com')}
            className="
              w-50
              text-white
              font-bold
              py-4
              rounded-lg
              bg-fblue">
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}