import type { ReactNode } from "react";

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { SvgDefs } from "@/components/misc";
import { ProviderTree } from "@/providers";
import appCss from "@/styles/globals.css?url";

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen" suppressHydrationWarning={true}>
        <div className="root">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <RootDocument>
      <ProviderTree>
        <SvgDefs />
        <Outlet />
      </ProviderTree>
    </RootDocument>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      {
        href: "/metadata/icon.png",
        rel: "icon",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Namera - Smart Wallets for Autonomous Agents",
      },
      {
        content: "Namera",
        name: "description",
      },
      { content: "index, follow", name: "robots" },
      {
        content:
          "smart wallets, autonomous agents, AI wallets, programmable wallets, crypto wallets",
        name: "keywords",
      },
      {
        content: "Namera - Smart Wallets for Autonomous Agents",
        property: "og:title",
      },
      {
        content: "Secure, programmable wallets built for AI agents.",
        property: "og:description",
      },
      {
        content: "website",
        property: "og:type",
      },
      {
        content: "https://namera.ai",
        property: "og:url",
      },
      {
        content: "/metadata/og.png",
        property: "og:image",
      },
      {
        content: "summary_large_image",
        name: "twitter:card",
      },
      {
        content: "Namera - Smart Wallets for Autonomous Agents",
        name: "twitter:title",
      },
      {
        content: "Secure, programmable wallets for AI-native finance.",
        name: "twitter:description",
      },
      {
        content: "/metadata/og.png",
        name: "twitter:image",
      },
    ],
  }),
});
