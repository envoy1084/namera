import { createFileRoute } from "@tanstack/react-router";

import { Footer, Navbar } from "@/components";
import { Hero } from "@/sections";

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/")({ component: Home });
