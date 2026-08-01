/**
 * Shared application shell rendered around every route via React
 * Router's `<Outlet />`. Provides the navbar, footer, an ambient
 * background glow for visual depth, and animated page transitions.
 */

import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function AppLayout(): JSX.Element {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Ambient background glow — purely decorative, aria-hidden */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}