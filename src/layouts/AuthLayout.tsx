import { Outlet } from "@tanstack/react-router";

const AuthLayout = () => {
  return (
    <>
      <section className="flex flex-1 flex-col items-center justify-center py-10">
        <Outlet />
      </section>
      <img
        className="hidden h-dvh w-1/2 bg-center bg-no-repeat object-cover lg:block"
        src="/assets/images/side-img.svg"
        alt="side-image"
      />
    </>
  );
};

export default AuthLayout;
