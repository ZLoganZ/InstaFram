import { Outlet, Navigate } from '@tanstack/react-router';

import { useAuth } from '@/lib/hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/' replace />
      ) : (
        <>
          <section className='flex flex-1 justify-center items-center flex-col py-10'>
            <Outlet />
          </section>
          <img
            className='hidden lg:block h-screen w-1/2 object-cover bg-no-repeat bg-center'
            src='/assets/images/side-img.svg'
            alt='side-image'
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
