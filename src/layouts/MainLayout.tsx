import { Outlet, Navigate } from '@tanstack/react-router';

import TopBar from '@/components/Navbar/TopBar';
import LeftSideBar from '@/components/Navbar/LeftSideBar';
import BottomBar from '@/components/Navbar/BottomBar';
import { useAuth } from '@/lib/hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className='w-full md:flex overflow-hidden'>
          <TopBar />
          <LeftSideBar />

          <section className='flex flex-1 h-full overflow-auto'>
            <Outlet />
          </section>

          <BottomBar />
        </div>
      ) : (
        <Navigate to='/signin' replace />
      )}
    </>
  );
};

export default MainLayout;
