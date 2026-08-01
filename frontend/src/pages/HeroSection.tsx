/**
 * Above-the-fold hero section for the Home page. Staggered entrance
 * animation on headline/subcopy/CTAs, plus a floating gradient badge
 * to reinforce the "AI-powered" positioning.
 */

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function HeroSection(): JSX.Element {
  return (
    <section className="container flex flex-col items-center gap-8 py-20 text-center sm:py-28">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Powered by a trained regression model
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
        >
          Predict Computer Prices with{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Machine Learning
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Enter a device's specifications — from CPU to display to battery — and
          get an instant, data-driven price estimate across laptops, desktops,
          and more.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild variant="glow" size="lg">
            <Link to="/predict">
              Start Predicting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/model-comparison">View Model Performance</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
