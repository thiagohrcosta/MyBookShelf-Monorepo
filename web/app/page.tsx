import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { RecentlyAdded } from "./components/recently-added";
import { ReadingStats } from "./components/reading-stats";
import { RecentActivity } from "./components/recent-activity";
import { RecentReviews } from "./components/recent-reviews";
import { RecentlyRated } from "./components/recently-rated";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <HeroSection />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentlyAdded />
            <ReadingStats />
          </div>
          <div>
            <RecentReviews />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RecentActivity />
          </div>

          <div>
            <RecentlyRated />
          </div>
        </div>
      </div>
    </div>
  );
}
