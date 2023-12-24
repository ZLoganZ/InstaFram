import { Link, useNavigate, useRouterState } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useSignout } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn, getImageURL } from '@/lib/utils';

const TopBar = () => {
  const { signout } = useSignout();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const { pathname } = routerState.location;

  return (
    <section className='sticky top-0 z-50 md:hidden bg-light-2 dark:bg-dark-2 w-full'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='flex gap-1 items-center'>
          <img src='/assets/images/logo.svg' alt='logo' className='size-9' />
          <p className='font-mono h2-bold select-none'>InstaFram</p>
        </Link>
        <div className='flex gap-4'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <img
                src={getImageURL(currentUser.image, 'miniAvatar') || '/assets/icons/profile-placeholder.svg'}
                className={cn(
                  'size-8 rounded-full select-none',
                  pathname.includes(`/profile/${currentUser._id}`) && 'ring-2 ring-primary'
                )}
                alt='profile'
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel className='flex justify-start items-center gap-3'>
                <img
                  src={getImageURL(currentUser.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
                  className={cn(
                    'ml-3 size-12 rounded-full select-none',
                    pathname.includes(`/profile/${currentUser._id}`) && 'ring-2 ring-primary'
                  )}
                  alt='profile'
                />
                <div className='flex flex-col text-center gap-1'>
                  {currentUser.name} <p className='text-[#7878A3]'>@{currentUser.alias}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='focus:bg-transparent'>
                <Button
                  type='button'
                  variant='ghost'
                  className='justify-start gap-4 py-6 w-full'
                  onClick={() =>
                    navigate({
                      to: '/$profileID',
                      params: { profileID: currentUser.alias || currentUser._id }
                    })
                  }>
                  <img src='/assets/icons/user.svg' alt='logout' className='size-5' />
                  <p className='small-medium lg:base-medium'>View Profile</p>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className='focus:bg-transparent'>
                <ModeToggle topbar />
              </DropdownMenuItem>
              <DropdownMenuItem className='focus:bg-transparent'>
                <Button
                  type='button'
                  variant='ghost'
                  className='justify-start gap-4 py-6 group w-full'
                  onClick={() => signout()}>
                  <img src='/assets/icons/logout.svg' alt='logout' className='size-5' />
                  <p className='small-medium lg:base-medium'>Sign out</p>
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
