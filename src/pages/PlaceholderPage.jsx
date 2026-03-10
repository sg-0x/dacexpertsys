import Sidebar from '../components/Sidebar';

export default function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-[#f6f6f8] font-inter">
      <Sidebar />
      <main className="pt-14 md:pt-0 md:pl-64 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-[#0f172a] text-2xl font-bold mb-2">{title}</h1>
          <p className="text-[#94a3b8] text-sm">This page is coming soon.</p>
        </div>
      </main>
    </div>
  );
}
