import { motion } from 'framer-motion';
import WardenSidebar from '../../components/WardenSidebar';
import { pageVariants, itemVariants } from '../../lib/motion';

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans antialiased">
      <WardenSidebar />

      <main className="pt-14 md:pt-0 md:pl-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-20 px-4 md:px-6 py-3">
          <h1 className="text-[#0f172a] text-xl font-bold">Profile</h1>
        </header>

        <motion.div
          variants={pageVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-6 space-y-6"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-[#e2e8f0] p-12 flex flex-col items-center justify-center text-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#cbd5e1]">person</span>
            <p className="text-[#0f172a] font-semibold">Coming Soon</p>
            <p className="text-sm text-[#64748b]">Profile management features are under development.</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
