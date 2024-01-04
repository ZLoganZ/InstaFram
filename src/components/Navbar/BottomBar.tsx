import { Link, useRouterState } from "@tanstack/react-router";

import { navbarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

const BottomBar = () => {
  const routerState = useRouterState();

  const { pathname } = routerState.location;

  return (
    <section className="flex-between sticky bottom-0 z-50 w-full rounded-t-[20px] bg-light-2 px-5 py-4 md:hidden dark:bg-dark-2">
      {navbarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            className={cn(
              "flex-center group flex-col gap-1 rounded-lg px-3 py-2 transition hover:bg-primary",
              isActive && "bg-primary",
            )}
            key={link.label}
            to={link.route}
            search={{}}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              className={cn(
                "group-hover:invert-white size-5",
                isActive && "invert-white",
              )}
            />
            <p
              className={cn(
                "tiny-medium text-dark-2 dark:text-light-2",
                isActive && "invert-white",
              )}
            >
              {link.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
