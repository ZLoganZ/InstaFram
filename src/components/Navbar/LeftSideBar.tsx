import { Link, NavLink, useLocation } from 'react-router-dom';

import { cn, getImageURL } from '@/lib/utils';
import { sidebarLinks } from '@/lib/constants';
import { useSignout } from '@/lib/hooks/mutation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';

const LeftSideBar = () => {
  const { currentUser } = useAuth();
  const { signout } = useSignout();
  const { pathname } = useLocation();

  return (
    <nav className='hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-light-2 dark:bg-dark-2'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-1 items-center'>
          <img src='/assets/images/logo2.svg' alt='logo' height={36} />
          <p className='font-mono h2-bold select-none'>InstaFram</p>
        </Link>

        <Link to={`/profile/${currentUser._id}`} className='flex gap-3 items-center'>
          <img
            src={getImageURL(currentUser.image, 'avatar') || '/assets/icons/profile-placeholder.svg'}
            alt='profile'
            className={cn(
              'w-14 h-14 rounded-full',
              pathname.includes(`/profile/${currentUser._id}`) && 'ring-2 ring-primary'
            )}
          />
          <div className='flex flex-col'>
            <p className='body-bold'>{currentUser.name}</p>
            <p className='small-regular text-[#7878A3]'>@{currentUser.alias}</p>
          </div>
        </Link>
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={cn(
                  'rounded-lg base-medium hover:bg-primary transition group',
                  isActive && 'bg-primary'
                )}>
                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={cn('group-hover:invert-white', isActive && 'invert-white')}
                  />
                  <p className={cn('group-hover:invert-white', isActive && 'invert-white')}>{link.label}</p>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='flex flex-col gap-4'>
        <ModeToggle />
        <Button
          variant='ghost'
          className='justify-start gap-4 py-6 hover:bg-primary transition group'
          onClick={() => signout()}>
          <img className='group-hover:invert-white' src='/assets/icons/logout.svg' alt='logout' />
          <p className='small-medium lg:base-medium group-hover:invert-white'>Sign Out</p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSideBar;
