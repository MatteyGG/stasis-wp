// components/warpath/WarpathLayout.tsx
import { Header } from '@/components/NewUi/header';
import { Sidebar } from '@/components/NewUi/sidebar';
import { ReactNode } from 'react';
import { Footer } from '../../components/NewUi/footer';


interface WarpathLayoutProps {
  children: ReactNode;
  currentSection: string;
  setSection: (section: string) => void;
}

export function WarpathLayout({ 
  children, 
  currentSection, 
  setSection 
}: WarpathLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/60">
      <Header />
      <main className="max-w-7xl mx-auto px-3 py-4 grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-4">
        <Sidebar current={currentSection} onChange={setSection} />
        <section className="min-h-[70vh]">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
}