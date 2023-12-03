import { Outlet, Navigate } from 'react-router-dom';

import { TopBar, BottomBar, LeftSideBar } from '@/components/Navbar';
import { useAuth } from '@/lib/hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className='w-full md:flex'>
          <TopBar />
          <LeftSideBar />

          <section className='flex flex-1 h-full'>
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
