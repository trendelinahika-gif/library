import Hero from '@/components/Hero';
import FeaturedBooks from '@/components/FeaturedBooks';
import FeaturedEvents from '@/components/FeaturedEvents';
import LatestNews from '@/components/LatestNews';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <FeaturedBooks />
      <FeaturedEvents />
      <LatestNews />
      <Footer />
    </>
  );
}
