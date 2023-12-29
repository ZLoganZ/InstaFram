import { Outlet } from "@tanstack/react-router";

import TopBar from "@/components/Navbar/TopBar";
import LeftSideBar from "@/components/Navbar/LeftSideBar";
import BottomBar from "@/components/Navbar/BottomBar";

const MainLayout = () => {
  return (
    <div className="w-full overflow-hidden md:flex">
      <TopBar />
      <LeftSideBar />

      <section className="flex h-[calc(100%-160px)] flex-1 overflow-auto md:h-full">
        <Outlet />
      </section>

      <BottomBar />
    </div>
  );
};

export default MainLayout;
