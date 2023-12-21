import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components//ui/button';
import Loader from '@/components/Shared/Loader';
import { useGetUserByID } from '@/lib/hooks/query';
import { useFollowUser } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getImageURL } from '@/lib/utils';

interface IHoverUser {
  userID: string;
  children?: React.ReactNode;
}

const HoverUser = ({ userID, children }: IHoverUser) => {
  const { currentUser, setUser } = useAuth();
  const { user, isLoadingUser } = useGetUserByID(userID);

  const { followUser, isLoadingFollowUser } = useFollowUser();

  const isFollowing = currentUser.following.includes(user?._id || '');

  const handleFollow = async () => {
    await followUser(user._id);
    setUser({
      ...currentUser,
      following: isFollowing
        ? currentUser.following.filter((id) => id !== user._id)
        : [...currentUser.following, user._id]
    });
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className='w-full max-w-5xl'>
        {isLoadingUser ? (
          <Loader className='w-12 h-12' />
        ) : (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-4'>
              <img
                src={getImageURL(user?.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                alt='profile'
                className='w-14 h-14 rounded-full'
              />
              <div className='flex flex-col'>
                <p className='font-bold text-lg'>{user.name}</p>
                <p className='text-sm text-gray-500'>@{user.alias}</p>
              </div>
              {currentUser._id !== user?._id && (
                <Button
                  className='ml-auto'
                  variant='outline'
                  size='sm'
                  disabled={isLoadingFollowUser}
                  onClick={handleFollow}>
                  {isLoadingFollowUser ? (
                    <div className='flex-center gap-2'>
                      <Loader />
                      {isFollowing ? 'Unfollowing' : 'Following'}
                    </div>
                  ) : isFollowing ? (
                    'Unfollow'
                  ) : (
                    'Follow'
                  )}
                </Button>
              )}
            </div>
            <div className='flex-center gap-1 text-[#7878A3]'>
              <p className='subtle-semibold lg:small-regular'>{user.followers.length} followers</p>-
              <p className='subtle-semibold lg:small-regular'>{user.following.length} following</p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverUser;
