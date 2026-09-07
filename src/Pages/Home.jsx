import Hero from "../Components/Hero";
import ServicesOverview from "../Components/ServicesOverview";
import Portfolio from "../Components/Portfolio";
import ReviewShowcase from "../Components/ReviewShowcase";
import WhyUs from "../Components/WhyUs";
import BusinessCheckCTA from "../Components/BusinessCheckCTA";
import WhyPresenceMatter from "../Components/WhyPresenceMatter";

function Home() {
  return (
    <main>
      <Hero />

      <WhyPresenceMatter />

      <ServicesOverview />

      <Portfolio />

      <ReviewShowcase />

      <WhyUs />

      <BusinessCheckCTA />
    </main>
  );
}

export default Home;