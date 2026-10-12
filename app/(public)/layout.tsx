import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      {children}

      <CookieBanner />
      <Footer />
    </>
  );
}