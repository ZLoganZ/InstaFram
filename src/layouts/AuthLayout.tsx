import { Outlet, Navigate } from 'react-router-dom';

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
            className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat bg-center'
            src='/assets/images/side-img2.svg'
            alt='logo'
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
