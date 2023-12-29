import { useEffect, useState } from "react";
import { Link, Outlet, useRouterState, RouteApi } from "@tanstack/react-router";

import NotFound from "@/pages/NotFound";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Loader from "@/components/Shared/Loader";
import StatBlock from "@/components/User/StatBlock";
import EditProfile from "@/components/Forms/User/EditProfile";
import { useGetUserByID } from "@/lib/hooks/query";
import { useFollowUser } from "@/lib/hooks/mutation";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn, getImageURL } from "@/lib/utils";

const routeApi = new RouteApi({ id: "/main/$profileID" });

const Profile = () => {
  const { profileID } = routeApi.useParams();
  const { currentUser, setUser } = useAuth();
  const routerState = useRouterState();
  const [open, setOpen] = useState(false);

  const { pathname } = routerState.location;

  const { user, isLoadingUser, errorUser } = useGetUserByID(profileID);

  const { followUser, isLoadingFollowUser } = useFollowUser();

  const isFollowing = currentUser.following.includes(user?._id || "");

  useEffect(() => {
    if (user) document.title = `${user.name} (@${user.alias}) - InstaFram`;
  }, [user]);

  const handleFollow = async () => {
    await followUser(user._id);
    setUser({
      ...currentUser,
      following: isFollowing
        ? currentUser.following.filter((id) => id !== user._id)
        : [...currentUser.following, user._id],
    });
  };

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-10 overflow-scroll px-5 py-10 md:p-14">
      {errorUser ? (
        <NotFound />
      ) : isLoadingUser || !user ? (
        <Loader />
      ) : (
        <>
          <div className="relative flex w-full max-w-5xl flex-col items-center gap-8 md:mb-8 xl:flex-row xl:items-start">
            <div className="flex flex-1 flex-col gap-7 max-xl:items-center xl:flex-row">
              <img
                src={
                  getImageURL(user.image, "avatar") ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="profile"
                className="size-28 rounded-full lg:size-36"
              />
              <div className="flex flex-1 flex-col justify-between md:mt-2">
                <div className="flex w-full flex-col">
                  <h1 className="h3-bold md:h1-semibold w-full text-center xl:text-left">
                    {user.name}
                  </h1>
                  <p className="small-regular md:body-medium text-center text-[#7878A3] xl:text-left">
                    @{user.alias}
                  </p>
                </div>

                <div className="z-20 mt-10 flex flex-wrap items-center justify-center gap-8 xl:justify-start">
                  <StatBlock value={user.posts.length} label="Posts" />
                  <StatBlock value={user.followers.length} label="Followers" />
                  <StatBlock value={user.following.length} label="Following" />
                </div>

                <p className="small-medium md:base-medium mt-7 max-w-screen-sm text-center xl:text-left">
                  {user.bio}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <div className={cn(currentUser._id !== user._id && "hidden")}>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <div
                        className={cn(
                          "flex-center h-12 cursor-pointer gap-2 rounded-lg bg-light-4 px-5 dark:bg-dark-4",
                          currentUser._id !== user._id && "hidden",
                        )}
                      >
                        <img
                          src="/assets/icons/edit.svg"
                          alt="edit"
                          className="size-5"
                        />
                        <p className="small-medium flex whitespace-nowrap">
                          Edit Profile
                        </p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg md:max-w-2xl lg:max-w-5xl">
                      <EditProfile setOpen={setOpen} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div
                  className={cn(
                    (currentUser._id === profileID ||
                      currentUser.alias === profileID) &&
                      "hidden",
                  )}
                >
                  <Button
                    type="button"
                    className="px-8"
                    disabled={isLoadingFollowUser}
                    onClick={handleFollow}
                  >
                    {isLoadingFollowUser ? (
                      <div className="flex-center gap-2">
                        <Loader />
                        Loading...
                      </div>
                    ) : isFollowing ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {user._id === currentUser._id && (
            <div className="flex w-full max-w-5xl">
              <Link
                className={cn(
                  "flex-center w-full flex-1 gap-3 rounded-l-lg bg-light-2 py-4 xl:w-48 xl:flex-initial dark:bg-dark-2",
                  pathname === `/${profileID}` && "!bg-light-4 dark:!bg-dark-4",
                )}
                to="/$profileID"
                params={{ profileID: currentUser.alias || currentUser._id }}
              >
                <img
                  src="/assets/icons/posts.svg"
                  alt="posts"
                  className="size-5"
                />
                Posts
              </Link>
              <Link
                className={cn(
                  "flex-center w-full flex-1 gap-3 bg-light-2 py-4 xl:w-48 xl:flex-initial dark:bg-dark-2",
                  pathname === `/${profileID}/liked` &&
                    "!bg-light-4 dark:!bg-dark-4",
                )}
                to="/$profileID/liked"
                params={{ profileID: currentUser.alias || currentUser._id }}
              >
                <img
                  src="/assets/icons/like.svg"
                  alt="liked"
                  className="size-5"
                />
                Liked Posts
              </Link>
              <Link
                className={cn(
                  "flex-center w-full flex-1 gap-3 rounded-r-lg bg-light-2 py-4 xl:w-48 xl:flex-initial dark:bg-dark-2",
                  pathname === `/${profileID}/saved` &&
                    "!bg-light-4 dark:!bg-dark-4",
                )}
                to="/$profileID/saved"
                params={{ profileID: currentUser.alias || currentUser._id }}
              >
                <img
                  src="/assets/icons/save.svg"
                  alt="saved"
                  className="size-5"
                />
                Saved Posts
              </Link>
            </div>
          )}

          <Outlet />
        </>
      )}
    </div>
  );
};

export default Profile;
