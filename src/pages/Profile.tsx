import { useEffect, useState } from 'react';
import { Link, Outlet, useRouterState, RouteApi } from '@tanstack/react-router';

import NotFound from '@/pages/NotFound';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Loader from '@/components/Shared/Loader';
import StatBlock from '@/components/User/StatBlock';
import EditProfile from '@/components/Forms/User/EditProfile';
import { useGetUserByID } from '@/lib/hooks/query';
import { useFollowUser } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn, getImageURL } from '@/lib/utils';

const routeApi = new RouteApi({ id: '/main/profile/$profileID' });

const Profile = () => {
  const { profileID } = routeApi.useParams();
  const { currentUser, setUser } = useAuth();
  const routerState = useRouterState();
  const [open, setOpen] = useState(false);

  const { pathname } = routerState.location;

  const { user, isLoadingUser, errorUser } = useGetUserByID(profileID);

  const { followUser, isLoadingFollowUser } = useFollowUser();

  const isFollowing = currentUser.following.includes(user?._id || '');

  useEffect(() => {
    if (user) document.title = `${user.name} (@${user.alias}) - InstaFram`;
  }, [user]);

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
    <div className='flex flex-col items-center flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar'>
      {errorUser ? (
        <NotFound />
      ) : isLoadingUser ? (
        <Loader />
      ) : (
        <>
          <div className='flex items-center md:mb-8 xl:items-start gap-8 flex-col xl:flex-row relative max-w-5xl w-full'>
            <div className='flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7'>
              <img
                src={getImageURL(user.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                alt='profile'
                className='w-28 h-28 lg:h-36 lg:w-36 rounded-full'
              />
              <div className='flex flex-col flex-1 justify-between md:mt-2'>
                <div className='flex flex-col w-full'>
                  <h1 className='text-center xl:text-left h3-bold md:h1-semibold w-full'>{user.name}</h1>
                  <p className='small-regular md:body-medium text-[#7878A3] text-center xl:text-left'>
                    @{user.alias}
                  </p>
                </div>

                <div className='flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20'>
                  <StatBlock value={user.posts.length} label='Posts' />
                  <StatBlock value={user.followers.length} label='Followers' />
                  <StatBlock value={user.following.length} label='Following' />
                </div>

                <p className='small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm'>
                  {user.bio}
                </p>
              </div>

              <div className='flex justify-center gap-4'>
                <div className={cn(currentUser._id !== user._id && 'hidden')}>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <div
                        className={cn(
                          'h-12 bg-light-4 dark:bg-dark-4 px-5 flex-center gap-2 rounded-lg cursor-pointer',
                          currentUser._id !== user._id && 'hidden'
                        )}>
                        <img src='/assets/icons/edit.svg' alt='edit' className='h-5 w-5' />
                        <p className='flex whitespace-nowrap small-medium'>Edit Profile</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className='max-w-lg md:max-w-2xl lg:max-w-5xl'>
                      <EditProfile setOpen={setOpen} />
                    </DialogContent>
                  </Dialog>
                </div>
                <div
                  className={cn(
                    (currentUser._id === profileID || currentUser.alias === profileID) && 'hidden'
                  )}>
                  <Button
                    type='button'
                    className='px-8'
                    disabled={isLoadingFollowUser}
                    onClick={handleFollow}>
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
                </div>
              </div>
            </div>
          </div>

          {user._id === currentUser._id && (
            <div className='flex max-w-5xl w-full'>
              <Link
                className={cn(
                  'flex-center gap-3 py-4 w-full xl:w-48 bg-light-2 dark:bg-dark-2 flex-1 xl:flex-initial rounded-l-lg',
                  pathname === `/profile/${profileID}` && '!bg-light-4 dark:!bg-dark-4'
                )}
                to='/profile/$profileID'
                params={{ profileID: currentUser.alias || currentUser._id }}>
                <img src='/assets/icons/posts.svg' alt='posts' className='h-5 w-5' />
                Posts
              </Link>
              <Link
                className={cn(
                  'flex-center gap-3 py-4 w-full xl:w-48 bg-light-2 dark:bg-dark-2 flex-1 xl:flex-initial',
                  pathname === `/profile/${profileID}/liked` && '!bg-light-4 dark:!bg-dark-4'
                )}
                to='/profile/$profileID/liked'
                params={{ profileID: currentUser.alias || currentUser._id }}>
                <img src='/assets/icons/like.svg' alt='liked' className='h-5 w-5' />
                Liked Posts
              </Link>
              <Link
                className={cn(
                  'flex-center gap-3 py-4 w-full xl:w-48 bg-light-2 dark:bg-dark-2 flex-1 xl:flex-initial rounded-r-lg',
                  pathname === `/profile/${profileID}/saved` && '!bg-light-4 dark:!bg-dark-4'
                )}
                to='/profile/$profileID/saved'
                params={{ profileID: currentUser.alias || currentUser._id }}>
                <img src='/assets/icons/save.svg' alt='saved' className='h-5 w-5' />
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
