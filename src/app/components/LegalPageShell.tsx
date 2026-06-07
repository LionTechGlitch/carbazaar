import Navbar from "./Navbar";
import Footer from "./Footer";

interface LegalPageShellProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function LegalPageShell({ title, lastUpdated, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-kairo-bg text-kairo-ink">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-kairo-gold mb-3">{title}</h1>
            <p className="text-sm text-kairo-ink-muted">Last updated: {lastUpdated}</p>
          </header>
          <div className="prose-legal space-y-8 text-kairo-ink-muted leading-relaxed">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-kairo-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export { Section };
