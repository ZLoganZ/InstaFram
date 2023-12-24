import { Outlet } from '@tanstack/react-router';

const AuthLayout = () => {
  return (
    <>
      <section className='flex flex-1 justify-center items-center flex-col py-10'>
        <Outlet />
      </section>
      <img
        className='hidden lg:block h-dvh w-1/2 object-cover bg-no-repeat bg-center'
        src='/assets/images/side-img.svg'
        alt='side-image'
      />
    </>
  );
};

export default AuthLayout;
