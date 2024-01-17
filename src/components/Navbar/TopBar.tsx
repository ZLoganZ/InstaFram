import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSignout } from "@/lib/hooks/mutation";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn, getImageURL } from "@/lib/utils";

const TopBar = () => {
  const { signout } = useSignout();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const { pathname } = routerState.location;

  return (
    <section className="sticky top-0 z-50 w-full bg-light-2 dark:bg-dark-2 md:hidden">
      <div className="flex-between px-5 py-4">
        <Link to="/" className="flex items-center gap-1">
          <img src="/assets/images/logo.svg" alt="logo" className="size-9" />
          <p className="h2-bold select-none font-mono">InstaFram</p>
        </Link>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <img
                src={
                  getImageURL(currentUser.image, "miniAvatar") ||
                  "/assets/icons/profile-placeholder.svg"
                }
                className={cn(
                  "size-8 select-none rounded-full",
                  pathname.includes(`/profile/${currentUser._id}`) &&
                    "ring-2 ring-primary",
                )}
                alt="profile"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex items-center justify-start gap-3">
                <img
                  src={
                    getImageURL(currentUser.image, "avatar") ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  className={cn(
                    "ml-3 size-12 select-none rounded-full",
                    pathname.includes(`/profile/${currentUser._id}`) &&
                      "ring-2 ring-primary",
                  )}
                  alt="profile"
                />
                <div className="flex flex-col gap-1 text-center">
                  {currentUser.name}{" "}
                  <p className="text-[#7878A3]">@{currentUser.alias}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-transparent">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start gap-4 py-6"
                  onClick={() =>
                    navigate({
                      to: "/$profileID",
                      params: {
                        profileID: currentUser.alias || currentUser._id,
                      },
                    })
                  }
                >
                  <img
                    src="/assets/icons/user.svg"
                    alt="logout"
                    className="size-5"
                  />
                  <p className="small-medium lg:base-medium">View Profile</p>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-transparent">
                <ModeToggle topbar />
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-transparent">
                <Button
                  type="button"
                  variant="ghost"
                  className="group w-full justify-start gap-4 py-6"
                  onClick={() => signout()}
                >
                  <img
                    src="/assets/icons/logout.svg"
                    alt="logout"
                    className="size-5"
                  />
                  <p className="small-medium lg:base-medium">Sign out</p>
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
