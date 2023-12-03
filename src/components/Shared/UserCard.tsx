import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Loader } from '@/components/Shared';
import { EditProfile } from '@/pages';
import { IUser } from '@/types';
import { getImageURL } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFollowUser } from '@/lib/hooks/mutation';

interface IUserCard {
  user: IUser;
}

const UserCard: React.FC<IUserCard> = ({ user }) => {
  const { currentUser, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  const { followUser, isLoadingFollowUser } = useFollowUser(currentUser._id);

  const isCurrentUser = currentUser._id === user._id;
  const isFollowing = currentUser.following.includes(user._id);

  return (
    <div className='flex-center flex-col gap-4 border bg-light-2 dark:bg-dark-2 border-light-4 dark:border-dark-4 rounded-[20px] px-5 py-8'>
      <Link to={`/profile/${user._id}`} className='flex-center flex-col gap-4'>
        <img
          src={getImageURL(user.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
          alt='creator'
          className='rounded-full w-14 h-14'
        />

        <div className='flex-center flex-col gap-1'>
          <p className='base-medium text-center line-clamp-1 hover:underline'>{user.name}</p>
          <p className='small-regular text-dark-1/70 dark:text-light-1/70 text-center line-clamp-1 hover:underline'>
            @{user.alias}
          </p>
        </div>
      </Link>

      {!isCurrentUser ? (
        <Button
          type='button'
          size='sm'
          className='px-4'
          disabled={isLoadingFollowUser}
          onClick={() => {
            followUser(user._id);
            setUser({
              ...currentUser,
              following: isFollowing
                ? currentUser.following.filter((id) => id !== user._id)
                : [...(currentUser.following ?? []), user._id]
            });
          }}>
          {isLoadingFollowUser ? (
            <div className='flex-center gap-2'>
              <Loader />
              Loading...
            </div>
          ) : isFollowing ? (
            'Following'
          ) : (
            'Follow'
          )}
        </Button>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type='button' size='sm' className='px-4'>
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-lg lg:max-w-5xl'>
            <EditProfile setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserCard;
