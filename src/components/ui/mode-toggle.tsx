import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/hooks/useTheme';

export const ModeToggle = () => {
  const { setTheme, isDark } = useTheme();

  return (
    <Button
      variant='ghost'
      className='justify-start gap-4 py-6 hover:bg-primary transition group'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <Sun className='h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary group-hover:invert-white' />
      <Moon className='absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary group-hover:invert-white' />
      <p className='small-medium lg:base-medium group-hover:invert-white'>Change Theme</p>
    </Button>
  );
};
