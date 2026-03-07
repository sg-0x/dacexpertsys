import Sidebar from '../components/Sidebar';

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex min-h-screen bg-[#f6f6f8] font-inter">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-[#0f172a] text-2xl font-bold mb-2">{title}</h1>
          <p className="text-[#94a3b8] text-sm">This page is coming soon.</p>
        </div>
      </main>
    </div>
  );
}
