import { NameraIcon } from "@namera-ai/ui/icons";

import { Menu } from "./menu";

export const Navbar = () => {
  return (
    <nav className="w-full grow flex backdrop-blur-2xl z-100 fixed top-0 px-4 h-16 items-center justify-center bg-[linear-gradient(180deg,rgba(11,11,11,0.8)_0,color-mix(in_oklab,rgba(11,11,11,0.8)_100%,transparent_5%)_100%)] border-b-[0.5px]">
      <div className="max-w-7xl w-full flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <NameraIcon className="fill-foreground size-5" />
          <span className="font-medium text-lg">Namera</span>
        </div>
        <Menu />
      </div>
    </nav>
  );
};
