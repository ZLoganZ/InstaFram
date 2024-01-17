import { Link, useRouterState } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn, getImageURL } from "@/lib/utils";
import { navbarLinks } from "@/lib/constants";
import { useSignout } from "@/lib/hooks/mutation";
import { useAuth } from "@/lib/hooks/useAuth";

const LeftSideBar = () => {
  const { currentUser } = useAuth();
  const { signout } = useSignout();
  const routerState = useRouterState();

  const { pathname } = routerState.location;

  return (
    <nav className="hidden min-w-[270px] flex-col justify-between bg-light-2 px-6 py-10 dark:bg-dark-2 md:flex">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex items-center gap-1">
          <img src="/assets/images/logo.svg" alt="logo" className="size-9" />
          <p className="h2-bold select-none font-mono">InstaFram</p>
        </Link>

        <Link
          className="flex items-center gap-3"
          to="/$profileID"
          params={{ profileID: currentUser.alias || currentUser._id }}
        >
          <img
            src={
              getImageURL(currentUser.image, "avatar") ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className={cn(
              "size-14 rounded-full ring-primary hover:ring-2",
              (pathname.includes(`/${currentUser._id}`) ||
                pathname.includes(`/${currentUser.alias}`)) &&
                "ring-2 ring-primary",
            )}
          />
          <div className="flex flex-col">
            <p className="body-bold line-clamp-1 hover:underline">
              {currentUser.name}
            </p>
            <p className="small-regular text-[#7878A3]">@{currentUser.alias}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {navbarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={cn(
                  "base-medium group rounded-lg transition hover:bg-primary",
                  isActive && "bg-primary",
                )}
              >
                <Link
                  to={link.route}
                  className="flex items-center gap-4 p-4"
                  search={{}}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={cn(
                      "group-hover:invert-white size-6",
                      isActive && "invert-white",
                    )}
                  />
                  <p
                    className={cn(
                      "group-hover:invert-white",
                      isActive && "invert-white",
                    )}
                  >
                    {link.label}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <ModeToggle />
        <Button
          variant="ghost"
          className="group justify-start gap-4 py-6 transition hover:bg-primary"
          onClick={() => signout()}
        >
          <img
            className="group-hover:invert-white size-6"
            src="/assets/icons/logout.svg"
            alt="logout"
          />
          <p className="small-medium lg:base-medium group-hover:invert-white">
            Sign Out
          </p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSideBar;
