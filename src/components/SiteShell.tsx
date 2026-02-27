import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function SiteShell({
  children,
}: {
  children: React.ReactNode;
  brandSlug?: string;
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
