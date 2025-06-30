import ThemeToggler from './components/themeToggler';

export default function Home() {
  return (
    <main className="flex flex-col text-center gap-2 items-center justify-center min-h-screen font-sans">
      <h1 className="text-5xl font-extrabold">😁NextJS App Router</h1>
      <h2 className="text-4xl font-bold">With Dark Mode</h2>
      <p className="text-lg max-w-md">Simple theme integration with NextJS, Next Theme Kit and TailwindCSS!</p>
      <ThemeToggler />
    </main>
  );
}