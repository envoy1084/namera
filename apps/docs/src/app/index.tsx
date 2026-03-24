import { createFileRoute } from "@tanstack/react-router";

import { Navbar } from "@/components";
import { Hero } from "@/sections";

export const Home = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
    </div>
  );
};

export const Route = createFileRoute("/")({ component: Home });
