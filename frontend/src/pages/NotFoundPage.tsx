/**
 * 404 Not Found page. Matches the app's visual language (glass
 * panel, gradient text, animated entrance) rather than a bare
 * unstyled error message.
 */

import { motion } from "framer-motion";
import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel flex h-20 w-20 items-center justify-center rounded-full text-primary"
      >
        <SearchX className="h-9 w-9" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-2"
      >
        <h1 className="bg-gradient-to-r from-primary to-accent bg-clip-text text-6xl font-bold text-transparent">
          404
        </h1>
        <p className="text-lg font-semibold">Page not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Button asChild variant="glow" size="lg">
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
