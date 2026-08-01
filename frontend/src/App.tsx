/**
 * Root application component.
 *
 * Deliberately minimal — all routing logic lives in
 * `src/routes/AppRoutes.tsx`. This file exists only as the
 * composition point React DOM mounts into.
 */

import { AppRoutes } from "@/routes/AppRoutes";

export default function App(): JSX.Element {
  return <AppRoutes />;
}
