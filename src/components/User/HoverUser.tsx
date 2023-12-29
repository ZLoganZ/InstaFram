import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components//ui/button";
import Loader from "@/components/Shared/Loader";
import { useGetUserByID } from "@/lib/hooks/query";
import { useFollowUser } from "@/lib/hooks/mutation";
import { useAuth } from "@/lib/hooks/useAuth";
import { getImageURL } from "@/lib/utils";

interface IHoverUser {
  userID: string;
  children?: React.ReactNode;
  showFollowButton?: boolean;
}

const HoverUser = ({
  userID,
  children,
  showFollowButton = false,
}: IHoverUser) => {
  const [open, setOpen] = useState(false);

  const { currentUser, setUser } = useAuth();
  const { user, isLoadingUser } = useGetUserByID(userID, open);

  const { followUser, isLoadingFollowUser } = useFollowUser();

  const isFollowing = useMemo(
    () => currentUser.following.includes(user?._id || ""),
    [currentUser.following, user?._id],
  );

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
    <HoverCard openDelay={300} closeDelay={200} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-full max-w-5xl">
        {isLoadingUser || !user ? (
          <Loader className="h-12 w-12" />
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Link
                className="flex gap-2"
                to="/$profileID"
                params={{ profileID: user.alias || user._id }}
              >
                <img
                  src={
                    getImageURL(user.image, "avatar") ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="profile"
                  className="size-14 rounded-full ring-primary hover:ring-2"
                />
                <div className="flex flex-col">
                  <p className="line-clamp-1 text-lg font-bold hover:underline">
                    {user.name}
                  </p>
                  <p className="text-sm text-dark-4/80 dark:text-light-4/80">
                    @{user.alias}
                  </p>
                </div>
              </Link>
              {currentUser._id !== user._id && showFollowButton && (
                <Button
                  className="ml-auto"
                  type="button"
                  size="sm"
                  disabled={isLoadingFollowUser}
                  onClick={handleFollow}
                >
                  {isLoadingFollowUser ? (
                    <div className="flex-center gap-2">
                      <Loader />
                      {isFollowing ? "Unfollowing" : "Following"}
                    </div>
                  ) : isFollowing ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              )}
            </div>
            <div className="flex-center gap-1">
              <p className="flex-center subtle-semibold lg:small-regular text-dark-2 dark:text-light-2">
                <span className="small-semibold lg:base-bold text-primary">
                  {user.followers.length}
                </span>
                &nbsp; Followers
              </p>
              -
              <p className="flex-center subtle-semibold lg:small-regular text-dark-2 dark:text-light-2">
                <span className="small-semibold lg:base-bold text-primary">
                  {user.following.length}
                </span>
                &nbsp; Following
              </p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverUser;
