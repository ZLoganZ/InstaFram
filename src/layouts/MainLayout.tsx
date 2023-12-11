import { Outlet } from '@tanstack/react-router';

import TopBar from '@/components/Navbar/TopBar';
import LeftSideBar from '@/components/Navbar/LeftSideBar';
import BottomBar from '@/components/Navbar/BottomBar';

const MainLayout = () => {
  return (
    <div className='w-full md:flex overflow-hidden'>
      <TopBar />
      <LeftSideBar />

      <section className='flex flex-1 h-[calc(100%-160px)] md:h-full overflow-auto'>
        <Outlet />
      </section>

      <BottomBar />
    </div>
  );
};

export default MainLayout;
