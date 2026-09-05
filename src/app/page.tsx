import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import TestDirectory from '@/app/components/TestDirectory';
import HowItWorksHome from '@/app/components/HowItWorksHome';
import HomeCta from '@/app/components/HomeCta';

export default function HomePage() {
  return <main className="min-h-screen bg-background"><Header /><HeroSection /><TestDirectory /><HowItWorksHome /><HomeCta /><Footer /></main>;
}
