/**
 * Application footer rendered on every page via `AppLayout`.
 */

import { Link } from "react-router-dom";

export function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background/40 backdrop-blur-[16px]">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row ">
        <p>© {currentYear} PricePredict.</p>
        <p>
          <span className="text-sm font-bold">Developed by</span>:
          <span className="text-sm"> Kefyalew, Samuel and Mihretab</span>
        </p>
        <div className="flex items-center gap-4">
          <Link to="/dataset" className="hover:text-foreground">
            Dataset
          </Link>
          <Link to="/model-comparison" className="hover:text-foreground">
            Models
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
