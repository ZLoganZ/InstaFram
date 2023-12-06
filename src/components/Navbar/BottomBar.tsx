import { Link, useRouterState } from '@tanstack/react-router';

import { navbarLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';

const BottomBar = () => {
  const routerState = useRouterState();
  
  const { pathname } = routerState.location;

  return (
    <section className='z-50 flex-between w-full sticky bottom-0 rounded-t-[20px] bg-light-2 dark:bg-dark-2 px-5 py-4 md:hidden'>
      {navbarLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <Link
            key={link.label}
            to={link.route}
            className={cn(
              'flex-center flex-col gap-1 p-2 transition group hover:bg-primary rounded-lg',
              isActive && 'bg-primary rounded-lg'
            )}>
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
              className={cn('group-hover:invert-white', isActive && 'invert-white')}
            />
            <p className='tiny-medium text-dark-2 dark:text-light-2'>{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
