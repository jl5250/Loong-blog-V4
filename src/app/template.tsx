import type { ReactNode } from "react";
import { PageTransition } from "@/components/transitions/PageTransition";
import { Footer } from "@/components/layout/Footer";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <PageTransition>
      {children}
      <Footer />
    </PageTransition>
  );
}
