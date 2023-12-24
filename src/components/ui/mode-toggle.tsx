import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/hooks/useTheme';
import { cn } from '@/lib/utils';

interface IModeToggleProps {
  topbar?: boolean;
}

export const ModeToggle = ({ topbar }: IModeToggleProps) => {
  const { setTheme, isDark } = useTheme();

  return (
    <Button
      type='button'
      variant='ghost'
      className={cn('justify-start gap-4 py-6 w-full', !topbar && 'hover:bg-primary transition group')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <Sun
        className={cn(
          'size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary',
          !topbar && 'h-6 w-6 group-hover:invert-white'
        )}
      />
      <Moon
        className={cn(
          'absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary',
          !topbar && 'h-6 w-6 group-hover:invert-white'
        )}
      />
      <p className='small-medium lg:base-medium group-hover:invert-white'>Change Theme</p>
    </Button>
  );
};
