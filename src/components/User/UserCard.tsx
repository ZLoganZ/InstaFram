import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Loader from "@/components/Shared/Loader";
import HoverUser from "@/components/User/HoverUser";
import EditProfile from "@/components/Forms/User/EditProfile";
import { getImageURL } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useFollowUser } from "@/lib/hooks/mutation";
import { IUser } from "@/types";

interface IUserCard {
  user: IUser;
}

const UserCard = ({ user }: IUserCard) => {
  const { currentUser, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  const { followUser, isLoadingFollowUser } = useFollowUser();

  const isCurrentUser = currentUser._id === user._id;
  const isFollowing = currentUser.following.includes(user._id);

  return (
    <div className="flex-center flex-col gap-4 rounded-[20px] border border-light-4 bg-light-2 px-5 py-8 dark:border-dark-4 dark:bg-dark-2">
      <Link
        className="flex-center flex-col gap-4"
        to="/$profileID"
        params={{ profileID: user.alias || user._id }}
      >
        <HoverUser userID={user._id}>
          <img
            src={
              getImageURL(user.image, "avatar") ||
              "/assets/icons/profile-placeholder.svg"
            }
            alt="creator"
            className="size-14 rounded-full ring-primary hover:ring-2"
          />
        </HoverUser>

        <div className="flex-center flex-col gap-1">
          <HoverUser userID={user._id}>
            <p className="base-medium line-clamp-1 text-center hover:underline">
              {user.name}
            </p>
          </HoverUser>
          <HoverUser userID={user._id}>
            <p className="small-regular text-center text-[#7878A3]">
              @{user.alias}
            </p>
          </HoverUser>
        </div>
      </Link>

      {!isCurrentUser ? (
        <Button
          type="button"
          size="sm"
          className="px-4"
          disabled={isLoadingFollowUser}
          onClick={() => {
            followUser(user._id);
            setUser({
              ...currentUser,
              following: isFollowing
                ? currentUser.following.filter((id) => id !== user._id)
                : [...currentUser.following, user._id],
            });
          }}
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
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" className="px-4">
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg lg:max-w-5xl">
            <EditProfile setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserCard;
