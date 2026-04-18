import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components";
import { Footer } from "@/components/footer";
import {
  Faqs,
  Hero,
  HowItWorks,
  Integrate,
  McpSection,
  Products,
  SessionKeys,
  Trust,
  UseCases,
  WhyNamera,
} from "@/sections";

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090a]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <SessionKeys />
      <Products />
      <McpSection />
      <UseCases />
      <WhyNamera />
      <Trust />
      <Integrate />
      <Faqs />
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/")({ component: Home });
