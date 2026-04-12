import { Link } from "@tanstack/react-router";

import { Button } from "@namera-ai/ui/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@namera-ai/ui/components/ui/navigation-menu";

export const Menu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="hidden sm:flex">
          <NavigationMenuTrigger>Product</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-lg bg-neutral-500/10 h-32 rounded-lg border-[0.5px] backdrop-blur-sm" />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden sm:flex">
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="w-lg bg-neutral-600/10 h-32 rounded-md border-[0.5px]" />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden sm:flex">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link to="/blog" />}
          >
            Blog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="hidden sm:flex">
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link to="/changelog" />}
          >
            Changelog
          </NavigationMenuLink>
        </NavigationMenuItem>
        <div className="h-5 border-r hidden sm:block" />
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            render={<Link to="/docs/$" />}
          >
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button>Get Started</Button>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
