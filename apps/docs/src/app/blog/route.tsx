import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Footer, Navbar } from "@/components";

const BlogLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export const Route = createFileRoute("/blog")({
  component: BlogLayout,
});
